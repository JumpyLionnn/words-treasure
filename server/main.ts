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

app.get('/', (req: any, res: any) => {
    console.log("hallo new client");
    let root = __dirname.slice(0, __dirname.length - 6);
    res.sendFile(root + '/client/index.html');
});

app.get('/style.css', (req: any, res: any) => {
    res.sendFile(root + '/client/style.css');
});

app.get('/general.css', (req: any, res: any) => {
    res.sendFile(root + '/client/general.css');
});

app.get('/main.js', (req: any, res: any) => {
    res.sendFile(root + '/client/main.js');
});



const timerOffset = 0;

async function start() {
    const db = await sqlite.open({
        filename: "./database.db",
        driver: sqlite3.Database
    });

    await db.get(`CREATE TABLE IF NOT EXISTS games(
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

    await db.run(`CREATE TABLE IF NOT EXISTS players(
        id INTEGER,
        gameId INTEGER,
        name VARCHAR(10)
    )`);

    await db.run(`CREATE TABLE IF NOT EXISTS playersWords(
        playerId INTEGER,
        word VARCHAR(40)
    )`);

    await db.run("DELETE FROM games");
    await db.run("DELETE FROM players");
    await db.run("DELETE FROM playersWords");


    io.on("connection", (socket: any)=>{
        console.log("new User yay!!");
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

        socket.on("leave", (data: any)=>{
            disconnect(socket.id, db);
        });

        socket.on("disconnect", (data: any)=>{
            console.log("user left")
            disconnect(socket.id, db);
        });
    });
}

let port = process.env.PORT || 3000;
http.listen(port, () => {
    
    console.log(`listening on *:${port}`);
});

start();
