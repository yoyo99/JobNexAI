// src/lib/marketTrends.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Mock API call to fetch market trends
export const fetchMarketTrends = () => __awaiter(void 0, void 0, void 0, function* () {
    // Simulate API call delay
    yield new Promise((resolve) => setTimeout(resolve, 1000));
    // Mock data for market trends
    const mockData = {
        skillsInHighDemand: [
            {
                id: "skill-1",
                category: "AI/Machine Learning",
                description: "Strong demand for AI and Machine Learning specialists.",
                details: ["Deep Learning", "Natural Language Processing", "Computer Vision"],
            },
            {
                id: "skill-2",
                category: "Cybersecurity",
                description: "Increasing demand for cybersecurity experts.",
                details: ["Penetration Testing", "Threat Intelligence", "Security Architecture"],
            },
            {
                id: "skill-3",
                category: "Cloud Computing",
                description: "High demand for cloud computing professionals.",
                details: ["AWS", "Azure", "Google Cloud Platform"],
            },
        ],
        growingSectors: [
            {
                id: "sector-1",
                category: "Renewable Energy",
                description: "Renewable energy sector is experiencing significant growth.",
                details: ["Solar Energy", "Wind Energy", "Energy Storage"],
            },
            {
                id: "sector-2",
                category: "HealthTech",
                description: "HealthTech sector is rapidly expanding.",
                details: ["Telemedicine", "Digital Health", "Health Data Analytics"],
            },
            {
                id: "sector-3",
                category: "E-commerce",
                description: "E-commerce continues to grow exponentially.",
                details: ["Online Retail", "Logistics", "Digital Marketing"],
            },
        ],
        salaryTrends: [
            {
                id: "salary-1",
                category: "AI/ML Engineers",
                description: "AI/ML Engineers are seeing substantial salary increases.",
                details: ["Average increase of 15% year-over-year", "High demand and limited supply"],
            },
            {
                id: "salary-2",
                category: "Cybersecurity Analysts",
                description: "Cybersecurity Analysts' salaries are on the rise.",
                details: ["Average increase of 12% year-over-year", "Increased threat landscape"],
            },
            {
                id: "salary-3",
                category: "Cloud Architects",
                description: "Cloud Architects are highly compensated.",
                details: ["Average increase of 10% year-over-year", "Cloud adoption across industries"],
            },
        ],
    };
    return mockData;
});
