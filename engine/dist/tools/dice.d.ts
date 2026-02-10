export interface RollResult {
    expression: string;
    rolls: number[];
    modifier: number;
    total: number;
}
export declare function parseAndRoll(expression: string): RollResult;
export interface DiceToolParams {
    expression: string;
    purpose?: string;
    advantage?: boolean;
    disadvantage?: boolean;
}
export interface DiceToolResult {
    expression: string;
    rolls: number[];
    modifier: number;
    total: number;
    advantage?: {
        rolls: [number[], number[]];
        chosen: "first" | "second";
    };
    purpose?: string;
}
export declare function rollDice(params: DiceToolParams): DiceToolResult;
//# sourceMappingURL=dice.d.ts.map