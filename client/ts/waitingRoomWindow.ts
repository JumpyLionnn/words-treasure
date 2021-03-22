//elements



const codeDiv = document.getElementById("code") as HTMLDivElement;


const playersUl = document.getElementById("players") as HTMLUListElement;

const waitingMessage = document.getElementById("waitingMessage") as HTMLDivElement;

const startButton = document.getElementById("startGameBtn") as HTMLButtonElement;

startButton.addEventListener("click", ()=>{
    socket.emit("startGame", {});
});


function startWaitingRoom(data: any, host: boolean){
    if(host){
        showHost();
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

    socket.on("playerLeft", (data)=>{
        let listElelemnts = playersUl.children;
        for(let i = 0; i < listElelemnts.length; i++){
            let li = listElelemnts[i] as HTMLLIElement;
            if(li.innerText === data.name){
                playersUl.removeChild(listElelemnts[i]);
            }
        }
        if(data.host === playerName){
            showHost();
        }
    });

    socket.on("gameStarted", (data)=>{
        waitingRoomWindow.hidden = true;
        inGameWindow.hidden = false;
        startInGameWindow(data);
    });
}

function showHost(){
    startButton.hidden = false;
    socket.on("startGameError", (data)=>{
        waitingMessage.innerText = data.message;
    });
}