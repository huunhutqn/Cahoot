import { z } from "zod/v4";

export const quizzQuestionValidator = z.object({
  question: z.string().min(1, "Question is required"),
  answers: z
    .array(z.string())
    .min(2, "At least 2 answers required")
    .max(4, "Maximum 4 answers allowed"),
  image: z.string().url().optional(),
  solution: z.number().int().min(0, "Solution index must be 0 or greater"),
  cooldown: z.number().int().min(0, "Cooldown must be 0 or greater"),
  time: z.number().int().min(1, "Time must be at least 1 second"),
});

export const quizzValidator = z.object({
  subject: z.string().min(1, "Subject is required"),
  questions: z
    .array(quizzQuestionValidator)
    .min(1, "At least 1 question required"),
});

export const quizzIdValidator = z.string().regex(/^[a-zA-Z0-9_-]+$/, {
  message: "Quiz ID can only contain letters, numbers, hyphens and underscores",
});

export const createQuizzValidator = z.object({
  id: quizzIdValidator,
  data: quizzValidator,
});

export const updateQuizzValidator = z.object({
  id: quizzIdValidator,
  data: quizzValidator,
});

export const deleteQuizzValidator = z.object({
  id: quizzIdValidator,
});
