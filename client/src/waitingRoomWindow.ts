/// <reference path="main.ts" />


const playersNumberParagraph = document.getElementById("playersNumber") as HTMLParagraphElement;

const playersList = document.getElementById("players") as HTMLDivElement;

const gameCodeInputContainer = document.getElementById("gameCodeInputContainer") as HTMLDivElement;

const gameCodeInput = document.getElementById("gameCodeInput") as HTMLInputElement;

const gameCodeCopyButton = document.getElementById("gameCodeCopyButton") as HTMLButtonElement;

const durationDiv = document.getElementById("durationDiv") as HTMLSpanElement;

const diffDiv = document.getElementById("diffDiv") as HTMLSpanElement;

const startButton = document.getElementById("startGameBtn") as HTMLButtonElement;

startButton.addEventListener("click", ()=>{
    socket.emit("startGame", {});
});

const hostCrownImage = document.createElement("img");
hostCrownImage.src = "/crown.png";

let currentPlayers: string[] = [];


let maxPlayers: number;
let playersNumber: number = 0;

gameCodeInputContainer.addEventListener("mouseleave", ()=>{
    clearSelection();
});

gameCodeCopyButton.addEventListener("click", ()=>{
    gameCodeInput.select();
    document.execCommand("copy");
    clearSelection();
    gameCodeInput.blur();
     
});

socket.on("playerJoined", (data)=>{
    currentPlayers.push(data.name);
    const playerSpan = playersList.children[playersNumber].children[0] as HTMLLIElement;
    playerSpan.innerText = data.name;
    playersNumber++;    
    playersNumberParagraph.innerText = playersNumber + "/" + maxPlayers;

    startButton.disabled = false;
});

socket.on("playerLeft", (data)=>{
    let nameIndex = currentPlayers.indexOf(data.name);
    if(nameIndex === -1){
        return;
    }
    currentPlayers.splice(nameIndex, 1);
    playersNumber--;
    playersNumberParagraph.innerText = playersNumber + "/" + maxPlayers;
    let listElelemnts = playersList.children;
    for(let i = 0; i < listElelemnts.length; i++){
        let player = listElelemnts[i] as HTMLDivElement;    
        if(player.innerText === data.name){
            player.innerHTML = "";
            const playerSpan = document.createElement("span");
            player.appendChild(playerSpan);
            playerSpan.innerText = "\n";
            player.classList.remove("hostPlayerNameLi");
        }

        if(player.innerText === playerName && data.host === playerName){
            startButton.style.visibility = "visible";
            player.appendChild(hostCrownImage);
            player.classList.add("hostPlayerNameLi");
        }
    }
    if(playersNumber === 1){
        startButton.disabled = true;
    }
});

socket.on("gameStarted", (data)=>{
    waitingRoomWindow.hidden = true;
    inGameWindow.hidden = false;
    startInGameWindow(data);
});

socket.on("startGameError", (data)=>{
    displayAlert(data.message);
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

    maxPlayers = data.maxPlayers;
    playersNumber = data.players.length;
    playersNumberParagraph.innerText = playersNumber + "/" + maxPlayers;

    if(playersNumber === 1){
        startButton.disabled = true;
    }
    else{
        startButton.disabled = false; 
    }

    durationDiv.innerText = data.duration + ":00";
    diffDiv.innerText = data.diff

    gameCodeInput.value = data.code;


    for(let i = 0; i < data.players.length; i++){
        const playerLi = document.createElement("div");
         
        if(data.host === data.players[i]){
            playerLi.appendChild(hostCrownImage);
            playerLi.classList.add("hostPlayerNameLi");
        }
        const playerNameSpan = document.createElement("span");
        currentPlayers.push(data.players[i])
        if(data.players[i] === playerName){
            playerNameSpan.innerText = data.players[i] + "(you)";
        }
        else{   
            playerNameSpan.innerText = data.players[i];
        }
        playerLi.appendChild(playerNameSpan);
        playerLi.classList.add("playerSlot");
        playersList.appendChild(playerLi);
    }
    for(let i = 0; i < 30 - data.players.length; i++){
        const emplyPlayerLi = document.createElement("div");
        const emptyPlayerSpan = document.createElement("span");
        emplyPlayerLi.appendChild(emptyPlayerSpan);
        if(maxPlayers > i + data.players.length){
            emplyPlayerLi.classList.add("playerSlot");
        }
        emptyPlayerSpan.innerText = "\n";
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
    if (window.getSelection) {
        let selection = window.getSelection() as Selection;
        if (selection.empty) { 
            selection.empty();
        }
        else if (selection.removeAllRanges) { 
            selection.removeAllRanges();
        }
    }
}
