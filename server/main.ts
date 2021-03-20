console.log("importing packages...");
const sqlite3 = require("sqlite3").verbose();
const sqlite = require("sqlite");

const port = 3300;
console.log(`Starting web socket server on port ${port}...`);
const io = require("socket.io")(port);

async function start() {
    const db = await sqlite.open({
        filename: "./database.db",
        driver: sqlite3.Database
    })

    db.get(`CREATE TABLE IF NOT EXISTS games(
        id INTEGER PRIMARY KEY,
        code VARCHAR(5),
        state VARCHAR(7),
        host INTEGER,
        duration INTEGER,
        diff VARCHAR(6),
        maxPlayers INTEGER,
        startTime INTEGER,
        word VARCHAR(30)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS players(
        id INTEGER,
        gameId INTEGER,
        name VARCHAR(10),
        numOfWords INTEGER
    )`);


    io.on("connection", (socket: any)=>{
        console.log("new User yay!!");
        socket.on("host", async (data: any)=>{
            await hostHandler(data, socket, db)
        });

        socket.on("join", async (data: any)=>{
            await joinHandler(data, socket, db)
        });
        socket.on("startGame", async (data: any)=>{
            await startGameHandler(data, socket, db)
        });
    });
}

start();
