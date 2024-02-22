import OpenAI from "openai";
import { Prompt } from "./db";



const openai = new OpenAI({ apiKey: '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' });

export const execPrompt = async (prompt: Prompt, body: string) => {
    return new Promise<string>(async (resolve, reject) => {
        try {

            const completion = await openai.chat.completions.create({
                messages: [{ role: "system", content: `${prompt.prompt.trim().replace(/\s+/g, ' ')} ${body.trim().replace(/\s+/g, ' ')}` }],
                model: "gpt-3.5-turbo-0125",
            });

            const resp = completion.choices[0].message.content?.trim().replace(/\s+/g, ' ');
            console.log(resp);

            resolve(resp + '·');
        } catch (error) {
            reject(error);
        }
    });


}