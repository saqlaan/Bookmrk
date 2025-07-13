'use server';
/**
 * @fileOverview An AI flow to summarize a URL.
 *
 * - summarizeUrl - A function that takes a URL and returns a title and description.
 * - SummarizeUrlInput - The input type for the summarizeUrl function.
 * - SummarizeUrlOutput - The return type for the summarizeUrl function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeUrlInputSchema = z.object({
  url: z.string().url().describe('The URL to summarize.'),
});
export type SummarizeUrlInput = z.infer<typeof SummarizeUrlInputSchema>;

const SummarizeUrlOutputSchema = z.object({
  title: z
    .string()
    .describe('A concise, user-friendly title for the content of the URL.'),
  description: z
    .string()
    .describe(
      'A one-sentence summary of the content of the URL.'
    ),
});
export type SummarizeUrlOutput = z.infer<typeof SummarizeUrlOutputSchema>;

export async function summarizeUrl(input: SummarizeUrlInput): Promise<SummarizeUrlOutput> {
  return summarizeUrlFlow(input);
}

const summarizeUrlPrompt = ai.definePrompt({
  name: 'summarizeUrlPrompt',
  input: {schema: SummarizeUrlInputSchema},
  output: {schema: SummarizeUrlOutputSchema},
  prompt: `Visit the following URL and provide a concise, user-friendly title and a one-sentence summary of its content.

URL: {{{url}}}`,
});

const summarizeUrlFlow = ai.defineFlow(
  {
    name: 'summarizeUrlFlow',
    inputSchema: SummarizeUrlInputSchema,
    outputSchema: SummarizeUrlOutputSchema,
  },
  async (input) => {
    const {output} = await summarizeUrlPrompt(input);
    return output!;
  }
);
