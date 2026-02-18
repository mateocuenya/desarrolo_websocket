const http = require("http");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");

const server = http.createServer((req, res) => {
    if (req.url === "/") {
        const filePath = path.join(__dirname, "index.html");

        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end("Error cargando archivo");
                return;
            }

            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
        });
    }
});

const wss = new WebSocket.Server({ server });

// 🔐 Usuarios simulados (usuario: contraseña)
const usersDB = {
    "juan": "1234",
    "maria": "abcd",
    "admin": "admin"
};

let connectedUsers = new Map(); // socket -> username

function broadcast(data) {
    const message = JSON.stringify(data);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

function isUsernameTaken(username) {
    for (let user of connectedUsers.values()) {
        if (user === username) return true;
    }
    return false;
}

wss.on("connection", (socket) => {

    socket.on("message", (message) => {

        let data;
        try {
            data = JSON.parse(message.toString());
        } catch {
            return;
        }

        // LOGIN
        if (data.type === "login") {

            const username = data.user?.trim();
            const password = data.password?.trim();

            if (!username || !password) {
                socket.send(JSON.stringify({
                    type: "loginError",
                    message: "Usuario y contraseña requeridos."
                }));
                return;
            }

            if (!usersDB[username] || usersDB[username] !== password) {
                socket.send(JSON.stringify({
                    type: "loginError",
                    message: "Credenciales incorrectas."
                }));
                return;
            }

            if (isUsernameTaken(username)) {
                socket.send(JSON.stringify({
                    type: "loginError",
                    message: "Usuario ya conectado."
                }));
                return;
            }

            connectedUsers.set(socket, username);

            socket.send(JSON.stringify({
                type: "loginSuccess",
                user: username
            }));

            broadcast({
                type: "system",
                message: `${username} ha entrado al chat.`
            });

            return;
        }

        // MENSAJES
        if (data.type === "message") {

            if (!connectedUsers.has(socket)) return;

            const username = connectedUsers.get(socket);
            const msg = data.message?.trim();

            if (!msg || msg.length > 200) return;

            broadcast({
                type: "message",
                user: username,
                message: msg,
                time: new Date().toLocaleTimeString()
            });
        }

        // LOGOUT
        if (data.type === "logout") {
            const username = connectedUsers.get(socket);
            connectedUsers.delete(socket);

            broadcast({
                type: "system",
                message: `${username} ha salido del chat.`
            });
        }
    });

    socket.on("close", () => {
        const username = connectedUsers.get(socket);
        if (username) {
            connectedUsers.delete(socket);
            broadcast({
                type: "system",
                message: `${username} se desconectó.`
            });
        }
    });
});

server.listen(3000, () => {
    console.log("Servidor en http://localhost:3000");
});
