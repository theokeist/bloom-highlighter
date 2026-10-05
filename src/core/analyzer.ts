import * as vscode from 'vscode';

/**
 * "True Programmer" Analyzer
 * Filters for Logic, Flow, and Critical Ops.
 */

export interface AnalysisResult {
    logicKeywords: vscode.Range[];    // if, else, return, await, try, etc.
    logicGates: vscode.Range[];       // &&, ||, !, ??
    comparisons: vscode.Range[];      // ===, !==, ==, !=, >=, <=
    flowSymbols: vscode.Range[];      // =>, ?, : (ternary)
    boundaries: vscode.Range[];       // {}, [], ()
}

export function analyzeDocument(document: vscode.TextDocument): AnalysisResult {
    const text = document.getText();
    const result: AnalysisResult = {
        logicKeywords: [],
        logicGates: [],
        comparisons: [],
        flowSymbols: [],
        boundaries: []
    };

    // 1. True Keywords (Flow Control)
    const keywordRegex = /\b(if|else|return|await|async|try|catch|switch|case|break|continue|throw|yield)\b/g;

    // 2. Logic Gates (Operations)
    const gateRegex = /([&]{2}|[|]{2}|[!](?![=])|[?]{2})/g;

    // 3. Comparisons (Decision points)
    const comparisonRegex = /([=]{2,3}|[!][=]{1,2}|[<>][=]?)/g;

    // 4. Flow Control Symbols
    const flowRegex = /([=][>]|[?]|(?<![:]):(?![:]))/g;

    // 5. Structural Boundaries (Critical for spatial awareness)
    const boundaryRegex = /[{}[\]()]/g;

    let match;

    while ((match = keywordRegex.exec(text)) !== null) {
        result.logicKeywords.push(new vscode.Range(document.positionAt(match.index), document.positionAt(match.index + match[0].length)));
    }

    while ((match = gateRegex.exec(text)) !== null) {
        result.logicGates.push(new vscode.Range(document.positionAt(match.index), document.positionAt(match.index + match[0].length)));
    }

    while ((match = comparisonRegex.exec(text)) !== null) {
        result.comparisons.push(new vscode.Range(document.positionAt(match.index), document.positionAt(match.index + match[0].length)));
    }

    while ((match = flowRegex.exec(text)) !== null) {
        result.flowSymbols.push(new vscode.Range(document.positionAt(match.index), document.positionAt(match.index + match[0].length)));
    }

    while ((match = boundaryRegex.exec(text)) !== null) {
        result.boundaries.push(new vscode.Range(document.positionAt(match.index), document.positionAt(match.index + match[0].length)));
    }

    return result;
}
