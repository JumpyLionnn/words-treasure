"use strict";
const mainMenuWindow = document.querySelector("div.mainMenu");
const howToPlayWindow = document.querySelector("div.howToPlay");
const hostGameWindow = document.querySelector("div.hostGame");
const joinGameWindow = document.querySelector("div.joinGame");
const waitingRoomWindow = document.querySelector("div.waitingRoom");
const inGameWindow = document.querySelector("div.inGame");
const scoreWindow = document.querySelector("div.score");
let socket = io.connect("/");
let playerName;
const mainMenuButtons = document.querySelectorAll("#mainMenuButton");
mainMenuButtons.forEach((element) => {
    element.addEventListener("click", (e) => {
        hideAll();
        mainMenuWindow.hidden = false;
    });
});
const disconnectButtons = document.querySelectorAll("#disconnectButton");
disconnectButtons.forEach((element) => {
    element.addEventListener("click", (e) => {
        socket.emit("leave", {});
        hideAll();
        mainMenuWindow.hidden = false;
    });
});
function hideAll() {
    howToPlayWindow.hidden = true;
    hostGameWindow.hidden = true;
    joinGameWindow.hidden = true;
    waitingRoomWindow.hidden = true;
    inGameWindow.hidden = true;
    scoreWindow.hidden = true;
}
const durationDropDown = document.getElementById("duration");
const maxPlayersDropDown = document.getElementById("maxPlayers");
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
const hostNameTextbox = document.getElementById("hostNameTextbox");
hostNameTextbox.addEventListener("input", () => {
    let name = hostNameTextbox.value;
    hostNameTextbox.value = name;
    hostMessage.innerText = "";
    if (name.length > 10 || name.length < 2) {
        hostNameTextbox.classList.add("textboxError");
    }
    else {
        hostNameTextbox.classList.remove("textboxError");
    }
});
const hostMessage = document.getElementById("hostMessage");
const createButton = document.getElementById("createBtn");
let diffSelection = "normal";
let hostGameEnterKeyUpdated = false;
createButton.addEventListener("click", createGame);
socket.on("hostGameError", (data) => {
    hostMessage.innerText = data.message;
});
socket.on("gameCreated", (data) => {
    window.removeEventListener("keydown", hostGameKeyDown);
    window.removeEventListener("keyup", hostGameKeyUp);
    hostGameWindow.hidden = true;
    waitingRoomWindow.hidden = false;
    data.players = [playerName];
    data.diff = data.diff;
    data.duration = data.duration;
    data.maxPlayers = data.maxPlayers;
    startWaitingRoom(data, true);
});
function startHostGameWindow() {
    hostNameTextbox.value = "";
    hostMessage.innerText = "";
    window.addEventListener("keydown", hostGameKeyDown);
    window.addEventListener("keyup", hostGameKeyUp);
}
function createGame() {
    let duration = durationDropDown.selectedIndex + 2;
    let maxPlayers = maxPlayersDropDown.selectedIndex + 2;
    playerName = hostNameTextbox.value.trim();
    if (playerName.length > 10 || playerName.length < 2) {
        hostMessage.innerText = "The name length should be in range of 2 - 10 letters.";
    }
    else {
        socket.emit("host", {
            duration: duration,
            maxPlayers: maxPlayers,
            diff: diffSelection,
            name: playerName
        });
    }
}
function hostGameKeyDown(e) {
    if (e.key === "Enter" && hostGameEnterKeyUpdated === false) {
        createGame();
        hostGameEnterKeyUpdated = true;
    }
}
function hostGameKeyUp(e) {
    if (e.key === "Enter") {
        hostGameEnterKeyUpdated = false;
    }
}
const timeRemainingDiv = document.getElementById("timeRemaining");
const wordDisplayDiv = document.getElementById("wordDisplay");
const wordInput = document.getElementById("wordInput");
wordInput.addEventListener("input", () => {
    inGameMessage.innerText = "";
    wordInput.value = wordInput.value.replace(/[\W_]+/g, "");
});
const inGameMessage = document.getElementById("inGameMessage");
const submitWordBtn = document.getElementById("submitWord");
submitWordBtn.addEventListener("click", submitWord);
const currentWordsTable = document.getElementById("currentWords");
let timeRemaining;
let inGameEnterKeyUpdated = false;
socket.on("addWordError", (data) => {
    inGameMessage.innerText = data.message;
});
socket.on("wordResult", (data) => {
    if (data.correct) {
        const div = document.createElement("div");
        div.innerText = data.word;
        currentWordsTable.appendChild(div);
    }
    else {
        inGameMessage.innerText = data.message;
    }
});
socket.on("ended", (data) => {
    window.removeEventListener("keydown", inGameKeyDown);
    window.removeEventListener("keyup", inGameKeyUp);
    inGameWindow.hidden = true;
    scoreWindow.hidden = false;
    startScoreWindow(data);
});
function startInGameWindow(data) {
    inGameMessage.innerText = "";
    wordInput.value = "";
    currentWordsTable.innerHTML = "";
    wordDisplayDiv.innerText = data.word;
    inGameWindow.addEventListener("keydown", inGameKeyDown);
    inGameWindow.addEventListener("keyup", inGameKeyUp);
    timeRemainingDiv.innerText = data.duration + ":00";
    timeRemaining = data.duration * 60;
    let timer = setInterval(() => {
        timeRemaining--;
        let seconds = timeRemaining % 60;
        if (timeRemaining === 0) {
            clearInterval(timer);
            window.removeEventListener("keydown", submitWord);
        }
        if (seconds < 10) {
            timeRemainingDiv.innerText = Math.floor(timeRemaining / 60) + ":0" + seconds;
        }
        else {
            timeRemainingDiv.innerText = Math.floor(timeRemaining / 60) + ":" + seconds;
        }
    }, 1000);
}
function submitWord() {
    wordInput.focus();
    socket.emit("addWord", { word: wordInput.value });
    wordInput.value = "";
}
function inGameKeyDown(e) {
    if (e.key === "Enter" && inGameEnterKeyUpdated === false) {
        inGameEnterKeyUpdated = true;
        submitWord();
    }
}
function inGameKeyUp(e) {
    if (e.key === "Enter") {
        inGameEnterKeyUpdated = false;
    }
}
const codeTextbox = document.getElementById("codeTextbox");
const joinButton = document.getElementById("joinBtn");
const joinMessage = document.getElementById("joinMessage");
const joinNameTextbox = document.getElementById("joinNameTextbox");
let joinGameEnterKeyUpdated = false;
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
    codeTextbox.value = codeTextbox.value.toUpperCase().replace(/[\W_]+/g, "");
    ;
});
let code = "";
socket.on("joinGameError", (data) => {
    joinMessage.innerText = data.message;
});
socket.on("joinedGame", (data) => {
    window.removeEventListener("keydown", joinGameKeyDown);
    window.removeEventListener("keyup", joinGameKeyUp);
    joinGameWindow.hidden = true;
    waitingRoomWindow.hidden = false;
    data.code = code;
    startWaitingRoom(data, false);
});
function startJoinGameWindow() {
    codeTextbox.value = "";
    joinNameTextbox.value = "";
    joinMessage.innerText = "";
    window.addEventListener("keydown", joinGameKeyDown);
    window.addEventListener("keyup", joinGameKeyUp);
}
joinButton.addEventListener("click", joinGame);
function joinGame() {
    playerName = joinNameTextbox.value;
    code = codeTextbox.value;
    if (playerName.length > 10 || playerName.length < 2) {
        joinMessage.innerText = "The name length should be in range of 2 -10 characters";
    }
    else {
        socket.emit("join", {
            name: playerName,
            code: code
        });
    }
}
function joinGameKeyDown(e) {
    if (e.key === "Enter" && joinGameEnterKeyUpdated === false) {
        joinGame();
        joinGameEnterKeyUpdated = true;
    }
}
function joinGameKeyUp(e) {
    if (e.key === "Enter") {
        joinGameEnterKeyUpdated = false;
    }
}
const hostGameButton = document.getElementById("hostGameButton");
const joinGameButton = document.getElementById("joinGameButton");
const howToPlayButton = document.getElementById("howToPlayButton");
const exitButton = document.getElementById("exitButton");
hostGameButton.addEventListener("click", (e) => {
    startHostGameWindow();
    hostGameWindow.hidden = false;
    mainMenuWindow.hidden = true;
});
joinGameButton.addEventListener("click", (e) => {
    startJoinGameWindow();
    joinGameWindow.hidden = false;
    mainMenuWindow.hidden = true;
});
howToPlayButton.addEventListener("click", (e) => {
    howToPlayWindow.hidden = false;
    mainMenuWindow.hidden = true;
});
exitButton.addEventListener("click", (e) => {
    window.close();
});
const scoreTable = document.querySelector(".scoreTable tbody");
function startScoreWindow(data) {
    scoreTable.innerHTML = "";
    let scores = data.scores;
    for (let i = 0; i < scores.length; i++) {
        const tr = document.createElement("tr");
        const placeTd = document.createElement("td");
        placeTd.innerText = (i + 1).toString();
        tr.appendChild(placeTd);
        const nameTd = document.createElement("td");
        nameTd.innerText = scores[i].name;
        tr.appendChild(nameTd);
        const scoreTd = document.createElement("td");
        scoreTd.innerText = scores[i].score;
        tr.appendChild(scoreTd);
        scoreTable.appendChild(tr);
    }
}
const playersNumberParagraph = document.getElementById("playersNumber");
const playersUl = document.getElementById("players");
const codeDiv = document.getElementById("code");
const durationDiv = document.getElementById("durationDiv");
const diffDiv = document.getElementById("diffDiv");
const waitingMessage = document.getElementById("waitingMessage");
const startButton = document.getElementById("startGameBtn");
startButton.addEventListener("click", () => {
    socket.emit("startGame", {});
});
let maxPlayers;
let playersNumber = 0;
socket.on("playerJoined", (data) => {
    const playerLi = document.createElement("li");
    playerLi.innerText = data.name;
    playersNumber++;
    playersNumberParagraph.innerText = playersNumber + "/" + maxPlayers;
    playersUl.appendChild(playerLi);
});
socket.on("playerLeft", (data) => {
    playersNumber--;
    playersNumberParagraph.innerText = playersNumber + "/" + maxPlayers;
    let listElelemnts = playersUl.children;
    for (let i = 0; i < listElelemnts.length; i++) {
        let li = listElelemnts[i];
        if (li.innerText === data.name) {
            playersUl.removeChild(listElelemnts[i]);
        }
    }
    if (data.host === playerName) {
        startButton.hidden = false;
    }
});
socket.on("gameStarted", (data) => {
    waitingRoomWindow.hidden = true;
    inGameWindow.hidden = false;
    startInGameWindow(data);
});
socket.on("startGameError", (data) => {
    waitingMessage.innerText = data.message;
});
function startWaitingRoom(data, host) {
    waitingMessage.innerText = "";
    playersUl.innerHTML = "";
    if (host) {
        startButton.hidden = false;
        waitingMessage.hidden = false;
    }
    else {
        startButton.hidden = true;
    }
    maxPlayers = data.maxPlayers;
    playersNumber = data.players.length;
    playersNumberParagraph.innerText = playersNumber + "/" + maxPlayers;
    durationDiv.innerText = data.duration + ":00";
    diffDiv.innerText = data.diff;
    codeDiv.innerText = data.code;
    for (let i = 0; i < data.players.length; i++) {
        const playerLi = document.createElement("li");
        playerLi.innerText = data.players[i];
        playersUl.appendChild(playerLi);
    }
}
