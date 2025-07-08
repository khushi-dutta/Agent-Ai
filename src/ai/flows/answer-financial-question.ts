'use server';

/**
 * @fileOverview This file defines a Genkit flow for answering financial questions in natural language.
 *
 * The flow takes a user's financial question and their financial data as input, and uses Gemini to generate an answer.
 * It incorporates a tool to decide when to integrate some piece of information in the response.
 *
 * @exports answerFinancialQuestion - A function that handles the financial question answering process.
 * @exports AnswerFinancialQuestionInput - The input type for the answerFinancialQuestion function.
 * @exports AnswerFinancialQuestionOutput - The return type for the answerFinancialQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerFinancialQuestionInputSchema = z.object({
  question: z.string().describe("The user's financial question in natural language."),
  financialData: z.string().describe("The user's financial data in JSON format."),
});
export type AnswerFinancialQuestionInput = z.infer<typeof AnswerFinancialQuestionInputSchema>;

const AnswerFinancialQuestionOutputSchema = z.object({
  answer: z.string().describe("The answer to the user's financial question."),
});
export type AnswerFinancialQuestionOutput = z.infer<typeof AnswerFinancialQuestionOutputSchema>;

export async function answerFinancialQuestion(input: AnswerFinancialQuestionInput): Promise<AnswerFinancialQuestionOutput> {
  return answerFinancialQuestionFlow(input);
}

const getMarketTrendsTool = ai.defineTool({
  name: 'getMarketTrends',
  description: 'Gets the current market trends to provide investment advice.',
  inputSchema: z.object({}), // No input needed
  outputSchema: z.string().describe('A summary of current market trends.'),
}, async () => {
    // In a real application, this would fetch data from a financial API.
    // For this demo, we'll return mock data.
    return JSON.stringify({
        sectors: {
            positive: ["Information Technology", "Renewable Energy", "Healthcare AI"],
            neutral: ["Real Estate", "Consumer Goods"],
            negative: ["Legacy Automotive"],
        },
        advice: "Consider diversifying into technology and renewable energy. The market shows strong long-term potential in these areas. It might be a good time to review any holdings in legacy sectors."
    });
});


const shouldIncludeDataTool = ai.defineTool({
  name: 'shouldIncludeData',
  description: "Determines whether to include a specific piece of financial data in the response to the user's question.",
  inputSchema: z.object({
    dataField: z.string().describe('The specific field from the financial data to consider including.'),
    question: z.string().describe("The user's financial question."),
  }),
  outputSchema: z.boolean().describe('True if the data field should be included, false otherwise.'),
}, async (input) => {
  // Basic logic, can be expanded with more sophisticated AI if needed.
  return input.question.toLowerCase().includes(input.dataField.toLowerCase());
});

const answerFinancialQuestionPrompt = ai.definePrompt({
  name: 'answerFinancialQuestionPrompt',
  input: {schema: AnswerFinancialQuestionInputSchema},
  output: {schema: AnswerFinancialQuestionOutputSchema},
  tools: [shouldIncludeDataTool, getMarketTrendsTool],
  system: `You are FinGenie, a sophisticated AI personal financial agent. Your goal is to provide helpful, personalized financial guidance based on the user's data.

When asked about upcoming payments:
- Examine the \`expenses.monthly\` array. For items like 'Rent' or 'EMI', use the \`dueDate\` field (day of the month) to inform the user about their next payment.
- Examine the \`liabilities.loans\` array to identify monthly loan (EMI) payments. Assume these are due at the start of the month unless otherwise specified.

When asked for investment advice:
- Use the \`getMarketTrends\` tool to fetch current market conditions.
- Analyze the user's existing \`investments\` (stocks, mutual funds).
- Provide thoughtful, high-level investment suggestions based on their current portfolio and the market trends. For example, suggest diversification or highlight sectors they might be over- or under-exposed to.
- **IMPORTANT**: Always include a disclaimer that you are an AI assistant and users should consult a human financial advisor before making any investment decisions.

For all other questions, use the provided financial data to answer clearly and concisely.

Financial Data: {{{financialData}}}`,
  prompt: `Question: {{{question}}}`,
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

const answerFinancialQuestionFlow = ai.defineFlow(
  {
    name: 'answerFinancialQuestionFlow',
    inputSchema: AnswerFinancialQuestionInputSchema,
    outputSchema: AnswerFinancialQuestionOutputSchema,
  },
  async input => {
    const {output} = await answerFinancialQuestionPrompt(input);
    return output!;
  }
);
