export const rates = {
    money: 35,
    rigs: 100000,
    mines: 100000,
    farms: 1500000
};

export const f: (f: number) => number = f => Math.log((f + 1) * .01) / 500;