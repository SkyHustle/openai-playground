import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
    const assistant = await openai.beta.assistants.create({
        name: "Math Tutor",
        instructions:
            "You are a personal math tutor. Write and run code to answer math questions.",
        tools: [{ type: "code_interpreter" }],
        model: "gpt-4-1106-preview",
    });
    console.log("Assistant created: ", assistant);

    const thread = await openai.beta.threads.create();
    console.log("Thread created: ", thread);

    const message = await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content:
            "I need to solve the equation `3x + 11 = 14`. Can you help me?",
    });
    console.log("Message created: ", message);

    const threadMessages = await openai.beta.threads.messages.list(thread.id);
    console.log("Thread messages: ", threadMessages.data);

    const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistant.id,
        instructions:
            "Please address the user as Sky Hustle. The user has a premium account.",
    });
    console.log("Run created: ", run);

    const retrievedRun = await openai.beta.threads.runs.retrieve(
        thread.id,
        run.id
    );
    console.log("Run retrieved: ", retrievedRun);

    const messages = await openai.beta.threads.messages.list(thread.id);

    for (const message of messages.data) {
        // Log the content of each message
        console.log("Message content: ", message.content);
    }
}

main();
