import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/v4";

const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "production"])
      .optional()
      .default("development"),
    WEB_ORIGIN: z.string().optional().default("http://localhost:3000"),
    PORT: z.string().optional().default("3001"),
  },

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    WEB_ORIGIN: process.env.WEB_ORIGIN,
    PORT: process.env.PORT,
  },
});

export default env;
