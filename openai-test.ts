import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import fs from "fs";
import path from "path";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const speechFile = path.resolve("./speech.mp3");

async function main() {
    // const completion = await openai.chat.completions.create({
    //     messages: [{ role: "system", content: "You are a helpful assistant." }],
    //     model: "gpt-3.5-turbo",
    // });
    // console.log(completion.choices[0]);

    const runner = openai.beta.chat.completions
        .runTools({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "user", content: "How is the weather this week?" },
            ],
            tools: [
                {
                    type: "function",
                    function: {
                        function: getCurrentLocation,
                        parameters: { type: "object", properties: {} },
                        description: "Get the user's current location",
                    },
                },
                {
                    type: "function",
                    function: {
                        function: getWeather,
                        parse: JSON.parse, // or use a validation library like zod for typesafe parsing.
                        parameters: {
                            type: "object",
                            properties: {
                                location: { type: "string" },
                            },
                        },
                        description: "Get the weather for a location",
                    },
                },
            ],
        })
        .on("message", (message) => console.log(message));

    const finalContent = await runner.finalContent();
    console.log();
    console.log("Final content:", finalContent);

    // const embedding = await openai.embeddings.create({
    //     model: "text-embedding-ada-002",
    //     input: "The quick brown fox jumped over the lazy dog",
    // });
    // console.log(embedding);
    // const image = await openai.images.generate({
    //     prompt: "A cute baby sea otter",
    // });
    // console.log(image.data);
    // const stream = await openai.chat.completions.create({
    //     model: "gpt-4",
    //     messages: [{ role: "user", content: "Provide a hundred word parable" }],
    //     stream: true,
    // });
    // for await (const chunk of stream) {
    //     const content = process.stdout.write(
    //         chunk.choices[0]?.delta?.content || ""
    //     );
    //     console.log(content);
    // }
    // const mp3 = await openai.audio.speech.create({
    //     model: "tts-1",
    //     voice: "alloy",
    //     input: "Today is a wonderful day to build something people love!",
    // });
    // console.log(speechFile);
    // const buffer = Buffer.from(await mp3.arrayBuffer());
    // await fs.promises.writeFile(speechFile, buffer);
    // const transcription = await openai.audio.transcriptions.create({
    //     file: fs.createReadStream("speech.mp3"),
    //     model: "whisper-1",
    // });
    // console.log(transcription.text);
    // const myAssistant = await openai.beta.assistants.create({
    //     instructions:
    //         "You are a personal math tutor. When asked a question, write and run Python code to answer the question.",
    //     name: "Math Tutor",
    //     tools: [{ type: "code_interpreter" }],
    //     model: "gpt-4",
    // });
    // console.log(myAssistant);
    // const messageThread = await openai.beta.threads.create({
    //     messages: [
    //         {
    //             role: "user",
    //             content: "Hello, what is ChatGPT?",
    //             file_ids: [],
    //         },
    //         {
    //             role: "user",
    //             content: "How does ChatGPT work? Explain it in simple terms.",
    //         },
    //     ],
    // });
    // console.log(messageThread);
    // const myThread = await openai.beta.threads.retrieve("thread_id");
    // console.log(myThread);
    // const threadMessages = await openai.beta.threads.messages.create(
    //     "thread_id",
    //     {
    //         role: "user",
    //         content: "How does AI work? Explain it in simple terms.",
    //     }
    // );
    // console.log(threadMessages);
}

async function getCurrentLocation() {
    return "Boston"; // Simulate lookup
}

async function getWeather(args: { location: string }) {
    const { location } = args;
    // … do lookup …
    return { temperature: "90", precipitation: "10%" };
}

main();
