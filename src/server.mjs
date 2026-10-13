import { createServer } from "node:http";
import { greet } from "./index.ts";

const server = createServer((_request, response) => {
  response.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
  response.end(greet("world"));
});

const port = Number(process.env.PORT ?? 3000);
server.listen(port, "0.0.0.0", () => {
  console.log(`Development server listening on http://localhost:${port}`);
});
