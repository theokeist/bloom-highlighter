import type { DecorationRenderOptions } from 'vscode';

export const categories = ['alert', 'logic', 'mutation', 'guards', 'anchor', 'interface',
    'native', 'prototype', 'structural', 'internal', 'danger', 'functions'] as const;
export type OperationalKey = typeof categories[number];
export type SerializedMapping = Partial<Record<OperationalKey, {
    regex: string;
    style: DecorationRenderOptions;
    examples?: string[];
}>>;

/** Markdown fences contain raw JavaScript regex sources, without slash delimiters. */
export function parseMarkdown(id: string, content: string): SerializedMapping {
    const mapping: SerializedMapping = {};
    for (const section of content.split(/(?:\r?\n|^)##\s+/m).slice(1)) {
        const lines = section.split(/\r?\n/);
        const category = lines[0].trim().toLowerCase() as OperationalKey;
        if (!categories.includes(category)) throw new Error(`${id}: unknown category ${category}`);
        if (lines.some(line => /^status:\s*disabled\s*$/i.test(line.trim()))) continue;
        const regex = lines.find(line => line.trim().startsWith('regex:'))?.match(/`(.+)`/)?.[1];
        const rawStyle = lines.find(line => line.trim().startsWith('style:'))?.match(/(\{.*\})/)?.[1];
        if (!regex || !rawStyle) throw new Error(`${id}/${category}: missing regex or style`);
        const compiled = new RegExp(regex, 'g');
        if (compiled.test('')) throw new Error(`${id}/${category}: regex matches empty input`);
        const style = JSON.parse(rawStyle) as DecorationRenderOptions;
        if (!style || typeof style !== 'object' || Array.isArray(style)) {
            throw new Error(`${id}/${category}: style must be an object`);
        }
        style.opacity = String(style.opacity ?? '1');
        const rawExamples = lines.find(line => line.trim().startsWith('examples:'))?.slice('examples:'.length).trim();
        const examples = rawExamples ? JSON.parse(rawExamples) : undefined;
        if (examples !== undefined && (!Array.isArray(examples) || examples.some(value => typeof value !== 'string'))) {
            throw new Error(`${id}/${category}: examples must be a list of strings`);
        }
        mapping[category] = { regex, style, ...(examples ? { examples } : {}) };
    }
    if (!Object.keys(mapping).length) throw new Error(`${id}: no enabled categories`);
    return mapping;
}
