import OpenAI from "openai";
import { Prompt } from "./db";



const openai = new OpenAI({ apiKey: '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' });

export const execPrompt = async (p: Prompt, body: string) => {
    return new Promise<string>(async (resolve, reject) => {
        try {

            const completion = await openai.chat.completions.create({
                messages: [{ role: "system", content: `${p.prompt.trim().replace(/\s+/g, ' ')} ${body.trim().replace(/\s+/g, ' ')}` }],
                model: p.model,
            });

            const resp = completion.choices[0].message.content?.trim().replace(/\s+/g, ' ');
            console.log(resp);

            resolve(resp + '·');
        } catch (error) {
            reject(error);
        }
    });


}