"use strict";
console.log("importing packages...");
const sqlite3 = require("sqlite3").verbose();
const port = 3300;
console.log(`Starting web socket server on port ${port}...`);
const io = require("socket.io")(port);
io.on("connection", (socket) => {
    socket.on("host", (data) => {
        if (typeof data.name === "string") {
            let name = data.name;
        }
        else {
        }
    });
});
