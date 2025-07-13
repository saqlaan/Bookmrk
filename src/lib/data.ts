import type { Category, Resource } from './types';

export const initialCategories: Category[] = [
  { id: 'ai', name: 'Artificial Intelligence' },
  { id: 'design', name: 'Design' },
  { id: 'dev', name: 'Development' },
  { id: 'productivity', name: 'Productivity' },
];

export const initialResources: Resource[] = [
  {
    id: '1',
    title: 'Awesome Prompts',
    url: 'https://github.com/f/awesome-chatgpt-prompts',
    description: 'A collection of prompt examples to be used with ChatGPT model.',
    categoryId: 'ai',
  },
  {
    id: '2',
    title: 'Mobbin',
    url: 'https://mobbin.com',
    description: 'The world’s largest UI & UX design reference library.',
    categoryId: 'design',
  },
  {
    id: '3',
    title: 'Developer Roadmaps',
    url: 'https://roadmap.sh',
    description: 'Community-driven roadmaps, guides and other educational content to help guide developers.',
    categoryId: 'dev',
  },
  {
    id: '4',
    title: 'Vercel',
    url: 'https://vercel.com',
    description: 'Develop, Preview, Ship. The platform for frontend developers.',
    categoryId: 'dev',
  },
  {
    id: '5',
    title: 'Linear',
    url: 'https://linear.app',
    description: 'The issue tracking tool you\'ll enjoy using. Meet the new standard for modern software development.',
    categoryId: 'productivity',
  },
    {
    id: '6',
    title: 'Hugging Face',
    url: 'https://huggingface.co',
    description: 'The AI community building the future. Build, train, and deploy state of the art models powered by the reference open source in machine learning.',
    categoryId: 'ai',
  },
];
