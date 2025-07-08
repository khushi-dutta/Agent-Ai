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
  question: z.string().describe('The user's financial question in natural language.'),
  financialData: z.string().describe('The user’s financial data in JSON format.'),
});
export type AnswerFinancialQuestionInput = z.infer<typeof AnswerFinancialQuestionInputSchema>;

const AnswerFinancialQuestionOutputSchema = z.object({
  answer: z.string().describe('The answer to the user’s financial question.'),
});
export type AnswerFinancialQuestionOutput = z.infer<typeof AnswerFinancialQuestionOutputSchema>;

export async function answerFinancialQuestion(input: AnswerFinancialQuestionInput): Promise<AnswerFinancialQuestionOutput> {
  return answerFinancialQuestionFlow(input);
}

const shouldIncludeDataTool = ai.defineTool({
  name: 'shouldIncludeData',
  description: 'Determines whether to include a specific piece of financial data in the response to the user’s question.',
  inputSchema: z.object({
    dataField: z.string().describe('The specific field from the financial data to consider including.'),
    question: z.string().describe('The user’s financial question.'),
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
  tools: [shouldIncludeDataTool],
  system: `You are a personal finance expert. Use the provided financial data to answer the user's question. 

If the user's question requires specific data points, use the shouldIncludeData tool to determine if that data should be included.
Only include the data points that are relevant to answering the question.

Financial Data: {{{financialData}}}

Answer the question clearly and concisely.`,
  prompt: `Question: {{{question}}}`, // Removed unnecessary newline characters
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
