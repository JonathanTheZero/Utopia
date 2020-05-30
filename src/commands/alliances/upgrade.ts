import { alliance } from "../../utils/interfaces";
import { getAlliance, updateValueForAlliance, addToUSB } from "../../utils/databasehandler";
import "../../utils/utils";

export async function upgradeAlliance(name: string): Promise<string> {
    let price: number, alliance: alliance = await getAlliance(name) as alliance;
    if (alliance.level === 15) return "Your alliance is already on level 15, which is the current maximum level!";
    switch (alliance.level) {
        case 1: price = 500000; break;
        case 2: price = 1000000; break;
        case 3: price = 5000000; break;
        case 4: price = 10000000; break;
        case 5: price = 20000000; break;
        case 6: price = 50000000; break;
        case 7: price = 100000000; break;
        case 8: price = 200000000; break;
        case 9: price = 500000000; break;
        case 10: price = 1000000000; break;
        case 11: price = 2000000000; break;
        case 12: price = 3000000000; break;
        case 13: price = 4000000000; break;
        case 14: price = 5000000000; break;
        default: return "Error";
    }
    if (alliance.money < price!)
        return `you don't have enough money to upgrade your alliance to level ${alliance.level + 1}. Upgrading your alliance to level ${alliance.level + 1} costs ${price!.commafy()} coins.`;
    updateValueForAlliance(name, "money", -price!, "$inc");
    updateValueForAlliance(name, "level", 1, "$inc");
    addToUSB(price!);
    return `Succesfully upgraded your alliance to level ${alliance.level + 1}. Your alliance can now own each farm ${alliance.level + 1} times.`;
}