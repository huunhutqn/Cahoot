module.exports = {
  apps: [
    {
      name: "cahoot-socket",
      script: "dist/index.cjs",
      env_file: ".env.production",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      error_file: "logs/error.log",
      out_file: "logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm Z",
    },
  ],
};
