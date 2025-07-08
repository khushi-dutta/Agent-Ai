'use server';

/**
 * @fileOverview A flow that projects financial outcomes based on user-defined parameters.
 *
 * - projectFinancialOutcomes - A function that projects financial outcomes.
 * - ProjectFinancialOutcomesInput - The input type for the projectFinancialOutcomes function.
 * - ProjectFinancialOutcomesOutput - The return type for the projectFinancialOutcomes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProjectFinancialOutcomesInputSchema = z.object({
  savings: z.number().describe('Current total savings.'),
  annualIncome: z.number().describe('Current annual income.'),
  monthlyExpenses: z.number().describe('Current monthly expenses.'),
  annualSavingsRate: z.number().describe('The annual savings rate as a percentage.'),
  yearsToProject: z.number().describe('The number of years to project financial outcomes.'),
  assumedInvestmentReturnRate: z.number().describe('The assumed annual investment return rate as a percentage.'),
  additionalContext: z.string().optional().describe('Any additional context or financial goals.'),
});
export type ProjectFinancialOutcomesInput = z.infer<typeof ProjectFinancialOutcomesInputSchema>;

const ProjectFinancialOutcomesOutputSchema = z.object({
  projectedSavings: z.array(z.number()).describe('An array of projected savings for each year.'),
  totalProjectedSavings: z.number().describe('The total projected savings after the specified number of years.'),
  summary: z.string().describe('A summary of the projected financial outcomes, including key observations and recommendations.'),
});
export type ProjectFinancialOutcomesOutput = z.infer<typeof ProjectFinancialOutcomesOutputSchema>;

export async function projectFinancialOutcomes(input: ProjectFinancialOutcomesInput): Promise<ProjectFinancialOutcomesOutput> {
  return projectFinancialOutcomesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'projectFinancialOutcomesPrompt',
  input: {schema: ProjectFinancialOutcomesInputSchema},
  output: {schema: ProjectFinancialOutcomesOutputSchema},
  prompt: `You are a financial advisor helping users project their financial future based on their current financial situation and goals.

  Given the following financial information:
  - Current Savings: {{{savings}}}
  - Annual Income: {{{annualIncome}}}
  - Monthly Expenses: {{{monthlyExpenses}}}
  - Annual Savings Rate: {{{annualSavingsRate}}}%
  - Years to Project: {{{yearsToProject}}}
  - Assumed Investment Return Rate: {{{assumedInvestmentReturnRate}}}%
  - Additional Context: {{{additionalContext}}}

  Project the user's financial outcomes for the specified number of years. Calculate the projected savings for each year, considering income, expenses, savings rate, and investment returns.

  Provide a summary of the projected financial outcomes, including key observations and recommendations. Specifically, calculate the total projected savings after the specified number of years, and return this value in totalProjectedSavings.

  The projected savings for each year should be stored in the projectedSavings array.

  Ensure the output is properly formatted JSON.
  `,
});

const projectFinancialOutcomesFlow = ai.defineFlow(
  {
    name: 'projectFinancialOutcomesFlow',
    inputSchema: ProjectFinancialOutcomesInputSchema,
    outputSchema: ProjectFinancialOutcomesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
