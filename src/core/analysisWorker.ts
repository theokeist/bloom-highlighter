import { parentPort } from 'worker_threads';
import { analyzeCode } from './languageAnalysis';

parentPort?.on('message', (task: { text: string; language: string; frameworks: boolean; fileName: string }) => {
    try {
        parentPort?.postMessage({ analysis: analyzeCode(task.text, task.language, task.frameworks, task.fileName) });
    } catch (error) {
        parentPort?.postMessage({ error: String(error) });
    }
});
