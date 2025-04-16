import fs from 'fs';
import { PdfReader } from 'pdfreader';
import 'dotenv/config';
import openai from './utils/openai.js';

const extractTextFromPDF = (filePath) => {
    return new Promise((resolve, reject) => {
        const dataBuffer = fs.readFileSync(filePath);
        let pdfText = '';

        new PdfReader().parseBuffer(dataBuffer, (err, item) => {
            if (err) {
                return reject(err);
            }
            if (!item) {
                return resolve(pdfText); // End of file
            }
            if (item.text) {
                pdfText += item.text + ' ';
            }
        });
    });
};

const cleanText = (text) => {
    return text
        .replace(/\n+/g, ' ')
        .replace(/Page \d+ of \d+/g, '') // remove page numbers
        .replace(/\s+/g, ' ') // extra spaces
        .trim();
};

const testChatGpt = async () => {
    try {
        const rawText = await extractTextFromPDF('./halykbankstatement.pdf');
        const cleanedText = cleanText(rawText);

        const prompt = `
You are an expert data parser.

Below is raw OCR-scanned text extracted from a bank statement PDF.
Your task is to convert it into a strict JSON array.

## Requirements:
- The result must ONLY be a JSON array of objects, no extra text, explanation or commentary.
- If there are multiple accounts, return an array with multiple objects. If only one, the array should have one object.
- Each object must have:
  - "accountDetails": { "accountNumber": string, "currency": string }
  - "transactions": array of { "createdAt": string, "title": string, "amount": number, "type": "INCOME" | "EXPENSE" }
- Use only the debit in account currency for the "amount".
- For "type", it can only be "INCOME" or "EXPENSE".
- For "title", remove the phrase "merchant payment transaction" and keep what follows.

## Example:
[
  {
    "accountDetails": {
      "accountNumber": "KZ123456789",
      "currency": "KZT"
    },
    "transactions": [
      { "createdAt": "2024-04-05", "title": "Starbucks", "amount": 1200, "type": "EXPENSE" },
      { "createdAt": "2024-04-06", "title": "Salary", "amount": 300000, "type": "INCOME" }
    ]
  }
]

## OCR Text:
---BEGIN DATA---
${cleanedText}
---END DATA---

Return ONLY the JSON array. Do not include any explanations.
    `;

        const response = await openai.chat.completions.create({
            model: 'gpt-4-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert data parser.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0,
        });

        console.log(response.choices[0].message.content);
    } catch (error) {
        console.error('Error:', error);
    }
};

testChatGpt();
