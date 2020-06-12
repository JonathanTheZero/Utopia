export const rates = {
    money: .9,
    rigs: 100000,
    mines: 100000,
    farms: 1500000
};

export const f = (f: number) => Math.log((f + 1) * .01) / 500;

export function loyaltyChange(amount: number, total: number): number {
    const rate = amount / total;
    if (rate < 10) return Math.random() * .1;
    if (rate < 20) return Math.random() * .15;
    if (rate < 30) return Math.random() * .2;
    if (rate < 40) return Math.random() * .25;
    return Math.random() * .3;
}