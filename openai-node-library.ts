import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import OpenAI from "openai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
    const runner = client.beta.chat.completions
        .runTools({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: "How's the weather this week in Los Angeles?",
                },
            ],
            tools: [
                {
                    type: "function",
                    function: {
                        function: getWeather,
                        parse: GetWeatherParameters.parse,
                        parameters: zodToJsonSchema(
                            GetWeatherParameters
                        ) as any,
                        description: "Get the weather for a location",
                    },
                },
            ],
        })
        .on("message", (message) =>
            console.log("on callback triggered", message)
        );

    const finalContent = await runner.finalContent();
    console.log("Final content:", finalContent);
}

const GetWeatherParameters = z.object({
    location: z.enum([
        "Boston",
        "New York City",
        "Los Angeles",
        "San Francisco",
    ]),
});

async function getWeather(args: z.infer<typeof GetWeatherParameters>) {
    const { location } = args;
    // … do lookup …
    return { temperature: "90", precipitation: "10%" };
}

main();
