"use strict";
/// <reference path=".d.ts" />
// host game buttons
const durationDropDown = document.getElementById("duration");
const maxPlayersDropDown = document.getElementById("maxPlayers");
const createButton = document.getElementById("createBtn");
const hostNameTextbox = document.getElementById("hostNameTextbox");
hostNameTextbox.addEventListener("input", () => {
    let name = hostNameTextbox.value;
    if (name.length > 10 || name.length < 2) {
        hostNameTextbox.classList.add("textboxError");
    }
    else {
        hostNameTextbox.classList.remove("textboxError");
    }
});
let diffSelection = "normal";
const diffButtons = document.querySelectorAll("button.diffBtn");
diffButtons.forEach((element) => {
    element.addEventListener("click", () => {
        diffSelection = element.dataset.diff;
        diffButtons.forEach((element) => {
            element.classList.remove("diffSelected");
        });
        element.classList.add("diffSelected");
    });
});
createButton.addEventListener("click", () => {
    let duration = durationDropDown.selectedIndex + 2;
    let maxPlayers = maxPlayersDropDown.selectedIndex + 2;
    let name = hostNameTextbox.value;
    if (name.length > 10 || name.length < 2) {
        console.log("the name length is not correct");
    }
    else {
        socket = io.connect("http://localhost:3300");
        socket.on("hostGameError", (data) => {
            console.log(data);
        });
        socket.on("gameCreated", (data) => {
            hostGameWindow.hidden = true;
            waitingRoomWindow.hidden = false;
            data.players = [name];
            data.diff = diffSelection;
            data.duration = duration;
            data.maxPlayers = maxPlayers;
            startWaitingRoom(data, true);
        });
        socket.emit("host", {
            duration: duration,
            maxPlayers: maxPlayers,
            diff: diffSelection,
            name: name
        });
    }
});
// join game elements
const codeTextbox = document.getElementById("codeTextbox");
const joinButton = document.getElementById("joinBtn");
const joinMessage = document.getElementById("joinMessage");
const joinNameTextbox = document.getElementById("joinNameTextbox");
joinNameTextbox.addEventListener("input", () => {
    let name = joinNameTextbox.value;
    if (name.length > 10 || name.length < 2) {
        joinNameTextbox.classList.add("textboxError");
    }
    else {
        joinNameTextbox.classList.remove("textboxError");
    }
});
codeTextbox.addEventListener("input", () => {
    codeTextbox.value = codeTextbox.value.toUpperCase();
});
joinButton.addEventListener("click", () => {
    let name = joinNameTextbox.value;
    let code = codeTextbox.value;
    if (name.length > 10 || name.length < 2) {
        joinMessage.innerText = "The name length should be in range of 2 -10 characters";
    }
    else {
        if (socket === undefined) {
            socket = io.connect("http://localhost:3300");
        }
        socket.on("joinGameError", (data) => {
            joinMessage.innerText = data.message;
        });
        socket.on("joinedGame", (data) => {
            joinGameWindow.hidden = true;
            waitingRoomWindow.hidden = false;
            data.code = code;
            startWaitingRoom(data, false);
        });
        socket.emit("join", {
            name: name,
            code: code
        });
    }
});
const remote = require('electron').remote;
//windows
const mainMenuWindow = document.querySelector("div.mainMenu");
const howToPlayWindow = document.querySelector("div.howToPlay");
const hostGameWindow = document.querySelector("div.hostGame");
const joinGameWindow = document.querySelector("div.joinGame");
const waitingRoomWindow = document.querySelector("div.waitingRoom");
const inGameWindow = document.querySelector("div.inGame");
const scoreWindow = document.querySelector("div.score");
let socket;
// main menu buttons
const hostGameButton = document.getElementById("hostGameButton");
const joinGameButton = document.getElementById("joinGameButton");
const howToPlayButton = document.getElementById("howToPlayButton");
const exitButton = document.getElementById("exitButton");
//main menu buttons eventssssssssssssssssss
hostGameButton.addEventListener("click", (e) => {
    hostGameWindow.hidden = false;
    mainMenuWindow.hidden = true;
});
joinGameButton.addEventListener("click", (e) => {
    joinGameWindow.hidden = false;
    mainMenuWindow.hidden = true;
});
howToPlayButton.addEventListener("click", (e) => {
    howToPlayWindow.hidden = false;
    mainMenuWindow.hidden = true;
});
exitButton.addEventListener("click", (e) => {
    remote.getCurrentWindow().close();
});
//elements
const startButton = document.getElementById("startGameBtn");
const codeDiv = document.getElementById("code");
startButton.addEventListener("click", () => {
    socket.emit("startGame", {});
});
const playersUl = document.getElementById("players");
function startWaitingRoom(data, host) {
    if (host) {
        startButton.hidden = false;
        socket.on("startGameError", (data) => {
            console.log(data);
        });
    }
    codeDiv.innerText = "Code: " + data.code;
    for (let i = 0; i < data.players.length; i++) {
        const playerLi = document.createElement("li");
        playerLi.innerText = data.players[i];
        playersUl.appendChild(playerLi);
    }
    socket.on("playerJoined", (data) => {
        const playerLi = document.createElement("li");
        playerLi.innerText = data.name;
        playersUl.appendChild(playerLi);
    });
    socket.on("gameStarted", (data) => {
        console.log(data);
    });
}
