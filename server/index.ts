console.log("importing packages...");
const sqlite3 = require("sqlite3").verbose();
const sqlite = require("sqlite");
const path = require("path");
const fs = require("fs");
const express = require("express");

const app = express();
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
    });
}

let db: any;

let cwd = process.cwd();
let port = process.env.PORT || 3000;

const timerOffset = 2;


// loading game data
console.log("loading game data...");
const gameScoring = JSON.parse(fs.readFileSync("server/data/gameScoring.json"));
const difficulties = JSON.parse(fs.readFileSync("server/data/gameDifficulties.json"));



async function start() {
    // setting all of the socket events
    await startDatabase();
    io.on("connection", (socket: any)=>{
        socket.on("host", async (data: any)=>{
            await hostHandler(data, socket);
        });

        socket.on("join", async (data: any)=>{
            await joinHandler(data, socket);
        });
        socket.on("start-game", async (data: any)=>{
            await startGameHandler(data, socket);
        });

        socket.on("add-word", async (data: any)=>{
            await addWordHandler(data, socket);
        });

        socket.on("play-again", async (data: any)=>{
            await playAgainHandler(data, socket);
        });

        socket.on("leave", (data: any)=>{
            disconnect(socket);
        });

        socket.on("disconnect", (data: any)=>{
            disconnect(socket);
        });
    });

    //setting http routes
    app.use("/src", express.static(path.join(cwd ,"client/build/src")));
    app.use("/style", express.static(path.join(cwd ,"client/build/style")));
    app.use("/assets", express.static(path.join(cwd ,"client/assets")));


    app.get('/', (req: any, res: any) => {
        res.sendFile(cwd + '/client/index.html');
    });



    app.get('/google25a371c5daa2ad1c.html', (req: any, res: any) => {
        res.sendFile(cwd + '/client/google25a371c5daa2ad1c.html');
    });


    // starting the server
    http.listen(port, () => {
        console.log(`listening on *:${port}`);
    });
}

start();
