import * as vscode from 'vscode';
import * as glimmers from '../painter/glimmers';
import { analyzeDocument } from './analyzer';
import { scanBlocks } from './scanner';

/**
 * "True Programmer" Sequencer
 * Persistent dimming for noise, High-contrast for logic.
 */
export async function triggerBloom(editor: vscode.TextEditor) {
    const config = vscode.workspace.getConfiguration('bloom');
    const speed = config.get<number>('speed', 300);

    // Initial Stage: Dim EVERYTHING (The Noise Floor)
    const fullRange = new vscode.Range(
        editor.document.positionAt(0),
        editor.document.positionAt(editor.document.getText().length)
    );
    editor.setDecorations(glimmers.dimNoise, [fullRange]);

    // Analyze Document for "True Keywords"
    const analysis = analyzeDocument(editor.document);
    const blocks = scanBlocks(editor.document);

    await sleep(50);

    // STAGE 1: Block Level Wash (The Geography)
    const depthMap: { [depth: number]: vscode.Range[] } = {};
    blocks.forEach(block => {
        if (!depthMap[block.depth]) depthMap[block.depth] = [];
        depthMap[block.depth].push(block.range);
    });

    Object.keys(depthMap).forEach(depth => {
        editor.setDecorations(glimmers.getBlockWash(parseInt(depth)), depthMap[parseInt(depth)]);
    });

    await sleep(speed / 4);

    // STAGE 2: True Keyword Glimmers (Control Flow)
    editor.setDecorations(glimmers.criticalKeyword, analysis.logicKeywords);
    editor.setDecorations(glimmers.boundaryAnchor, analysis.boundaries);

    await sleep(speed / 4);

    // STAGE 3: Neon Logic Punch-through (Operations)
    editor.setDecorations(glimmers.neonLogic, analysis.logicGates);
    editor.setDecorations(glimmers.neonFlow, [...analysis.comparisons, ...analysis.flowSymbols]);

    // NOTE: We DO NOT cleanup glimmers.dimNoise here.
    // This ensures that variable names and administrative code stay dimmed forever.
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
