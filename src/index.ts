import { Server } from "@/common/types/game/socket";
import { inviteCodeValidator } from "@/common/validators/auth";
import {
  createQuizzValidator,
  deleteQuizzValidator,
  quizzIdValidator,
  updateQuizzValidator,
} from "@/common/validators/quizz";
import env from "@cahoot/socket/env";
import Config from "@cahoot/socket/services/config";
import Game from "@cahoot/socket/services/game";
import QuizzService from "@cahoot/socket/services/quizz";
import Registry from "@cahoot/socket/services/registry";
import { withGame } from "@cahoot/socket/utils/game";
import { Server as ServerIO } from "socket.io";

const io: Server = new ServerIO({
  cors: {
    origin: [env.WEB_ORIGIN],
  },
});
Config.init();

const registry = Registry.getInstance();
// ưu tiên PORT từ môi trường (Hostinger sẽ set), nếu không có thì dùng PORT trong env của bạn
const port = process.env.PORT ?? env.PORT ?? 3001;

console.log(`Socket server running on port ${port}`);
io.listen(Number(port));

io.on("connection", (socket) => {
  console.log(
    `A user connected: socketId: ${socket.id}, clientId: ${socket.handshake.auth.clientId}`,
  );

  socket.on("player:reconnect", ({ gameId }) => {
    const game = registry.getPlayerGame(gameId, socket.handshake.auth.clientId);

    if (game) {
      game.reconnect(socket);

      return;
    }

    socket.emit("game:reset", "Game not found");
  });

  socket.on("manager:reconnect", ({ gameId }) => {
    const game = registry.getManagerGame(
      gameId,
      socket.handshake.auth.clientId,
    );

    if (game) {
      game.reconnect(socket);

      return;
    }

    socket.emit("game:reset", "Game expired");
  });

  socket.on("manager:auth", (password) => {
    try {
      const config = Config.game();

      if (password !== config.managerPassword) {
        socket.emit("manager:errorMessage", "Invalid password");

        return;
      }

      socket.emit("manager:quizzList", Config.quizz());
    } catch (error) {
      console.error("Failed to read game config:", error);
      socket.emit("manager:errorMessage", "Failed to read game config");
    }
  });

  socket.on("game:create", (quizzId) => {
    const quizzList = Config.quizz();
    const quizz = quizzList.find((q) => q.id === quizzId);

    if (!quizz) {
      socket.emit("game:errorMessage", "Quizz not found");

      return;
    }

    const game = new Game(io, socket, quizz);
    registry.addGame(game);
  });

  socket.on("player:join", (inviteCode) => {
    const result = inviteCodeValidator.safeParse(inviteCode);

    if (result.error) {
      socket.emit("game:errorMessage", result.error.issues[0].message);

      return;
    }

    const game = registry.getGameByInviteCode(inviteCode);

    if (!game) {
      socket.emit("game:errorMessage", "Game not found");

      return;
    }

    socket.emit("game:successRoom", game.gameId);
  });

  socket.on("player:login", ({ gameId, data }) =>
    withGame(gameId, socket, (game) => game.join(socket, data.username)),
  );

  socket.on("manager:kickPlayer", ({ gameId, playerId }) =>
    withGame(gameId, socket, (game) => game.kickPlayer(socket, playerId)),
  );

  socket.on("manager:startGame", ({ gameId }) =>
    withGame(gameId, socket, (game) => game.start(socket)),
  );

  socket.on("player:selectedAnswer", ({ gameId, data }) =>
    withGame(gameId, socket, (game) =>
      game.selectAnswer(socket, data.answerKey),
    ),
  );

  socket.on("manager:abortQuiz", ({ gameId }) =>
    withGame(gameId, socket, (game) => game.abortRound(socket)),
  );

  socket.on("manager:nextQuestion", ({ gameId }) =>
    withGame(gameId, socket, (game) => game.nextRound(socket)),
  );

  socket.on("manager:showLeaderboard", ({ gameId }) =>
    withGame(gameId, socket, (game) => game.showLeaderboard()),
  );

  // ==================== QUIZ CRUD OPERATIONS ====================

  // Get all quizzes
  socket.on("quizz:getAll", async () => {
    try {
      const quizzes = await QuizzService.getAll();
      socket.emit("quizz:list", quizzes);
    } catch (error) {
      console.error("Failed to get quizzes:", error);
      socket.emit("quizz:error", "Failed to fetch quizzes");
    }
  });

  // Get a single quiz by ID
  socket.on("quizz:getById", async (id) => {
    const result = quizzIdValidator.safeParse(id);

    if (result.error) {
      socket.emit("quizz:error", result.error.issues[0].message);
      return;
    }

    try {
      const quiz = await QuizzService.getById(id);

      if (!quiz) {
        socket.emit("quizz:error", "Quiz not found");
        return;
      }

      socket.emit("quizz:single", quiz);
    } catch (error) {
      console.error(`Failed to get quiz ${id}:`, error);
      socket.emit("quizz:error", "Failed to fetch quiz");
    }
  });

  // Create a new quiz
  socket.on("quizz:create", async (payload) => {
    const result = createQuizzValidator.safeParse(payload);

    if (result.error) {
      socket.emit("quizz:error", result.error.issues[0].message);
      return;
    }

    try {
      const { id, data } = result.data;
      const createResult = await QuizzService.create(id, data);

      if (!createResult.success) {
        socket.emit(
          "quizz:error",
          createResult.error || "Failed to create quiz",
        );
        return;
      }

      const newQuiz = await QuizzService.getById(id);
      if (!newQuiz) {
        socket.emit("quizz:error", "Failed to retrieve created quiz");
        return;
      }
      socket.emit("quizz:created", newQuiz);

      // Broadcast to all connected clients
      io.emit("quizz:updated");
    } catch (error) {
      console.error("Failed to create quiz:", error);
      socket.emit("quizz:error", "Failed to create quiz");
    }
  });

  // Update an existing quiz
  socket.on("quizz:update", async (payload) => {
    const result = updateQuizzValidator.safeParse(payload);

    if (result.error) {
      socket.emit("quizz:error", result.error.issues[0].message);
      return;
    }

    try {
      const { id, data } = result.data;
      const updateResult = await QuizzService.update(id, data);

      if (!updateResult.success) {
        socket.emit(
          "quizz:error",
          updateResult.error || "Failed to update quiz",
        );
        return;
      }

      const updatedQuiz = await QuizzService.getById(id);
      if (updatedQuiz) {
        socket.emit("quizz:updated", updatedQuiz);
      }

      // Broadcast to all connected clients
      io.emit("quizz:updated");
    } catch (error) {
      console.error("Failed to update quiz:", error);
      socket.emit("quizz:error", "Failed to update quiz");
    }
  });

  // Delete a quiz
  socket.on("quizz:delete", async (payload) => {
    const result = deleteQuizzValidator.safeParse(payload);

    if (result.error) {
      socket.emit("quizz:error", result.error.issues[0].message);
      return;
    }

    try {
      const { id } = result.data;
      const deleteResult = await QuizzService.delete(id);

      if (!deleteResult.success) {
        socket.emit(
          "quizz:error",
          deleteResult.error || "Failed to delete quiz",
        );
        return;
      }

      socket.emit("quizz:deleted", { id });

      // Broadcast to all connected clients
      io.emit("quizz:updated");
    } catch (error) {
      console.error("Failed to delete quiz:", error);
      socket.emit("quizz:error", "Failed to delete quiz");
    }
  });

  // ==================== END QUIZ CRUD OPERATIONS ====================

  socket.on("disconnect", () => {
    console.log(`A user disconnected : ${socket.id}`);

    const managerGame = registry.getGameByManagerSocketId(socket.id);

    if (managerGame) {
      managerGame.manager.connected = false;
      registry.markGameAsEmpty(managerGame);

      if (!managerGame.started) {
        console.log("Reset game (manager disconnected)");
        managerGame.abortCooldown();
        io.to(managerGame.gameId).emit("game:reset", "Manager disconnected");
        registry.removeGame(managerGame.gameId);

        return;
      }
    }

    const game = registry.getGameByPlayerSocketId(socket.id);

    if (!game) {
      return;
    }

    const player = game.players.find((p) => p.id === socket.id);

    if (!player) {
      return;
    }

    if (!game.started) {
      game.players = game.players.filter((p) => p.id !== socket.id);

      io.to(game.manager.id).emit("manager:removePlayer", player.id);
      io.to(game.gameId).emit("game:totalPlayers", game.players.length);

      console.log(`Removed player ${player.username} from game ${game.gameId}`);

      return;
    }

    player.connected = false;
    io.to(game.gameId).emit("game:totalPlayers", game.players.length);
  });
});

process.on("SIGINT", () => {
  Registry.getInstance().cleanup();
  process.exit(0);
});

process.on("SIGTERM", () => {
  Registry.getInstance().cleanup();
  process.exit(0);
});
