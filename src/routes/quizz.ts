import {
  createQuizzValidator,
  deleteQuizzValidator,
  quizzIdValidator,
  updateQuizzValidator,
} from "@/common/validators/quizz";
import QuizzService from "@cahoot/socket/services/quizz";
import { Request, Response, Router } from "express";

const router = Router();

// Get all quizzes
router.get("/", async (req: Request, res: Response) => {
  try {
    const quizzes = await QuizzService.getAll();
    res.json(quizzes);
  } catch (error) {
    console.error("Failed to get quizzes:", error);
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
});

// Get a single quiz by ID
router.get("/:id", async (req: Request, res: Response) => {
  const result = quizzIdValidator.safeParse(req.params.id);

  if (result.error) {
    return res.status(400).json({ error: result.error.issues[0].message });
  }

  const id = result.data;

  try {
    const quiz = await QuizzService.getById(id);

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.json(quiz);
  } catch (error) {
    console.error(`Failed to get quiz ${id}:`, error);
    res.status(500).json({ error: "Failed to fetch quiz" });
  }
});

// Create a new quiz
router.post("/", async (req: Request, res: Response) => {
  const result = createQuizzValidator.safeParse(req.body);

  if (result.error) {
    return res.status(400).json({ error: result.error.issues[0].message });
  }

  try {
    const { id, data } = result.data;
    const createResult = await QuizzService.create(id, data);

    if (!createResult.success) {
      return res
        .status(400)
        .json({ error: createResult.error || "Failed to create quiz" });
    }

    const newQuiz = await QuizzService.getById(id);

    if (!newQuiz) {
      return res.status(500).json({ error: "Failed to retrieve created quiz" });
    }

    res.status(201).json(newQuiz);
  } catch (error) {
    console.error("Failed to create quiz:", error);
    res.status(500).json({ error: "Failed to create quiz" });
  }
});

// Update an existing quiz
router.put("/:id", async (req: Request, res: Response) => {
  const idResult = quizzIdValidator.safeParse(req.params.id);

  if (idResult.error) {
    return res.status(400).json({ error: idResult.error.issues[0].message });
  }

  const result = updateQuizzValidator.safeParse({
    id: req.params.id,
    data: req.body,
  });

  if (result.error) {
    return res.status(400).json({ error: result.error.issues[0].message });
  }

  try {
    const { id, data } = result.data;
    const updateResult = await QuizzService.update(id, data);

    if (!updateResult.success) {
      return res
        .status(400)
        .json({ error: updateResult.error || "Failed to update quiz" });
    }

    const updatedQuiz = await QuizzService.getById(id);

    if (!updatedQuiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.json(updatedQuiz);
  } catch (error) {
    console.error("Failed to update quiz:", error);
    res.status(500).json({ error: "Failed to update quiz" });
  }
});

// Delete a quiz
router.delete("/:id", async (req: Request, res: Response) => {
  const result = deleteQuizzValidator.safeParse({ id: req.params.id });

  if (result.error) {
    return res.status(400).json({ error: result.error.issues[0].message });
  }

  try {
    const { id } = result.data;
    const deleteResult = await QuizzService.delete(id);

    if (!deleteResult.success) {
      return res
        .status(400)
        .json({ error: deleteResult.error || "Failed to delete quiz" });
    }

    res.json({ message: "Quiz deleted successfully", id });
  } catch (error) {
    console.error("Failed to delete quiz:", error);
    res.status(500).json({ error: "Failed to delete quiz" });
  }
});

export default router;
