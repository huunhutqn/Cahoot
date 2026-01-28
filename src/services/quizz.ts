import { Quizz, QuizzWithId } from "@/common/types/game";
import fsSync from "fs";
import fs from "fs/promises";
import { resolve } from "path";

const inContainerPath = process.env.CONFIG_PATH;

const getPath = (path: string = "") =>
  inContainerPath
    ? resolve(inContainerPath, path)
    : resolve(process.cwd(), "config", path);

class QuizzService {
  // In-memory cache for quiz data
  private static cache: Map<string, QuizzWithId> = new Map();
  private static cacheTimestamp: number = 0;
  private static readonly CACHE_TTL = 60000; // 60 seconds

  /**
   * Get all quizzes (with caching)
   */
  static async getAll(): Promise<QuizzWithId[]> {
    // Check if cache is still valid
    const now = Date.now();
    if (this.cache.size > 0 && now - this.cacheTimestamp < this.CACHE_TTL) {
      return Array.from(this.cache.values());
    }

    const quizzPath = getPath("quizz");

    // Check if directory exists (sync check is OK for directory)
    if (!fsSync.existsSync(quizzPath)) {
      return [];
    }

    try {
      const files = await fs.readdir(quizzPath);
      const jsonFiles = files.filter((file) => file.endsWith(".json"));

      const quizzes = await Promise.all(
        jsonFiles.map(async (file) => {
          const data = await fs.readFile(getPath(`quizz/${file}`), "utf-8");
          const config = JSON.parse(data);
          const id = file.replace(".json", "");

          return {
            id,
            ...config,
          } as QuizzWithId;
        }),
      );

      // Update cache
      this.cache.clear();
      quizzes.forEach((quiz) => this.cache.set(quiz.id, quiz));
      this.cacheTimestamp = now;

      return quizzes;
    } catch (error) {
      console.error("Failed to read quizz config:", error);
      return [];
    }
  }

  /**
   * Get all quizzes synchronously (for backward compatibility)
   */
  static getAllSync(): QuizzWithId[] {
    const quizzPath = getPath("quizz");

    if (!fsSync.existsSync(quizzPath)) {
      return [];
    }

    try {
      const files = fsSync
        .readdirSync(quizzPath)
        .filter((file) => file.endsWith(".json"));

      const quizz: QuizzWithId[] = files.map((file) => {
        const data = fsSync.readFileSync(getPath(`quizz/${file}`), "utf-8");
        const config = JSON.parse(data);
        const id = file.replace(".json", "");

        return {
          id,
          ...config,
        };
      });

      return quizz || [];
    } catch (error) {
      console.error("Failed to read quizz config:", error);
      return [];
    }
  }

  /**
   * Get a single quiz by ID (async)
   */
  static async getById(id: string): Promise<QuizzWithId | null> {
    // Check cache first
    if (this.cache.has(id)) {
      const cached = this.cache.get(id);
      if (cached && Date.now() - this.cacheTimestamp < this.CACHE_TTL) {
        return cached;
      }
    }

    const filePath = getPath(`quizz/${id}.json`);

    try {
      const data = await fs.readFile(filePath, "utf-8");
      const config = JSON.parse(data);
      const quiz: QuizzWithId = { id, ...config };

      // Update cache
      this.cache.set(id, quiz);

      return quiz;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        console.error(`Failed to read quizz ${id}:`, error);
      }
      return null;
    }
  }

  /**
   * Get a single quiz by ID (sync - for backward compatibility)
   */
  static getByIdSync(id: string): QuizzWithId | null {
    const filePath = getPath(`quizz/${id}.json`);

    if (!fsSync.existsSync(filePath)) {
      return null;
    }

    try {
      const data = fsSync.readFileSync(filePath, "utf-8");
      const config = JSON.parse(data);

      return {
        id,
        ...config,
      };
    } catch (error) {
      console.error(`Failed to read quizz ${id}:`, error);
      return null;
    }
  }

  /**
   * Create a new quiz (async)
   */
  static async create(
    id: string,
    data: Quizz,
  ): Promise<{ success: boolean; error?: string }> {
    const filePath = getPath(`quizz/${id}.json`);

    // Check if quiz already exists
    try {
      await fs.access(filePath);
      return { success: false, error: "Quiz already exists" };
    } catch {
      // File doesn't exist, continue
    }

    // Ensure quizz directory exists
    const quizzDir = getPath("quizz");
    try {
      await fs.mkdir(quizzDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    try {
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");

      // Invalidate cache
      this.invalidateCache();

      return { success: true };
    } catch (error) {
      console.error(`Failed to create quizz ${id}:`, error);
      return { success: false, error: "Failed to write file" };
    }
  }

  /**
   * Update an existing quiz (async)
   */
  static async update(
    id: string,
    data: Quizz,
  ): Promise<{ success: boolean; error?: string }> {
    const filePath = getPath(`quizz/${id}.json`);

    // Check if quiz exists
    try {
      await fs.access(filePath);
    } catch {
      return { success: false, error: "Quiz not found" };
    }

    try {
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");

      // Invalidate cache
      this.invalidateCache();

      return { success: true };
    } catch (error) {
      console.error(`Failed to update quizz ${id}:`, error);
      return { success: false, error: "Failed to write file" };
    }
  }

  /**
   * Delete a quiz (async)
   */
  static async delete(
    id: string,
  ): Promise<{ success: boolean; error?: string }> {
    const filePath = getPath(`quizz/${id}.json`);

    // Check if quiz exists
    try {
      await fs.access(filePath);
    } catch {
      return { success: false, error: "Quiz not found" };
    }

    try {
      await fs.unlink(filePath);

      // Invalidate cache
      this.invalidateCache();

      return { success: true };
    } catch (error) {
      console.error(`Failed to delete quizz ${id}:`, error);
      return { success: false, error: "Failed to delete file" };
    }
  }

  /**
   * Invalidate cache
   */
  static invalidateCache(): void {
    this.cache.clear();
    this.cacheTimestamp = 0;
  }

  /**
   * Get cache stats (for monitoring)
   */
  static getCacheStats(): {
    size: number;
    age: number;
    ttl: number;
  } {
    return {
      size: this.cache.size,
      age: Date.now() - this.cacheTimestamp,
      ttl: this.CACHE_TTL,
    };
  }
}

export default QuizzService;
