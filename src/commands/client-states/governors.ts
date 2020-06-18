import { getRandomRange } from "../../utils/utils";
import { trait } from "../../utils/interfaces";
import { traits } from "./consts";

export default class Governor {
    name: string = this.generateName();
    startingDate: Date = new Date();
    age: number = getRandomRange(25, 50);
    traits: [trait, trait, trait];

    constructor() { }

    private generateName(): string {
        return "s";
    }
};