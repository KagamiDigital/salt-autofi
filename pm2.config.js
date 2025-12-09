module.exports = {
  apps: [
    {
      name: "salt-autofi-server",
      script: "dist/bundle.js",
      interpreter: "node",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
