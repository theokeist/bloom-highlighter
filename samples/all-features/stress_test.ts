/**
 * Bloom TypeScript/JS Stress Test
 * Testing: Interfaces, Types, Prototypes, Mutation, and Flow.
 */

import { OperationalKey } from './core';

export interface UserProfile extends BaseEntity {
    id: string;
    readonly name: string;
    metadata?: Map<string, any>;
}

type Callback = (err: Error | null, result: any) => Promise<void>;

class HeavyLogicProcessor<T> implements Processor<T> {
    private _state: T;
    protected static VERSION = "1.0.2";

    constructor(initial: T) {
        this._state = initial;
    }

    public async process(input: T): Promise<T> {
        let result = input;

        try {
            if (result === undefined || result === null) {
                throw new Error("Invalid Input");
            }

            // Mutation Test
            result = { ...result, processed: true };
            this._state = result;

            // Logic Test
            const isValid = (this._state !== null) && (typeof result === 'object');

            return isValid ? result : input;
        } catch (e) {
            console.error(e);
            return input;
        }
    }
}

// Prototype/Native test
HeavyLogicProcessor.prototype.toString = function() {
    return `[Processor ${this._state}]`;
};

const myMap = new Map<string, HeavyLogicProcessor<any>>();
myMap.set("core", new HeavyLogicProcessor({ data: 100 }));
