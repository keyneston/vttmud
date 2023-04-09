const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  const expressBackend = createProxyMiddleware({
    target: "http://localhost:3001",
    changeOrigin: true,
  });

  app.use("/api", expressBackend);
  app.use("/upload", expressBackend);
};
