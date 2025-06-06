// matchCV.ts - Intégration Qwen + LangChain example
import { LangChainClient } from 'langchain';
import { QwenClient } from 'qwen';

export async function matchCVWithJob(cvText: string, jobDescription: string) {
    const client = new LangChainClient();
    const qwen = new QwenClient();

    const prompt = `Match this CV with the job description and provide a score and summary.

CV: ${cvText}
Job: ${jobDescription}
Output: JSON { score: number, summary: string }`;

    const response = await qwen.generate({ prompt });
    return JSON.parse(response);
}
