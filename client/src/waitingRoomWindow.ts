/// <reference path="main.ts" />


const playersCounter = document.getElementById("players-counter") as HTMLParagraphElement;
const playersList = document.getElementById("players") as HTMLDivElement;
const gameCodeInputContainer = document.getElementById("game-code-input-container") as HTMLDivElement;
const gameCodeInput = document.getElementById("game-code-input") as HTMLInputElement;
const gameCodeCopyButton = document.getElementById("game-code-copy-button") as HTMLButtonElement;
const durationDisplay = document.getElementById("duration-display") as HTMLSpanElement;
const difficultyDisplay = document.getElementById("difficulty-display") as HTMLSpanElement;
const startButton = document.getElementById("start-game-button") as HTMLButtonElement;

const hostCrownImage = document.createElement("img");
hostCrownImage.src = "assets/images/crown.png";

let currentPlayers: string[] = [];

let maxPlayers: number;
let playersNumber: number = 0;

let host: string;

startButton.addEventListener("click", ()=>{
    socket.emit("start-game", {});
});

gameCodeInputContainer.addEventListener("mouseleave", ()=>{
    clearSelection();
});

gameCodeCopyButton.addEventListener("click", ()=>{
    gameCodeInput.select();
    document.execCommand("copy");
    clearSelection();
    gameCodeInput.blur();
});

socket.on("player-joined", (data: any)=>{
    currentPlayers.push(data.name);
    const playerSpan = playersList.children[playersNumber].querySelector("#player-name") as HTMLSpanElement;
    playerSpan.innerText = data.name;
    playersNumber++;    
    playersCounter.innerText = playersNumber + "/" + maxPlayers;
    startButton.disabled = false;
});

socket.on("player-left", (data: any)=>{
    let nameIndex = currentPlayers.indexOf(data.name);
    if(nameIndex === -1){
        return;
    }
    currentPlayers.splice(nameIndex, 1);
    playersNumber--;
    playersCounter.innerText = playersNumber + "/" + maxPlayers;
    let listElelemnts = playersList.children;
    for(let i = 0; i < listElelemnts.length; i++){
        let player = listElelemnts[i] as HTMLDivElement;
        let playerNameSpan = player.querySelector("#player-name") as HTMLSpanElement;
        if(playerNameSpan.innerText === data.name){
            player.innerHTML = "";
            const playerSpan = document.createElement("span");
            player.appendChild(playerSpan);
            playerSpan.innerText = "\n";
            player.classList.remove("host-player-name-li");
        }
        if(playerNameSpan.innerText === data.host && data.host !== host){
            startButton.style.visibility = "visible";
            player.appendChild(hostCrownImage);
            player.classList.add("host-player-name-li");
            host = data.host;
        }
    }
    if(playersNumber === 1){
        startButton.disabled = true;
    }
});

socket.on("game-started", (data: any)=>{
    waitingRoomWindow.hidden = true;
    inGameWindow.hidden = false;
    startInGameWindow(data);
});


function startWaitingRoom(data: any, host: boolean){
    currentPlayers = [];
    hostCrownImage.remove();
    playersList.innerHTML = "";

    if(host){
        data.host = playerName;
        startButton.style.visibility = "visible";
    }
    else{
        
        startButton.style.visibility = "hidden";
    }
    host = data.host;
    maxPlayers = data.maxPlayers;
    playersNumber = data.players.length;
    playersCounter.innerText = playersNumber + "/" + maxPlayers;

    if(playersNumber === 1){
        startButton.disabled = true;
    }
    else{
        startButton.disabled = false; 
    }

    durationDisplay.innerText = data.duration + ":00";
    difficultyDisplay.innerText = data.difficulty

    gameCodeInput.value = data.code;

    for(let i = 0; i < data.players.length; i++){
        const playerLi = document.createElement("div");
         
        if(data.host === data.players[i]){
            playerLi.appendChild(hostCrownImage);
            playerLi.classList.add("host-player-name-li");
        }
        const playerNameSpan = document.createElement("span");
        playerNameSpan.id = "player-name";
        playerNameSpan.innerText = data.players[i];
        playerLi.appendChild(playerNameSpan);
        
        currentPlayers.push(data.players[i]);
        if(data.players[i] === playerName){
            const youSpan = document.createElement("span");
            youSpan.innerText = "(you)";
            playerLi.appendChild(youSpan);
        }
        else{   
            playerNameSpan.innerText = data.players[i];
        }

        playerLi.id = "player-slot";
        playersList.appendChild(playerLi);
    }
    for(let i = 0; i < 30 - data.players.length; i++){
        const emplyPlayerLi = document.createElement("div");
        const emptyPlayerSpan = document.createElement("span");
        emplyPlayerLi.appendChild(emptyPlayerSpan);
        if(maxPlayers > i + data.players.length){
            emplyPlayerLi.id = "player-slot";
        }
        emptyPlayerSpan.innerText = "\n";
        emptyPlayerSpan.id = "player-name";
        playersList.appendChild(emplyPlayerLi); 
    }
    let dots = "\n";
    setInterval(()=>{
        if(dots === "\n"){
            dots = "."
        }
        else if(dots.length < 3){
            dots += ".";
        }
        else{
            dots = "\n"
        }
        for(let i = playersNumber; i < maxPlayers; i++){
            (playersList.children[i].children[0] as HTMLSpanElement).innerText = dots;
        }
    }, 500);
}


function clearSelection(){
    let selection = window.getSelection();
    if (selection !== null) {
        if (selection.empty) { 
            selection.empty();
        }
        else if (selection.removeAllRanges) { 
            selection.removeAllRanges();
        }
    }
}
