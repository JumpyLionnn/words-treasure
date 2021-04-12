/// <reference path="main.ts" />

// join game elements

const codeTextbox = document.getElementById("codeTextbox") as HTMLInputElement;

const joinButton = document.getElementById("joinBtn") as HTMLButtonElement;

const joinMessage = document.getElementById("joinMessage") as HTMLDivElement;

const joinNameTextbox = document.getElementById("joinNameTextbox") as HTMLInputElement;

let joinGameEnterKeyUpdated = false;

joinNameTextbox.addEventListener("input", ()=>{
    let name = joinNameTextbox.value;
    if(name.length > 10 || name.length < 2){
        joinNameTextbox.classList.add("textboxError");
    }
    else{
        joinNameTextbox.classList.remove("textboxError");
    }
});

codeTextbox.addEventListener("input", ()=>{
    codeTextbox.value = codeTextbox.value.toUpperCase().replace(/[\W_]+/g,"");;
});

let code: string = "";

socket.on("joinGameError", (data)=>{
    joinMessage.innerText = data.message;
});

socket.on("joinedGame", (data: any)=>{
    window.removeEventListener("keydown", joinGameKeyDown);
    window.removeEventListener("keyup", joinGameKeyUp);
    joinGameWindow.hidden = true;
    waitingRoomWindow.hidden = false;
    data.code = code;
    startWaitingRoom(data, false);
})


function startJoinGameWindow(){
    codeTextbox.value = "";
    joinNameTextbox.value = window.localStorage.getItem("word-game-name") || "";
    joinMessage.innerText = "";
    window.addEventListener("keydown", joinGameKeyDown);
    window.addEventListener("keyup", joinGameKeyUp);
}

joinButton.addEventListener("click", joinGame);

function joinGame(){
    playerName = joinNameTextbox.value;
    code = codeTextbox.value;

    if(playerName.length > 10 || playerName.length < 2){
        joinMessage.innerText = "The name length should be in range of 2 -10 characters"
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