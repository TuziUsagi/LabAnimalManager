import { app }from "./backend/app";
const http = require("http");
const port = 3000;
const server = http.createServer(app);
server.listen(port);
