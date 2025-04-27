import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function getChatCompletion(messages) {
    const response = await openai.chat.completions.create({
        model: 'gpt-4.1',
        messages,
    });
    return response.choices[0].message;
}

export default openai;
