const { createServer } = require("http");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const port = 3001;

const app = next({ dev, customServer: true });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      await handle(req, res);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  })
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`Front listening on port ${port}`);
    });
});
