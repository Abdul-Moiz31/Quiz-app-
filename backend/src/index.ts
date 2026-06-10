import express from "express";
import http from "http";
import path from "path";
import fs from "fs";
import { Iomanager } from "./Managers/Iomanager";
import { UserManager } from "./Managers/Usermanager";

const PORT = Number(process.env.PORT) || 3000;

const app = express();
const server = http.createServer(app);

// Health check for deployment platforms (Render / Railway / Fly).
app.get("/health", (_req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
});

// Serve the built frontend (single-service deploy). The frontend builds to
// ../../Frontend/dist relative to the compiled backend (backend/dist).
const frontendDist = path.resolve(__dirname, "../../Frontend/dist");
if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    app.get("*", (_req, res) => {
        res.sendFile(path.join(frontendDist, "index.html"));
    });
}

const io = Iomanager.init(server);
const userManager = new UserManager();

io.on("connection", (socket) => {
    userManager.addUser(socket);
});

server.listen(PORT, () => {
    console.log(`Quiz server listening on http://localhost:${PORT}`);
});
