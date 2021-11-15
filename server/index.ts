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

if(process.env.NODE_ENV === 'production') {
    app.use((req: any, res: any, next: () => void) => {
      if (req.header("x-forwarded-proto") !== "https")
        res.redirect(`https://${req.header("host")}${req.url}`);
      else
        next();
    })
  }

let root = process.cwd();

const difficulties = {
    "easy": {
        "min": 500,
        "max": 1200
    }, 
    "normal": {
        "min": 300,
        "max": 550
    }, 
    "hard": {
        "min": 130,
        "max": 350
    }
}

const timerOffset = 0;

let db: any;

async function start() {
    db = await sqlite.open({
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
        points INTEGER DEFAULT 0,
        playAgain INTEGER
    )`);

    await db.run(`CREATE TABLE IF NOT EXISTS playersWords(
        playerId TEXT,
        gameId INTEGER,
        word VARCHAR(40)
    )`);

    await db.run("DELETE FROM games");
    await db.run("DELETE FROM players");
    await db.run("DELETE FROM playersWords");


    io.on("connection", (socket: any)=>{
        socket.on("host", async (data: any)=>{
            await hostHandler(data, socket);
        });

        socket.on("join", async (data: any)=>{
            await joinHandler(data, socket);
        });
        socket.on("startGame", async (data: any)=>{
            await startGameHandler(data, socket);
        });

        socket.on("addWord", async (data: any)=>{
            await addWordHandler(data, socket);
        });

        socket.on("playAgain", async (data: any)=>{
            await playAgainHandler(data, socket);
        });

        socket.on("leave", (data: any)=>{
            disconnect(socket);
        });

        socket.on("disconnect", (data: any)=>{
            disconnect(socket);
        });
    });
}

let port = process.env.PORT || 3000;
http.listen(port, () => {
    console.log(`listening on *:${port}`);
});

start();
