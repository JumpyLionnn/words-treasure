"use strict";
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
const timeRemainingDiv = document.getElementById("timeRemaining");
const wordDisplayDiv = document.getElementById("wordDisplay");
const wordInput = document.getElementById("wordInput");
wordInput.addEventListener("input", () => {
    wordInput.value = wordInput.value.replace(/[\W_]+/g, "");
});
const submitWordBtn = document.getElementById("submitWord");
submitWordBtn.addEventListener("click", submitWord);
const currentWordsTable = document.getElementById("currentWords");
let timeRemaining;
function startInGameWindow(data) {
    wordDisplayDiv.innerText = data.word;
    let enterKeyUpdated = false;
    window.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && enterKeyUpdated === false) {
            enterKeyUpdated = true;
            submitWord();
        }
    });
    window.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
            enterKeyUpdated = false;
        }
    });
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
    socket.on("addWordError", (data) => {
        console.log(data);
    });
    socket.on("wordResult", (data) => {
        if (data.correct) {
            wordInput.value = "";
            const wordTh = document.createElement("td");
            wordTh.innerText = data.word;
            if (currentWordsTable.lastChild) {
                if (currentWordsTable.lastChild.childNodes.length === 5) {
                    const tr = document.createElement("tr");
                    tr.appendChild(wordTh);
                    currentWordsTable.appendChild(tr);
                }
                else {
                    currentWordsTable.lastChild.appendChild(wordTh);
                }
            }
            else {
                const tr = document.createElement("tr");
                tr.appendChild(wordTh);
                currentWordsTable.appendChild(tr);
            }
        }
    });
    socket.on("ended", (data) => {
        inGameWindow.hidden = true;
        scoreWindow.hidden = false;
        startScoreWindow(data);
    });
}
function submitWord() {
    wordInput.focus();
    socket.emit("addWord", { word: wordInput.value });
}
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
        socket.on("joinGameError", (data) => {
            joinMessage.innerText = data.message;
        });
        socket.once("joinedGame", (data) => {
            console.log(data);
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
const mainMenuWindow = document.querySelector("div.mainMenu");
const howToPlayWindow = document.querySelector("div.howToPlay");
const hostGameWindow = document.querySelector("div.hostGame");
const joinGameWindow = document.querySelector("div.joinGame");
const waitingRoomWindow = document.querySelector("div.waitingRoom");
const inGameWindow = document.querySelector("div.inGame");
const scoreWindow = document.querySelector("div.score");
let socket = io.connect("http://192.168.100.20:3300/");
const hostGameButton = document.getElementById("hostGameButton");
const joinGameButton = document.getElementById("joinGameButton");
const howToPlayButton = document.getElementById("howToPlayButton");
const exitButton = document.getElementById("exitButton");
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
const scoreTable = document.getElementById("scoreTable");
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
        waitingRoomWindow.hidden = true;
        inGameWindow.hidden = false;
        startInGameWindow(data);
    });
}
