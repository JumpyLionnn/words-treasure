console.log("importing packages...");
const sqlite3 = require("sqlite3").verbose();
const sqlite = require("sqlite");

//const port = 3300;
//console.log(`Starting web socket server on port ${port}...`);
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
    }
});

let root = __dirname.slice(0, __dirname.length - 6);

const timerOffset = 0;

async function start() {
    const db = await sqlite.open({
        filename: "./server/database.db",
        driver: sqlite3.Database
    });


    await db.get(`CREATE TABLE IF NOT EXISTS games(
        id INTEGER PRIMARY KEY,
        code TEXT,
        state TEXT,
        host TEXT,
        duration INTEGER,
        diff TEXT,
        maxPlayers INTEGER,
        startTime INTEGER,
        word TEXT
    )`);

    await db.run(`CREATE TABLE IF NOT EXISTS players(
        id TEXT,
        gameId INTEGER,
        name VARCHAR(10),
        playAgain NUMERIC
    )`);

    await db.run(`CREATE TABLE IF NOT EXISTS playersWords(
        playerId TEXT,
        word VARCHAR(40)
    )`);

    await db.run("DELETE FROM games");
    await db.run("DELETE FROM players");
    await db.run("DELETE FROM playersWords");


    io.on("connection", (socket: any)=>{
        socket.on("host", async (data: any)=>{
            await hostHandler(data, socket, db);
        });

        socket.on("join", async (data: any)=>{
            await joinHandler(data, socket, db);
        });
        socket.on("startGame", async (data: any)=>{
            await startGameHandler(data, socket, db);
        });

        socket.on("addWord", async (data: any)=>{
            await addWordHandler(data, socket, db);
        });

        socket.on("playAgain", async (data: any)=>{
            await playAgainHandler(data, socket, db);
        });

        socket.on("leave", (data: any)=>{
            disconnect(socket.id, db);
        });

        socket.on("disconnect", (data: any)=>{
            disconnect(socket.id, db);
        });
    });
}

let port = process.env.PORT || 3000;
http.listen(port, () => {
    console.log(`listening on *:${port}`);
});

start();
