import { randomInt } from "node:crypto";
const DICE_RE = /^(\d+)d(\d+)([+-]\d+)?$/i;
export function parseAndRoll(expression) {
    const match = expression.replace(/\s/g, "").match(DICE_RE);
    if (!match) {
        throw new Error(`Invalid dice expression: "${expression}". Use NdS+M format (e.g. 2d6+3).`);
    }
    const count = parseInt(match[1], 10);
    const sides = parseInt(match[2], 10);
    const modifier = match[3] ? parseInt(match[3], 10) : 0;
    if (count < 1 || count > 100)
        throw new Error("Dice count must be 1-100.");
    if (sides < 2 || sides > 100)
        throw new Error("Dice sides must be 2-100.");
    const rolls = [];
    for (let i = 0; i < count; i++) {
        rolls.push(randomInt(1, sides + 1));
    }
    const total = rolls.reduce((a, b) => a + b, 0) + modifier;
    let expr = `${count}d${sides}`;
    if (modifier > 0)
        expr += `+${modifier}`;
    else if (modifier < 0)
        expr += String(modifier);
    return { expression: expr, rolls, modifier, total };
}
export function rollDice(params) {
    const { expression, purpose, advantage, disadvantage } = params;
    const useAdvantage = advantage && !disadvantage;
    const useDisadvantage = disadvantage && !advantage;
    if (useAdvantage || useDisadvantage) {
        const first = parseAndRoll(expression);
        const second = parseAndRoll(expression);
        const chooseFirst = useAdvantage
            ? first.total >= second.total
            : first.total <= second.total;
        const chosen = chooseFirst ? first : second;
        return {
            expression: chosen.expression,
            rolls: chosen.rolls,
            modifier: chosen.modifier,
            total: chosen.total,
            advantage: {
                rolls: [first.rolls, second.rolls],
                chosen: chooseFirst ? "first" : "second",
            },
            ...(purpose ? { purpose } : {}),
        };
    }
    const result = parseAndRoll(expression);
    return {
        ...result,
        ...(purpose ? { purpose } : {}),
    };
}
//# sourceMappingURL=dice.js.map