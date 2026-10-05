import type { TextDocument } from 'vscode';
import { Worker } from 'worker_threads';
import * as path from 'path';
import type { CodeAnalysis } from './codeAnalysis';

interface Task {
    document: TextDocument;
    text: string;
    language: string;
    fileName: string;
    frameworks: boolean;
    cancelled: boolean;
    resolve: (analysis: CodeAnalysis | undefined) => void;
    reject: (error: Error) => void;
}

/** One worker, one latest queued draft per document, and a versioned promise cache. */
export class AnalysisService {
    private readonly worker = new Worker(path.join(__dirname, 'analysisWorker.js'));
    private queue = new Map<TextDocument, Task>();
    private active?: Task;
    private disposed = false;
    private cache = new WeakMap<TextDocument, {
        version: number;
        language: string;
        frameworks: boolean;
        promise: Promise<CodeAnalysis | undefined>;
    }>();

    constructor() {
        this.worker.unref();
        this.worker.on('message', (message: { analysis?: CodeAnalysis; error?: string }) => {
            const task = this.active;
            this.active = undefined;
            if (task && !task.cancelled) {
                if (message.error) task.reject(new Error(message.error));
                else task.resolve(message.analysis);
            }
            this.startNext();
        });
        this.worker.on('error', error => {
            this.active?.reject(error);
            this.active = undefined;
            this.queue.forEach(task => task.reject(error));
            this.queue.clear();
            this.disposed = true;
        });
    }

    public analyze(document: TextDocument, frameworks: boolean): Promise<CodeAnalysis | undefined> {
        if (this.disposed) return Promise.resolve(undefined);
        const cached = this.cache.get(document);
        if (cached && cached.version === document.version && cached.language === document.languageId && cached.frameworks === frameworks) {
            return cached.promise;
        }
        const prior = this.queue.get(document);
        prior?.resolve(undefined);
        const promise = new Promise<CodeAnalysis | undefined>((resolve, reject) => {
            this.queue.set(document, { document, text: document.getText(), language: document.languageId,
                fileName: document.fileName, frameworks, cancelled: false, resolve, reject });
        });
        this.cache.set(document, { version: document.version, language: document.languageId, frameworks, promise });
        this.startNext();
        return promise;
    }

    private startNext(): void {
        if (this.active || this.disposed) return;
        const next = this.queue.values().next().value as Task | undefined;
        if (!next) return;
        this.queue.delete(next.document);
        this.active = next;
        this.worker.postMessage({ text: next.text, language: next.language, frameworks: next.frameworks, fileName: next.fileName });
    }

    public cancel(document: TextDocument): void {
        this.cache.delete(document);
        this.queue.get(document)?.resolve(undefined);
        this.queue.delete(document);
        if (this.active?.document === document) {
            this.active.cancelled = true;
            this.active.resolve(undefined);
        }
    }

    public dispose(): void {
        if (this.disposed) return;
        this.disposed = true;
        this.active?.resolve(undefined);
        this.queue.forEach(task => task.resolve(undefined));
        this.queue.clear();
        void this.worker.terminate();
    }
}
