export const rates = {
    money: .8,
    rigs: 100000,
    mines: 100000,
    farms: 1500000
};

export const f = (f: number) => Math.log((f + 1) * .01) / 500;

//export const loyaltyChange = (amount: number, total: number) => Math.min(3 * Math.random() * (amount / total), .9) || .9;
export const loyaltyChange = (amount: number, total: number) => Math.min((2.4 * amount) / ((total + 1) * 12), .2) || .2;

export const governments = {
    democracy: {
        loyaltyLoss: 0.8,
        loyaltyIncrease: 1.2,
        productivity: 0.9
    },
    monarchy: {
        loyaltyLoss: 1,
        loyaltyIncrease: 1,
        productivity: 1,
    },
    dictatorship: {
        loyaltyLoss: 1.2,
        loyaltyIncrease: 0.8,
        productivity: 1.1,
    }
};