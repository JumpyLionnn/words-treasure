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


let maxPlayers: number;
let playersNumber: number = 0;

gameCodeInputContainer.addEventListener("mouseleave", ()=>{
    clearSelection();
});

gameCodeCopyButton.addEventListener("click", ()=>{
    gameCodeInput.select();
    gameCodeInput.setSelectionRange(0, 5);
    document.execCommand("copy");
    clearSelection();   
});

socket.on("playerJoined", (data)=>{
    //const playerLi = document.createElement("li");
    
    const playerLi = playersList.children[playersNumber] as HTMLLIElement;
    playerLi.innerText = data.name;
    playersNumber++;    
    playersNumberParagraph.innerText = playersNumber + "/" + maxPlayers;

    startButton.disabled = false;
    //playersUl.appendChild(playerLi);
});

socket.on("playerLeft", (data)=>{
    console.log("player left")
    playersNumber--;
    console.log(playersNumber);
    console.log(data.name)
    playersNumberParagraph.innerText = playersNumber + "/" + maxPlayers;
    let listElelemnts = playersList.children;
    for(let i = 0; i < listElelemnts.length; i++){
        let player = listElelemnts[i] as HTMLDivElement;
        if(player.innerText === data.name){
            playersList.removeChild(player);
            const newEmptyPlayer = document.createElement("div");
            newEmptyPlayer.innerText = "";
            playersList.appendChild(newEmptyPlayer);
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
        playerLi.innerText = data.players[i];
        if(data.host === data.players[i]){
            playerLi.appendChild(hostCrownImage);
            playerLi.classList.add("hostPlayerNameLi");
        }
        playersList.appendChild(playerLi);
    }
    for(let i = 0; i < 30 - data.players.length; i++){
        const emplyPlayerLi = document.createElement("div");
        emplyPlayerLi.innerText = "\n";
        playersList.appendChild(emplyPlayerLi); 
    }
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
