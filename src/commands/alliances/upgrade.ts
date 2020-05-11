import { alliance } from "../../utils/interfaces";
import { getAlliance, updateValueForAlliance, addToUSB } from "../../utils/databasehandler";

export async function upgradeAlliance(name: string): Promise<string> {
    let alliance: alliance = await getAlliance(name) as alliance;
    if (alliance.level === 1) {
        if (alliance.money < 500000)
            return "you don't have enough money to upgrade your alliance to level 2. Upgrading your alliance to level 2 costs 500,000 coins.";
        updateValueForAlliance(name, "money", -500000, "$inc");
        updateValueForAlliance(name, "level", 2, "$set");
        addToUSB(500000);
        return "Succesfully upgraded your alliance to level 2. Your alliance can now own each farm two times.";
    } else if (alliance.level === 2) {
        if (alliance.money < 1000000)
            return "you don't have enough money to upgrade your alliance to level 3. Upgrading your alliance to level 3 costs 1,000,000 coins.";
        updateValueForAlliance(name, "money", -1000000, "$inc");
        updateValueForAlliance(name, "level", 3, "$set");
        addToUSB(1000000);
        return "Succesfully upgraded your alliance to level 3. Your alliance can now own each farm three times.";
    } else if (alliance.level === 3) {
        if (alliance.money < 5000000)
            return "you don't have enough money to upgrade your alliance to level 4. Upgrading your alliance to level 4 costs 5,000,000 coins.";
        updateValueForAlliance(name, "money", -5000000, "$inc");
        updateValueForAlliance(name, "level", 4, "$set");
        addToUSB(5000000);
        return "Succesfully upgraded your alliance to level 4. Your alliance can now own each farm four times.";
    } else if (alliance.level === 4) {
        if (alliance.money < 10000000)
            return "you don't have enough money to upgrade your alliance to level 5. Upgrading your alliance to level 5 costs 10,000,000 coins.";
        updateValueForAlliance(name, "money", -10000900, "$inc");
        updateValueForAlliance(name, "level", 5, "$set");
        addToUSB(10000000);
        return "Succesfully upgraded your alliance to level 5. Your alliance can now own each farm five times.";
    } else if (alliance.level === 5) {
        if (alliance.money < 20000000)
            return "you don't have enough money to upgrade your alliance to level 6. Upgrading your alliance to level 6 costs 20,000,000 coins.";
        updateValueForAlliance(name, "money", -20000000, "$inc");
        updateValueForAlliance(name, "level", 6, "$set");
        addToUSB(20000000);
        return "Succesfully upgraded your alliance to level 6. Your alliance can now own each farm six times.";
    } else if (alliance.level === 6) {
        if (alliance.money < 50000000)
            return "you don't have enough money to upgrade your alliance to level 7. Upgrading your alliance to level 7 costs 50,000,000 coins.";
        updateValueForAlliance(name, "money", -50000000, "$inc");
        updateValueForAlliance(name, "level", 7, "$set");
        addToUSB(50000000);
        return "Succesfully upgraded your alliance to level 7. Your alliance can now own each farm seven times.";
    } else if (alliance.level === 7) {
        if (alliance.money < 100000000)
            return "you don't have enough money to upgrade your alliance to level 8. Upgrading your alliance to level 8 costs 100,000,000 coins.";
        updateValueForAlliance(name, "money", -100000000, "$inc");
        updateValueForAlliance(name, "level", 8, "$set");
        addToUSB(100000000);
        return "Succesfully upgraded your alliance to level 8. Your alliance can now own each farm eight times.";
    } else if (alliance.level === 8) {
        if (alliance.money < 200000000)
            return "you don't have enough money to upgrade your alliance to level 9. Upgrading your alliance to level 9 costs 200,000,000 coins.";
        updateValueForAlliance(name, "money", -200000000, "$inc");
        updateValueForAlliance(name, "level", 9, "$set");
        addToUSB(200000000);
        return "Succesfully upgraded your alliance to level 9. Your alliance can now own each farm nine times.";
    } else if (alliance.level === 9) {
        if (alliance.money < 500000000)
            return "you don't have enough money to upgrade your alliance to level 10. Upgrading your alliance to level 10 costs 500,000,000 coins.";
        updateValueForAlliance(name, "money", -500000000, "$inc");
        updateValueForAlliance(name, "level", 10, "$set");
        addToUSB(500000000);
        return "Succesfully upgraded your alliance to level 10. Your alliance can now own each farm 10 times.";
    } else if (alliance.level === 10) {
        if (alliance.money < 1000000000)
            return "you don't have enough money to upgrade your alliance to level 10. Upgrading your alliance to level 10 costs 1,000,000,000 coins.";
        updateValueForAlliance(name, "money", -1000000000, "$inc");
        updateValueForAlliance(name, "level", 11, "$set");
        addToUSB(1000000000);
        return "Succesfully upgraded your alliance to level 11. Your alliance can now own each farm 11 times.";
    } else if (alliance.level === 11) {
        if (alliance.money < 5000000000)
            return "you don't have enough money to upgrade your alliance to level 10. Upgrading your alliance to level 10 costs 5,000,000,000 coins.";
        updateValueForAlliance(name, "money", -5000000000, "$inc");
        updateValueForAlliance(name, "level", 12, "$set");
        addToUSB(5000000000);
        return "Succesfully upgraded your alliance to level 12. Your alliance can now own each farm 12 times.";
    } else if (alliance.level === 12) {
        if (alliance.money < 10000000000)
            return "you don't have enough money to upgrade your alliance to level 10. Upgrading your alliance to level 10 costs 10,000,000,000 coins.";
        updateValueForAlliance(name, "money", -10000000000, "$inc");
        updateValueForAlliance(name, "level", 13, "$set");
        addToUSB(10000000000);
        return "Succesfully upgraded your alliance to level 13. Your alliance can now own each farm 13 times.";
    } else if (alliance.level === 13) {
        if (alliance.money < 50000000000)
            return "you don't have enough money to upgrade your alliance to level 10. Upgrading your alliance to level 10 costs 50,000,000,000 coins.";
        updateValueForAlliance(name, "money", -50000000000, "$inc");
        updateValueForAlliance(name, "level", 14, "$set");
        addToUSB(50000000000);
        return "Succesfully upgraded your alliance to level 14. Your alliance can now own each farm 14 times.";
    }
    else if (alliance.level === 14) {
        if (alliance.money < 100000000000)
            return "you don't have enough money to upgrade your alliance to level 10. Upgrading your alliance to level 10 costs 100,000,000,000 coins.";
        updateValueForAlliance(name, "money", -100000000000, "$inc");
        updateValueForAlliance(name, "level", 15, "$set");
        addToUSB(100000000000);
        return "Succesfully upgraded your alliance to level 15. Your alliance can now own each farm 15 times.";
    }
    return "Your alliance is already on level 15, which is the current maximum level!";
}