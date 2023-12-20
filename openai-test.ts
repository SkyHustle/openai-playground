import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
    // const completion = await openai.chat.completions.create({
    //     messages: [{ role: "system", content: "You are a helpful assistant." }],
    //     model: "gpt-3.5-turbo",
    // });

    // console.log(completion.choices[0]);

    // const embedding = await openai.embeddings.create({
    //     model: "text-embedding-ada-002",
    //     input: "The quick brown fox jumped over the lazy dog",
    // });

    // console.log(embedding);

    // const image = await openai.images.generate({
    //     prompt: "A cute baby sea otter",
    // });

    // console.log(image.data);

    const stream = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: "Provide a hundred word parable" }],
        stream: true,
    });

    for await (const chunk of stream) {
        const content = process.stdout.write(
            chunk.choices[0]?.delta?.content || ""
        );
        console.log(content);
    }
}

main();
