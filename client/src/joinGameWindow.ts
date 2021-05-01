/// <reference path="main.ts" />

// join game elements

const codeTextbox = document.getElementById("codeTextbox") as HTMLInputElement;

const joinButton = document.getElementById("joinBtn") as HTMLButtonElement;

const joinNameTextbox = document.getElementById("joinNameTextbox") as HTMLInputElement;

let joinGameEnterKeyUpdated = false;

joinNameTextbox.addEventListener("input", ()=>{
    joinNameTextbox.value = joinNameTextbox.value.replace(/[^a-zA-Z0-9 ]/g,"");
});

codeTextbox.addEventListener("input", ()=>{
    codeTextbox.value = codeTextbox.value.toUpperCase().replace(/[^A-Z]+/g,"");
});

let code: string = "";

socket.on("joinGameError", (data)=>{
    displayAlert(data.message);
});

socket.on("joinedGame", (data: any)=>{
    window.removeEventListener("keydown", joinGameKeyDown);
    window.removeEventListener("keyup", joinGameKeyUp);
    hideAll();
    waitingRoomWindow.hidden = false;
    data.code = code;
    startWaitingRoom(data, false);
})


function startJoinGameWindow(){
    codeTextbox.value = "";
    joinNameTextbox.value = window.localStorage.getItem("word-game-name") || "";
    window.addEventListener("keydown", joinGameKeyDown);
    window.addEventListener("keyup", joinGameKeyUp);
}

joinButton.addEventListener("click", joinGame);

function joinGame(){
    playerName = joinNameTextbox.value;
    code = codeTextbox.value;

    if(playerName.length < 2){
        displayAlert("The name length should be in range of 2 - 10 characters.");
    }
    else if(code.length !== 5){
        displayAlert("The game you tried to join does not exist.");
    }
    else{
        window.localStorage.setItem("word-game-name", playerName);
        socket.emit("join", {
            name: playerName,
            code: code
        });
    }
}


function joinGameKeyDown(e: any){
    if(e.key === "Enter" && joinGameEnterKeyUpdated === false){
        joinGame();
        joinGameEnterKeyUpdated = true;
    }
}

function joinGameKeyUp(e: any){
    if(e.key === "Enter"){
        joinGameEnterKeyUpdated = false;
    }
}