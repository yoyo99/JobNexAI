// Simple test for matchCV.ts
import { matchCVWithJob } from '../lib/langchain/matchCV';

test('matchCVWithJob returns score and summary', async () => {
    const cv = "Expérience en développement logiciel.";
    const job = "Développeur logiciel avec expérience en React.";
    const result = await matchCVWithJob(cv, job);
    expect(result).toHaveProperty('score');
    expect(result).toHaveProperty('summary');
});
