// Quiz content (DESIGN.md §5.10, §8.4 #19).
// - The duplicate question 6 from Figma is removed.
// - Correct answers are owner-supplied; until `correct` is filled in, the quiz records
//   the attempt but cannot score it.
import { IMAGES } from './images';
import type { Quiz } from './types';

export const QUIZZES: Record<string, Quiz> = {
  'climate-change': {
    id: 'climate-change',
    title: 'Test your knowledge: Climate Change',
    questions: [
      {
        id: 'q1',
        question: 'Which gas(es) is/are the main driver(s) of climate change?',
        multiple: false,
        options: [
          'Carbon dioxide (CO₂)',
          'Methane (CH₄) and nitrogen dioxide (NO₂)',
          'Nitrogen dioxide (NO₂) and carbon dioxide (CO₂)',
          'Carbon dioxide (CO₂) and methane (CH₄)',
        ],
        correct: [],
      },
      {
        id: 'q2',
        question: 'Climate change is…',
        multiple: false,
        options: [
          'a long-term shift in temperature, precipitation, wind patterns and extreme weather.',
          'the change between the dry and the wet season.',
        ],
        correct: [],
      },
      {
        id: 'q3',
        question: 'The biggest drivers of climate change are… (check all that apply)',
        multiple: true,
        options: ['Industry', 'Livestock', 'Transport', 'Energy'],
        correct: [],
        image: IMAGES.emissionsInfographic,
      },
      {
        id: 'q4',
        question: 'What has caused the rise in temperature over the past 100 years?',
        multiple: false,
        options: ['Animals', 'Human activity', 'Changes in the sun', 'Natural changes that happen every 1,000+ years'],
        correct: [],
      },
      {
        id: 'q5',
        question: 'What is a carbon footprint?',
        multiple: false,
        // The options in Figma ("Industry", "Livestock") don't answer this question.
        options: ['Answer option to be written', 'Answer option to be written'],
        correct: [],
      },
    ],
  },
};
