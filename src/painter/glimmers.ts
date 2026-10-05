import * as vscode from 'vscode';

/**
 * Glimmer Styles - Visual Hierarchy for "True Keywords"
 * Everything else remains dimmed (Neutralized Noise).
 */

// PERSISTENT DIM: The Noise Floor (Low Contrast)
export const dimNoise = vscode.window.createTextEditorDecorationType({
    color: '#a1a1aa', // Lighter zinc for better readability
    opacity: '0.4',    // Higher visibility for noise text
    fontWeight: 'normal',
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
});

// TRUE KEYWORDS: Critical Control Flow (if, return, etc.)
export const criticalKeyword = vscode.window.createTextEditorDecorationType({
    color: '#10f097', // Neon Green for flow state
    fontWeight: 'bold',
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
});

// NEON ACTION: Logic Gates (&&, ||, !)
export const neonLogic = vscode.window.createTextEditorDecorationType({
    color: '#00ffff', // Pure Cyan
    fontWeight: '900',
    backgroundColor: 'rgba(0, 255, 255, 0.12)',
    borderRadius: '2px',
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
});

// NEON FLOW: Comparisons & Ternaries (===, =>, ?)
export const neonFlow = vscode.window.createTextEditorDecorationType({
    color: '#ff318c', // Neon Pink/Red for decision points
    fontWeight: '800',
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
});

// BOUNDARIES: Subtle Anchors ({}, [], ())
export const boundaryAnchor = vscode.window.createTextEditorDecorationType({
    color: '#d4d4d8', // Brighter grey for structure
    fontWeight: 'bold',
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
});

// The Block Level Wash Cache
const washCache: { [depth: number]: vscode.TextEditorDecorationType } = {};

export function getBlockWash(depth: number): vscode.TextEditorDecorationType {
    if (!washCache[depth]) {
        const hues = [220, 260, 300, 340];
        washCache[depth] = vscode.window.createTextEditorDecorationType({
            backgroundColor: `hsla(${hues[depth % 4]}, 60%, 50%, 0.04)`,
            isWholeLine: true,
            rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
        });
    }
    return washCache[depth];
}
