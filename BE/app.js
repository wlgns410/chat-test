const express = require("express");
const http = require("http");
const cors = require("cors");
const WebSocket = require("ws");
const { SocketLogger } = require("./logs/winston");
const { NewRoom } = require("./types/Room");

// const app = express();

// app.use(cors({ origin: "*" }));

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const room = NewRoom();

wss.on("connection", (ws, req) => {
  const cookie = req.headers.cookie;
  // 기본 사용자 이름 설정 (쿠키가 없을 경우)
  let user = "anonymous";

  if (cookie) {
    const cookies = cookie.split(";").map((c) => c.trim());

    // 'auth' 쿠키를 찾음
    const authCookie = cookies.find((c) => c.startsWith("auth="));

    if (authCookie) {
      [, user] = authCookie.split("="); // 'auth' 쿠키에서 값을 추출
    }
  }

  room.join(ws);

  ws.on("message", (msg) => {
    const jsonMsg = JSON.parse(msg);
    jsonMsg.Name = user;

    room.forwardMessage(jsonMsg);
  });

  ws.on("close", () => {
    room.leave(ws);
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  SocketLogger.info(`Server Started on port = ${PORT}`);
});
