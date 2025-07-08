'use server';

/**
 * @fileOverview A Genkit flow that generates smart financial insights based on user data.
 *
 * - generateFinancialInsights - A function that analyzes financial data to produce insights.
 * - GenerateFinancialInsightsInput - The input type (stringified JSON of financial data).
 * - GenerateFinancialInsightsOutput - The return type, containing an array of insights.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const InsightSchema = z.object({
    title: z.string().describe("A short, catchy title for the insight."),
    description: z.string().describe("A one-sentence description explaining the insight."),
    category: z.enum(['warning', 'success', 'info', 'opportunity']).describe("The category of the insight."),
    value: z.string().describe("A key metric or value, e.g., '+₹5,000' or '+12.5% returns'."),
    callToAction: z.string().describe("A short, actionable suggestion or button text, e.g., 'Review patterns' or 'Explore options'."),
});

export type Insight = z.infer<typeof InsightSchema>;

const GenerateFinancialInsightsInputSchema = z.object({
  financialData: z.string().describe("The user's complete financial data in JSON format."),
});
export type GenerateFinancialInsightsInput = z.infer<typeof GenerateFinancialInsightsInputSchema>;

const GenerateFinancialInsightsOutputSchema = z.object({
    insights: z.array(InsightSchema).describe("An array of 4 smart financial insights."),
});
export type GenerateFinancialInsightsOutput = z.infer<typeof GenerateFinancialInsightsOutputSchema>;

export async function generateFinancialInsights(input: GenerateFinancialInsightsInput): Promise<GenerateFinancialInsightsOutput> {
  return generateFinancialInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFinancialInsightsPrompt',
  input: {schema: GenerateFinancialInsightsInputSchema},
  output: {schema: GenerateFinancialInsightsOutputSchema},
  system: `You are an expert financial analyst named FinGenie. Your task is to analyze a user's financial data and provide exactly 4 smart insights. These insights should be actionable, easy to understand, and cover different financial areas.

Analyze the provided financial data and generate insights covering these areas:
1.  **Spending Anomalies**: Look for unusual spending in any category. Frame as a 'warning'.
2.  **Savings/Goals Progress**: Comment on their savings rate or progress towards a financial goal. Frame as a 'success'.
3.  **Investment Performance**: Analyze the performance of their investments (stocks, SIPs, mutual funds). Frame as an 'info'.
4.  **Opportunities**: Identify potential opportunities, like tax savings or increasing investments. Frame as an 'opportunity'.

For each insight, you must determine the appropriate category. Your response must be a valid JSON object matching the required output schema.

Financial Data: {{{financialData}}}`,
  prompt: `Generate 4 smart insights based on the provided data.`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const generateFinancialInsightsFlow = ai.defineFlow(
  {
    name: 'generateFinancialInsightsFlow',
    inputSchema: GenerateFinancialInsightsInputSchema,
    outputSchema: GenerateFinancialInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
