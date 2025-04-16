import KaspiBankStrategy from "../strategies/KaspiBankStrategy.js";
import HalykBankStrategy from "../strategies/HalykBankStrategy.js";
import JusanBankStrategy from "../strategies/JusanBankStrategy.js";

// strategy Factory -> for dynamiclly selecting users' bank
export default function getStrategy(bankType) {
    // u can place it somewhere else even and get rid of this function. but it's just better and more readable.
    const strategies = {
        kaspi: new KaspiBankStrategy(),
        halyk: new HalykBankStrategy(),
        jusan: new JusanBankStrategy(),
    };

    const strategy = strategies[bankType.toLowerCase()];

    if (!strategy) {
        throw new Error(`Unsupported bank type: ${bankType}`);
    }

    return strategy;
}