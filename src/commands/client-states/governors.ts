import { getRandomRange } from "../../utils/utils";
import { trait } from "../../utils/interfaces";
import { traits } from "./consts";
//@ts-ignore  -> no *.d.ts
import randomeName from "node-random-name";


export default class Governor {
    name: string = this.generateName();
    startingDate: Date = new Date();
    age: number = Math.floor(getRandomRange(25, 50));
    traits: [trait, trait, trait] = <[trait, trait, trait]>traits.sort(() => 0.5 - Math.random()).slice(0, 3);
    gender: "male" | "female" = Math.random() > 0.5 ? "male" : "female";

    constructor() { }

    private generateName(): string {
        return randomeName({ gender: this.gender });
    }
};