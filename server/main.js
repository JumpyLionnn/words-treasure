"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
console.log("importing packages...");
const sqlite3 = require("sqlite3").verbose();
const sqlite = require("sqlite");
const port = 3300;
console.log(`Starting web socket server on port ${port}...`);
const io = require("socket.io")(port);
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield sqlite.open({
            filename: "./database.db",
            driver: sqlite3.Database
        });
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
        io.on("connection", (socket) => {
            console.log("new User yay!!");
            socket.on("host", (data) => __awaiter(this, void 0, void 0, function* () {
                yield hostHandler(data, socket, db);
            }));
            socket.on("join", (data) => __awaiter(this, void 0, void 0, function* () {
                yield joinHandler(data, socket, db);
            }));
            socket.on("startGame", (data) => __awaiter(this, void 0, void 0, function* () {
                yield startGameHandler(data, socket, db);
            }));
        });
    });
}
start();
function makeCode(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
function hostHandler(data, socket, db) {
    return __awaiter(this, void 0, void 0, function* () {
        let player = yield db.get("SELECT * FROM players WHERE id = ?", [socket.id]);
        if (player) {
            socket.emit("hostGameError", { message: "this client is already in a game" });
            return;
        }
        // getting data
        let name;
        if (typeof data.name === "string") {
            name = data.name;
            if (name.length > 10 || name.length < 2) {
                socket.emit("hostGameError", { message: "The name length is not in the range of 2 - 10" });
                return;
            }
        }
        else {
            socket.emit("hostGameError", { message: "The name is not a string" });
            return;
        }
        let diff;
        if (typeof data.diff === "string") {
            diff = data.diff;
            if (!(diff === "hard" || diff === "normal" || diff === "easy")) {
                socket.emit("hostGameError", { message: "The difficulty is not hard normal or easy" });
                return;
            }
        }
        else {
            socket.emit("hostGameError", { message: "The difficulty is not a string" });
            return;
        }
        let maxPlayers;
        if (typeof data.maxPlayers === "number") {
            maxPlayers = data.maxPlayers;
            if (maxPlayers > 10 || maxPlayers < 2) {
                socket.emit("hostGameError", { message: "The maxPlayer is not in range of 2 - 10" });
                return;
            }
        }
        else {
            socket.emit("hostGameError", { message: "The maxPlayer is not a number" });
            return;
        }
        let duration;
        if (typeof data.duration === "number") {
            duration = data.duration;
            if (duration > 10 || duration < 2) {
                socket.emit("hostGameError", { message: "The duration is not in range of 2 - 10" });
                return;
            }
        }
        else {
            socket.emit("hostGameError", { message: "The duration is not a number" });
            return;
        }
        let code = makeCode(5);
        let result = yield db.get("SELECT * FROM games WHERE code = ?", [code]);
        while (result) {
            let code = makeCode(5);
            let result = yield db.get("SELECT * FROM games WHERE code = ?", [code]);
        }
        yield db.run(`INSERT INTO games(code, state, host, duration, diff, maxPlayers, word) VALUES
        (?, 'waiting', ?, ?, ?, ?, "hello");`, [code, socket.id, duration, diff, maxPlayers]);
        let game = yield db.get(`SELECT * FROM games WHERE code = ?`, [code]);
        socket.join(game.id);
        db.run(`INSERT INTO players(id, gameId, name, numOfWords) VALUES (?, ?, ?, 0)`, [socket.id, game.id, name]);
        socket.emit("gameCreated", { code: code });
    });
}
function joinHandler(data, socket, db) {
    return __awaiter(this, void 0, void 0, function* () {
        let player = yield db.get("SELECT * FROM players WHERE id = ?", [socket.id]);
        if (player) {
            socket.emit("joinGameError", { message: "this client is already in a game" });
            return;
        }
        // getting data
        let name;
        if (typeof data.name === "string") {
            name = data.name;
            if (name.length > 10 || name.length < 2) {
                socket.emit("joinGameError", { message: "The name length is not in the range of 2 - 10" });
                return;
            }
        }
        else {
            socket.emit("joinGameError", { message: "The name is not a string" });
            return;
        }
        let game;
        if (typeof data.code === "string") {
            let code = data.code;
            game = yield db.get("SELECT * FROM games WHERE code = ?", [code]);
            if (!game) {
                socket.emit("joinGameError", { message: "The game you tried to join does not exist" });
                return;
            }
        }
        if (game.state !== "waiting") {
            socket.emit("joinGameError", { message: "The game you tried to join already started" });
            return;
        }
        let players = yield db.all("SELECT * FROM players WHERE gameId = ?", [game.id]);
        if (players.length === game.maxPlayers) {
            socket.emit("joinGameError", { message: "The game you tried to join is full" });
            return;
        }
        let playerNames = [name];
        for (let i = 0; i < players.length; i++) {
            if (players[i].name === name) {
                socket.emit("joinGameError", { message: "The game you tried to join already has aplayer with the same name" });
                return;
            }
            playerNames.push(players[i].name);
        }
        db.run("INSERT INTO players(id, gameId, name, numOfWords) VALUES (? ,? ,? ,0)", [socket.id, game.id, name]);
        let host = yield db.get("SELECT name FROM players WHERE id = ?", [game.host]);
        io.to(game.id).emit("playerJoined", { name: name });
        socket.join(game.id);
        socket.emit("joinedGame", {
            players: playerNames,
            diff: game.diff,
            duration: game.duration,
            maxPlayers: game.maxPlayers,
            code: game.code,
            host: host.name
        });
    });
}
function startGameHandler(data, socket, db) {
    return __awaiter(this, void 0, void 0, function* () {
        let game = yield db.get("SELECT word, duration, id FROM games WHERE host = ?", [socket.id]);
        if (!game) {
            socket.emit("startGameError", { message: "You are not host in a game" });
            return;
        }
        let players = yield db.all("SELECT * FROM Players WHERE gameId = ?", [game.id]);
        if (players.length === 1) {
            socket.emit("startGameError", { message: "You can not start the game with only 1 player" });
            return;
        }
        db.run("UPDATE games SET state = 'started' WHERE host = ?", [socket.id]);
        db.run("UPDATE games SET startTime = ? WHERE host = ?", [Math.floor(Date.now() / 1000), socket.id]);
        io.to(game.id).emit("gameStarted", {
            word: game.word,
            duration: game.duration
        });
    });
}
