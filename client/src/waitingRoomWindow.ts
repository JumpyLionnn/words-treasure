/// <reference path="main.ts" />
//elements


//playersNumber
const playersNumberParagraph = document.getElementById("playersNumber") as HTMLParagraphElement;

const playersUl = document.getElementById("players") as HTMLUListElement;

const codeDiv = document.getElementById("code") as HTMLSpanElement;

const durationDiv = document.getElementById("durationDiv") as HTMLSpanElement;

const diffDiv = document.getElementById("diffDiv") as HTMLSpanElement;

const waitingMessage = document.getElementById("waitingMessage") as HTMLDivElement;

const startButton = document.getElementById("startGameBtn") as HTMLButtonElement;

startButton.addEventListener("click", ()=>{
    socket.emit("startGame", {});
});


let maxPlayers: number;
let playersNumber: number = 0;



socket.on("playerJoined", (data)=>{
    const playerLi = document.createElement("li");
    playerLi.innerText = data.name;
    playersNumber++;
    playersNumberParagraph.innerText = playersNumber + "/" + maxPlayers;
    playersUl.appendChild(playerLi);
});

socket.on("playerLeft", (data)=>{
    playersNumber--;
    playersNumberParagraph.innerText = playersNumber + "/" + maxPlayers;
    let listElelemnts = playersUl.children;
    for(let i = 0; i < listElelemnts.length; i++){
        let li = listElelemnts[i] as HTMLLIElement;
        if(li.innerText === data.name){
            playersUl.removeChild(listElelemnts[i]);
        }
    }
    if(data.host === playerName){
        startButton.hidden = false;
    }
});

socket.on("gameStarted", (data)=>{
    waitingRoomWindow.hidden = true;
    inGameWindow.hidden = false;
    startInGameWindow(data);
});

socket.on("startGameError", (data)=>{
    waitingMessage.innerText = data.message;
});


function startWaitingRoom(data: any, host: boolean){
    waitingMessage.innerText = "";
    playersUl.innerHTML = "";
    if(host){
        startButton.hidden = false;
        waitingMessage.hidden = false;
    }
    else{
        startButton.hidden = true;
    }

    maxPlayers = data.maxPlayers;
    playersNumber += data.players.length;
    playersNumberParagraph.innerText = playersNumber + "/" + maxPlayers;

    durationDiv.innerText = data.duration + ":00";
    diffDiv.innerText = data.diff

    codeDiv.innerText = data.code;

    for(let i = 0; i < data.players.length; i++){
        const playerLi = document.createElement("li");
        playerLi.innerText = data.players[i];
        playersUl.appendChild(playerLi);
    } 
}