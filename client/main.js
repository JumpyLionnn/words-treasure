"use strict";
const alertScreen = document.getElementById("alert");
alertScreen.addEventListener("click", (e) => {
    if (e.target === alertScreen) {
        alertScreen.style.display = "none";
        if (alertCallback) {
            alertCallback("no");
        }
    }
});
const alertText = document.getElementById("alertText");
const alertCloseNutton = document.getElementById("alertCloseButton");
alertCloseNutton.addEventListener("click", () => {
    alertScreen.style.display = "none";
    if (alertCallback) {
        alertCallback("no");
    }
});
const alertOkButton = document.getElementById("alertOkButton");
alertOkButton.addEventListener("click", () => {
    alertScreen.style.display = "none";
});
const yesnoAlert = document.getElementById("yesnoAlert");
const alertNoButton = document.getElementById("alertNoButton");
alertNoButton.addEventListener("click", () => {
    alertScreen.style.display = "none";
    if (alertCallback) {
        alertCallback("no");
    }
});
const alertYesButton = document.getElementById("alertYesButton");
alertYesButton.addEventListener("click", () => {
    alertScreen.style.display = "none";
    if (alertCallback) {
        alertCallback("yes");
    }
});
let alertCallback;
function displayAlert(alertMessage, alertType = "normal", callback) {
    if (alertType === "normal") {
        alertOkButton.hidden = false;
        yesnoAlert.hidden = true;
    }
    else if (alertType === "yesno") {
        alertOkButton.hidden = true;
        yesnoAlert.hidden = false;
    }
    if (callback) {
        alertCallback = callback;
    }
    alertText.innerText = alertMessage;
    alertScreen.style.display = "flex";
}
class Random {
    constructor() {
    }
    static randint(max, min = 0) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    static randfloat(max, min = 0) {
        return Math.random() * (max - min) + min;
    }
    static random() {
        return Math.random();
    }
    static choice(array) {
        return array[this.randint(0, array.length)];
    }
    static shuffle(array) {
        array = [...array];
        for (let i = array.length - 1; i > 0; i--) {
            const j = this.randint(0, i + 1);
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}
const backgroundDiv = document.getElementById("background");
function generateBackground() {
    backgroundDiv.innerHTML = "";
    const screenWidth = backgroundDiv.clientWidth;
    const screenHeight = backgroundDiv.clientHeight;
    for (let i = 0; i < backgroundData.lettersNumber; i++) {
        const letterDiv = document.createElement("div");
        letterDiv.innerText = backgroundData.letters.charAt(Random.randint(backgroundData.letters.length));
        letterDiv.style.transform = `rotateZ(${Random.randint(0, 360)}deg)`;
        let posX = Random.randint(screenWidth);
        let posY = Random.randint(screenHeight);
        letterDiv.style.top = `${posY}px`;
        letterDiv.style.left = `${posX}px`;
        letterDiv.style.fontSize = `${Random.randfloat(backgroundData.letterSizes.max, backgroundData.letterSizes.min)}em`;
        letterDiv.style.color = Random.choice(backgroundData.letterColors);
        letterDiv.classList.add("letter");
        backgroundDiv.appendChild(letterDiv);
    }
}
window.addEventListener("resize", generateBackground);
const backgroundData = {
    backgroundColors: [
        "#50cdfa",
    ],
    letterColors: [
        "#DBFCFF",
        "#A6CFD5",
        "#7F96FF",
        "#E56399",
        "#BF98A0",
        "#84DCCF",
        "#DDFC74",
        "#D3F9B5",
        "#BF6900",
        "#9BDEAC",
        "#59A96A",
        "#B4E7CE",
        "#23CE6B",
        "#D81E5B",
        "#CC5803",
        "#E2711D",
        "#FFC971",
        "#FFB627",
        "#FF9505"
    ],
    letterSizes: {
        min: 2,
        max: 4
    },
    lettersNumber: 200,
    letters: "abcdefghijklmnopqrstuvwzyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
};
const mainMenuWindow = document.querySelector("div.mainMenu");
const howToPlayWindow = document.querySelector("div.howToPlay");
const hostGameWindow = document.querySelector("div.hostGame");
const joinGameWindow = document.querySelector("div.joinGame");
const waitingRoomWindow = document.querySelector("div.waitingRoom");
const inGameWindow = document.querySelector("div.inGame");
const scoreWindow = document.querySelector("div.score");
generateBackground();
let socket = io.connect("/");
let playerName;
console.log("%cHold up!%c\n\nDo not enter or paste anything here. If someone told you to paste or enter something here, they are most likely trying to hack and/or scam you.", "background-color: #e03c28; color: #ffffff; font-size: 2.5em; padding: .25em .5em;", "font-size: 1.25em;");
socket.on("disconnect", () => {
    if (mainMenuWindow.hidden) {
        displayAlert("You disconnected.");
        hideAll();
        mainMenuWindow.hidden = false;
    }
});
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
        displayAlert("Are you sure you want to leave?", "yesno", (result) => {
            if (result === "yes") {
                socket.emit("leave", {});
                hideAll();
                mainMenuWindow.hidden = false;
            }
        });
    });
});
function hideAll() {
    howToPlayWindow.hidden = true;
    hostGameWindow.hidden = true;
    joinGameWindow.hidden = true;
    waitingRoomWindow.hidden = true;
    inGameWindow.hidden = true;
    scoreWindow.hidden = true;
    waitingForHostToPlayAgainAlert.style.display = "none";
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
    hostNameTextbox.value = hostNameTextbox.value.replace(/[^a-zA-Z0-9 ]/g, "");
});
const createButton = document.getElementById("createBtn");
let diffSelection = "normal";
let hostGameEnterKeyUpdated = false;
createButton.addEventListener("click", createGame);
socket.on("hostGameError", (data) => {
    displayAlert(data.message);
});
socket.on("gameCreated", (data) => {
    window.removeEventListener("keydown", hostGameKeyDown);
    window.removeEventListener("keyup", hostGameKeyUp);
    hideAll();
    waitingRoomWindow.hidden = false;
    data.players = [playerName];
    startWaitingRoom(data, true);
});
function startHostGameWindow() {
    hostNameTextbox.value = window.localStorage.getItem("word-game-name") || "";
    const settings = JSON.parse(window.localStorage.getItem("word-game-settings") || "{}");
    if (settings.duration) {
        durationDropDown.value = settings.duration;
    }
    if (settings.diff) {
        diffSelection = settings.diff;
        diffButtons.forEach((element) => {
            if (element.dataset.diff === settings.diff) {
                element.classList.add("diffSelected");
            }
            else {
                element.classList.remove("diffSelected");
            }
        });
    }
    window.addEventListener("keydown", hostGameKeyDown);
    window.addEventListener("keyup", hostGameKeyUp);
}
function createGame() {
    let duration = durationDropDown.selectedIndex + 2;
    let maxPlayers = maxPlayersDropDown.selectedIndex + 2;
    playerName = hostNameTextbox.value.trim();
    if (playerName.length > 10 || playerName.length < 2) {
        displayAlert("The name length should be in range of 2 - 10 letters.");
    }
    else {
        window.localStorage.setItem("word-game-settings", JSON.stringify({
            duration: duration.toString(),
            diff: diffSelection,
        }));
        window.localStorage.setItem("word-game-name", playerName);
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
    inGameMessage.innerText = "\n";
    wordInput.value = wordInput.value.toLowerCase().replace(/[^a-z]+/g, "");
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
        if (currentWordsTable.children.length === 0 || currentWordsTable.children[currentWordsTable.children.length - 1].children.length === 10) {
            const column = document.createElement("div");
            column.classList.add("column");
            column.appendChild(div);
            currentWordsTable.appendChild(column);
        }
        else {
            currentWordsTable.children[currentWordsTable.children.length - 1].appendChild(div);
        }
    }
    else {
        wordInput.classList.add("worng");
        setTimeout(() => {
            wordInput.classList.remove("worng");
        }, 400);
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
    inGameMessage.innerText = "\n";
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
const joinNameTextbox = document.getElementById("joinNameTextbox");
let joinGameEnterKeyUpdated = false;
joinNameTextbox.addEventListener("input", () => {
    joinNameTextbox.value = joinNameTextbox.value.replace(/[^a-zA-Z0-9 ]/g, "");
});
codeTextbox.addEventListener("input", () => {
    codeTextbox.value = codeTextbox.value.toUpperCase().replace(/[^A-Z]+/g, "");
});
let code = "";
socket.on("joinGameError", (data) => {
    displayAlert(data.message);
});
socket.on("joinedGame", (data) => {
    window.removeEventListener("keydown", joinGameKeyDown);
    window.removeEventListener("keyup", joinGameKeyUp);
    hideAll();
    waitingRoomWindow.hidden = false;
    data.code = code;
    startWaitingRoom(data, false);
});
function startJoinGameWindow() {
    codeTextbox.value = "";
    joinNameTextbox.value = window.localStorage.getItem("word-game-name") || "";
    window.addEventListener("keydown", joinGameKeyDown);
    window.addEventListener("keyup", joinGameKeyUp);
}
joinButton.addEventListener("click", joinGame);
function joinGame() {
    playerName = joinNameTextbox.value;
    code = codeTextbox.value;
    if (playerName.length < 2) {
        displayAlert("The name length should be in range of 2 - 10 characters.");
    }
    else if (code.length !== 5) {
        displayAlert("The game you tried to join does not exist.");
    }
    else {
        window.localStorage.setItem("word-game-name", playerName);
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
hostGameButton.addEventListener("click", (e) => {
    if (socket.disconnected) {
        displayAlert("You cannot host a game since you are not connected to the server.");
    }
    else {
        startHostGameWindow();
        hostGameWindow.hidden = false;
        mainMenuWindow.hidden = true;
    }
});
joinGameButton.addEventListener("click", (e) => {
    if (socket.disconnected) {
        displayAlert("You cannot join a game since you are not connected to the server.");
    }
    else {
        startJoinGameWindow();
        joinGameWindow.hidden = false;
        mainMenuWindow.hidden = true;
    }
});
const scoreTable = document.querySelector(".scoreTable tbody");
const waitingForHostToPlayAgainAlert = document.getElementById("waitingForHost");
const waitingForHostToPlayAgainText = document.getElementById("waitingForHostText");
const waitingForHostToPlayAgainCancelButton = document.getElementById("waitingForHostCancelButton");
const waitingForHostToPlayAgainCloseButton = document.getElementById("waitingForHostCloseButton");
let waitingForHostToPlayAgainTextInterval;
function startScoreWindow(data) {
    scoreTable.innerHTML = "";
    let scores = data.scores;
    for (let i = 0; i < scores.length; i++) {
        const tr = document.createElement("tr");
        const placeTd = document.createElement("td");
        placeTd.innerText = (i + 1).toString();
        tr.appendChild(placeTd);
        const nameTd = document.createElement("td");
        if (scores[i].name === playerName) {
            nameTd.innerText = scores[i].name + "(you)";
        }
        else {
            nameTd.innerText = scores[i].name;
        }
        tr.appendChild(nameTd);
        const scoreTd = document.createElement("td");
        scoreTd.innerText = scores[i].score;
        tr.appendChild(scoreTd);
        scoreTable.appendChild(tr);
    }
}
document.getElementById("playAgainButton").addEventListener("click", () => {
    socket.emit("playAgain", {});
});
socket.on("waitingForHost", (data) => {
    waitingForHostToPlayAgainAlert.style.display = "flex";
    let dotCount = 0;
    waitingForHostToPlayAgainTextInterval = setInterval(() => {
        dotCount++;
        if (dotCount === 4) {
            dotCount = 0;
        }
        waitingForHostToPlayAgainText.innerText = "Waiting for the host" + ".".repeat(dotCount);
    }, 1000);
});
waitingForHostToPlayAgainCancelButton.addEventListener("click", () => {
    clearInterval(waitingForHostToPlayAgainTextInterval);
    waitingForHostToPlayAgainAlert.style.display = "none";
    socket.emit("leave", {});
});
waitingForHostToPlayAgainCloseButton.addEventListener("click", () => {
    clearInterval(waitingForHostToPlayAgainTextInterval);
    waitingForHostToPlayAgainAlert.style.display = "none";
    socket.emit("leave", {});
});
socket.on("playAgainError", (data) => {
    displayAlert(data.message);
});
const playersNumberParagraph = document.getElementById("playersNumber");
const playersList = document.getElementById("players");
const gameCodeInputContainer = document.getElementById("gameCodeInputContainer");
const gameCodeInput = document.getElementById("gameCodeInput");
const gameCodeCopyButton = document.getElementById("gameCodeCopyButton");
const durationDiv = document.getElementById("durationDiv");
const diffDiv = document.getElementById("diffDiv");
const startButton = document.getElementById("startGameBtn");
startButton.addEventListener("click", () => {
    socket.emit("startGame", {});
});
const hostCrownImage = document.createElement("img");
hostCrownImage.src = "/crown.png";
let currentPlayers = [];
let maxPlayers;
let playersNumber = 0;
gameCodeInputContainer.addEventListener("mouseleave", () => {
    clearSelection();
});
gameCodeCopyButton.addEventListener("click", () => {
    gameCodeInput.select();
    document.execCommand("copy");
    clearSelection();
    gameCodeInput.blur();
});
socket.on("playerJoined", (data) => {
    currentPlayers.push(data.name);
    const playerSpan = playersList.children[playersNumber].children[0];
    playerSpan.innerText = data.name;
    playersNumber++;
    playersNumberParagraph.innerText = playersNumber + "/" + maxPlayers;
    startButton.disabled = false;
});
socket.on("playerLeft", (data) => {
    let nameIndex = currentPlayers.indexOf(data.name);
    if (nameIndex === -1) {
        return;
    }
    currentPlayers.splice(nameIndex, 1);
    playersNumber--;
    playersNumberParagraph.innerText = playersNumber + "/" + maxPlayers;
    let listElelemnts = playersList.children;
    for (let i = 0; i < listElelemnts.length; i++) {
        let player = listElelemnts[i];
        if (player.innerText === data.name) {
            player.innerHTML = "";
            const playerSpan = document.createElement("span");
            player.appendChild(playerSpan);
            playerSpan.innerText = "\n";
            player.classList.remove("hostPlayerNameLi");
        }
        if (player.innerText === playerName && data.host === playerName) {
            startButton.style.visibility = "visible";
            player.appendChild(hostCrownImage);
            player.classList.add("hostPlayerNameLi");
        }
    }
    if (playersNumber === 1) {
        startButton.disabled = true;
    }
});
socket.on("gameStarted", (data) => {
    waitingRoomWindow.hidden = true;
    inGameWindow.hidden = false;
    startInGameWindow(data);
});
socket.on("startGameError", (data) => {
    displayAlert(data.message);
});
function startWaitingRoom(data, host) {
    currentPlayers = [];
    hostCrownImage.remove();
    playersList.innerHTML = "";
    if (host) {
        data.host = playerName;
        startButton.style.visibility = "visible";
    }
    else {
        startButton.style.visibility = "hidden";
    }
    maxPlayers = data.maxPlayers;
    playersNumber = data.players.length;
    playersNumberParagraph.innerText = playersNumber + "/" + maxPlayers;
    if (playersNumber === 1) {
        startButton.disabled = true;
    }
    else {
        startButton.disabled = false;
    }
    durationDiv.innerText = data.duration + ":00";
    diffDiv.innerText = data.diff;
    gameCodeInput.value = data.code;
    for (let i = 0; i < data.players.length; i++) {
        const playerLi = document.createElement("div");
        if (data.host === data.players[i]) {
            playerLi.appendChild(hostCrownImage);
            playerLi.classList.add("hostPlayerNameLi");
        }
        const playerNameSpan = document.createElement("span");
        currentPlayers.push(data.players[i]);
        if (data.players[i] === playerName) {
            playerNameSpan.innerText = data.players[i] + "(you)";
        }
        else {
            playerNameSpan.innerText = data.players[i];
        }
        playerLi.appendChild(playerNameSpan);
        playerLi.classList.add("playerSlot");
        playersList.appendChild(playerLi);
    }
    for (let i = 0; i < 30 - data.players.length; i++) {
        const emplyPlayerLi = document.createElement("div");
        const emptyPlayerSpan = document.createElement("span");
        emplyPlayerLi.appendChild(emptyPlayerSpan);
        if (maxPlayers > i + data.players.length) {
            emplyPlayerLi.classList.add("playerSlot");
        }
        emptyPlayerSpan.innerText = "\n";
        playersList.appendChild(emplyPlayerLi);
    }
    let dots = "\n";
    setInterval(() => {
        if (dots === "\n") {
            dots = ".";
        }
        else if (dots.length < 3) {
            dots += ".";
        }
        else {
            dots = "\n";
        }
        for (let i = playersNumber; i < maxPlayers; i++) {
            playersList.children[i].children[0].innerText = dots;
        }
    }, 500);
}
function clearSelection() {
    if (window.getSelection) {
        let selection = window.getSelection();
        if (selection.empty) {
            selection.empty();
        }
        else if (selection.removeAllRanges) {
            selection.removeAllRanges();
        }
    }
}
