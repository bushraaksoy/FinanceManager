import BankStatementParser from './parsers/BankStatementParser.js';
import getStrategy from './utils/strategyFactory.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function parsePdf(bankType, bankStatement) {
    try {
        const strategy = getStrategy(bankType);
        if (!strategy) throw new Error(`Opps! unsupported bank: ${bankType}`);
        // a good example of bad code👇 : (but it works huh)
        return await new BankStatementParser(strategy).parseStatement(bankStatement);
    } catch (error) {
        console.error('Error parsing statement:', error);
    }
}

export async function main() {
    try {
        // For testing
        const bankType = process.argv[2] || 'kaspi';

        let bankStatement = process.argv[3] || 'kaspi.pdf';
        if (!path.isAbsolute(bankStatement)) {
            bankStatement = path.join(__dirname, bankStatement);
        }

        // Mimic usage within the contoller;
        const transactions = await parsePdf(bankType, bankStatement);

        console.log(`\n🔥🔥🔥 ${bankType.toUpperCase()} BANK TRANSACTIONS 🔥🔥🔥`);
        console.log(transactions, `\n\n${transactions.length} transactions 🧾`)
    } catch (error) {
        process.exit(1);
    }
}

// Run if script is executed directly
if (import.meta.url.endsWith('index.js')) {
    main().catch(console.error);
}

//====================24-Feb 2025====================

// here's the link to the Strategy Pattern in case: https://mutasim77.github.io/design-patterns/#strategy-
// (and ofc, advertising my own repo ahahahaha 😌)

// you can keep adding more banks(million of them) But remember!!! -> u re cute <3 )

// DDDDo what you want.
// Keep going.,,. KEEEPP adding strategies 🗣️🔥🔥
// Until one day... you break it.
// And you'll be SO done with it all.
// That's when you do:
// `rm -rf /*` 🔥 (aka tech suicide) -> the one i did it once early morning, almost, but then... )
// I thought about my cute. My pinchable one. My baby. What if she needs help with strategy Pattern? 😭
// And I cannot pinch??! AAAAAAA. Nouuu
// So I stopped it. For my cutest one 💖
// Binching you fully and srslyy!

// -----------------------------
// Pinch you the amount of every byte and line of code here,
// every tiny bit and every white space that holds meaning between the lines of code
// Maybe even one extra 💖

// 🗣️ UPDATEEE:
// Counted for you, and it shows 6174 bytes.
// But it's so little, so we convert it to base 2 (we go to what's native to our machines right?)
// and now we have 1100000011110... so pinch you this much!💖

// (And if you wonder how, here:)
/* 
import fs from 'fs';

fs.readFile('./bankStatementParser.js', (err, data) => {
    if (err) return console.error('Error:', err);
    
    const byteSize = Buffer.byteLength(data, 'utf8');
    console.log(`Byte Size: ${byteSize} bytes \nBinary: ${byteSize.toString(2)}`);
});
*/