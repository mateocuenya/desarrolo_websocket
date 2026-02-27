const http = require("http");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");

const usuarios = {
  admin: "1234",
  juan: "abcd",
  test: "test"
};


const server = http.createServer((req, res) => {
  let filePath = "./public" + (req.url === "/" ? "/login.html" : req.url);
  const ext = path.extname(filePath);

  let tipope = "text/html";
  if (ext === ".css") tipope = "text/css";
  if (ext === ".js") tipope = "text/javascript";

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end("Archivo no encontrado");
    } else {
      res.writeHead(200, { "Content-Type": tipope });
      res.end(content);
    }
  });
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Usuario conectado");

  ws.on("message", (message) => {

    console.log("Mensaje recibido en servidor:", message.toString());
    const data = JSON.parse(message);

    // 🔹 LOGIN
    if (data.type === "login") {
      const { usuario, contrasena } = data;

      if (usuarios[usuario] && usuarios[usuario] === contrasena) {
        ws.send(JSON.stringify({
          type: "login_exito"
        }));
      } else {
        ws.send(JSON.stringify({
          type: "login_error",
          message: "Usuario o contraseña incorrectos"
        }));
      }
      return;
    }

    // MENSAJES DE CHAT
    if (data.type === "chat") {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: "chat",
            user: data.user,
            text: data.text
          }));
        }
      });
    }
  });

  ws.on("close", () => {
    console.log("Usuario desconectado");
  });
});


server.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});
