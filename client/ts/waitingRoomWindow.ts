//elements

const startButton = document.getElementById("startGameBtn") as HTMLButtonElement;

const codeDiv = document.getElementById("code") as HTMLDivElement;

startButton.addEventListener("click", ()=>{
    socket.emit("startGame", {});
});

const playersUl = document.getElementById("players") as HTMLUListElement;

function startWaitingRoom(data: any, host: boolean){
    if(host){
        startButton.hidden = false;
        socket.on("startGameError", (data)=>{
            console.log(data);
        });
    }

    codeDiv.innerText = "Code: " + data.code;

    for(let i = 0; i < data.players.length; i++){
        const playerLi = document.createElement("li");
        playerLi.innerText = data.players[i];

        playersUl.appendChild(playerLi);
    }


    socket.on("playerJoined", (data)=>{
        const playerLi = document.createElement("li");
        playerLi.innerText = data.name;

        playersUl.appendChild(playerLi);
    });

    socket.on("gameStarted", (data)=>{
        waitingRoomWindow.hidden = true;
        inGameWindow.hidden = false;
        startInGameWindow(data);
    });
}