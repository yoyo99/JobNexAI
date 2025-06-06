// matchCV.ts - Intégration Qwen + LangChain example
// import { LangChainClient } from 'langchain';
// import { QwenClient } from 'qwen'; // Qwen import temporarily disabled

// Retrieve Qwen API Key from environment variables
// const qwenApiKey = process.env.QWEN_API_KEY;

// if (!qwenApiKey) {
//   throw new Error('QWEN_API_KEY is not set in environment variables. Please configure it for the function to work.');
// }

export async function matchCVWithJob(cvText: string, jobDescription: string): Promise<{ score: number; summary: string }> {
    // Qwen related code has been temporarily commented out to allow Netlify build.
    console.warn("AI matching (Qwen) is temporarily disabled in matchCVWithJob.");
    return Promise.resolve({ score: 0, summary: "AI matching functionality is temporarily disabled." });

    // --- The following is the original Qwen logic, now commented out for reference ---
    // // Note: LangChainClient initialization might also require configuration or API keys
    // // depending on the specific LLM or service it's configured to use.
    // // For now, assuming it's set up elsewhere or uses its own environment variables.
    // // const langchainClient = new LangChainClient(); // Placeholder, might need API keys

    // // Initialize QwenClient with the API key
    // // The exact way to pass the API key might vary based on the qwen SDK.
    // // Common patterns are new QwenClient({ apiKey: qwenApiKey }) or new QwenClient(qwenApiKey)
    // // Adjust if the Qwen SDK documentation specifies a different method.
    // const qwen = new QwenClient({ apiKey: qwenApiKey! }); // Assert qwenApiKey is non-null

    // const prompt = `Match this CV with the job description and provide a score and summary.

    // CV: ${cvText}
    // Job: ${jobDescription}
    // Output: JSON { score: number, summary: string }`;

    // // Assuming the qwen client has a method like 'generate' that accepts a prompt
    // // and returns a promise resolving to the LLM's response.
    // // The actual method and parameters might differ.
    // const response = await qwen.generate({ prompt }); // This is a guess, adjust to actual SDK

    // // Assuming the response from Qwen is a JSON string that needs parsing.
    // // Add error handling for JSON parsing if the response might not be valid JSON.
    // try {
    //     if (response && response.output && typeof response.output.text === 'string') {
    //         const parsedResult = JSON.parse(response.output.text);

    //         if (typeof parsedResult.score === 'number' && typeof parsedResult.summary === 'string') {
    //             return { score: parsedResult.score, summary: parsedResult.summary };
    //         } else {
    //             console.error("Parsed Qwen response does not match expected structure:", parsedResult);
    //             throw new Error("AI response structure mismatch.");
    //         }
    //     } else {
    //         console.error("Invalid response structure from Qwen:", response);
    //         throw new Error("AI response format unexpected.");
    //     }
    // } catch (error) {
    //     console.error("Failed to parse Qwen response:", error);
    //     console.error("Raw Qwen response:", response);
    //     throw new Error("AI response was not valid JSON.");
    // }
    // --- End of original Qwen logic ---
}
