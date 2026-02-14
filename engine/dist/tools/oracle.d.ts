export interface RollOracleParams {
    table: string;
    subtype?: string;
}
export interface OracleYesNoParams {
    odds: "almost_certain" | "likely" | "even" | "unlikely" | "nearly_impossible";
    question: string;
}
export declare function oracleYesNo(params: OracleYesNoParams): {
    question: string;
    odds: "almost_certain" | "likely" | "even" | "unlikely" | "nearly_impossible";
    threshold: number;
    roll: number;
    result: string;
};
export declare function rollOracle(params: RollOracleParams): {
    table: string;
    roll: Record<string, number>;
    result: Record<string, string>;
} | {
    table: string;
    roll: number;
    result: any;
} | {
    subtype?: string | undefined;
    table: string;
    roll: number;
    result: unknown;
};
//# sourceMappingURL=oracle.d.ts.map