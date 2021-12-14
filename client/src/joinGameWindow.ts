/// <reference path="main.ts" />

// join game elements
const codeTextbox = document.getElementById("code-textbox") as HTMLInputElement;
const joinButton = document.getElementById("join-button") as HTMLButtonElement;
const joinNameTextbox = document.getElementById("join-name-textbox") as HTMLInputElement;

let code: string = "";

joinNameTextbox.addEventListener("input", ()=>{
    joinNameTextbox.value = joinNameTextbox.value.replace(/[^a-zA-Z0-9 ]/g,"");
});

codeTextbox.addEventListener("input", ()=>{
    codeTextbox.value = codeTextbox.value.toUpperCase().replace(/[^A-Z]+/g,"");
});

socket.on("joined-game", (data: any)=>{
    window.removeEventListener("keydown", joinGameKeyDown);
    hideAll();
    waitingRoomWindow.hidden = false;
    data.code = code;
    startWaitingRoom(data, false);
});

function startJoinGameWindow(){
    codeTextbox.value = "";
    joinNameTextbox.value = window.localStorage.getItem("word-game-name") || "";
    window.addEventListener("keydown", joinGameKeyDown);
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

function joinGameKeyDown(e: KeyboardEvent){
    if(e.key === "Enter" && (!e.repeat)){
        joinGame();
    }
}