/// <reference path=".d.ts" />

// host game buttons

const durationDropDown = document.getElementById("duration") as HTMLSelectElement;

const maxPlayersDropDown = document.getElementById("maxPlayers") as HTMLSelectElement;

const diffButtons = document.querySelectorAll("button.diffBtn") as NodeListOf<HTMLButtonElement>;

diffButtons.forEach((element)=>{
    element.addEventListener("click", ()=>{
        diffSelection = element.dataset.diff as string;
        diffButtons.forEach((element)=>{
            element.classList.remove("diffSelected");
        });
        element.classList.add("diffSelected");
    });
});

const hostNameTextbox = document.getElementById("hostNameTextbox") as HTMLInputElement;

hostNameTextbox.addEventListener("input", ()=>{
    let name = hostNameTextbox.value;
    if(name.length > 10 || name.length < 2){
        hostNameTextbox.classList.add("textboxError");
    }
    else{
        hostNameTextbox.classList.remove("textboxError");
    }
});

const hostMessage = document.getElementById("hostMessage") as HTMLDivElement;

const createButton = document.getElementById("createBtn") as HTMLButtonElement;




let diffSelection = "normal";

let hostGameEnterKeyUpdated = false;

createButton.addEventListener("click", createGame);

function startHostGameWindow(){ 
    window.addEventListener("keydown", hostGameKeyDown);
    window.addEventListener("keyup", hostGameKeyUp);
}

function createGame(){
    let duration = durationDropDown.selectedIndex + 2;
    let maxPlayers = maxPlayersDropDown.selectedIndex + 2;
    playerName = hostNameTextbox.value;

    if(playerName.length > 10 || playerName.length < 2){
        hostMessage.innerText = "the name length should be in range of 2 - 10 letters";
    }
    else{
        socket.on("hostGameError", (data)=>{
            hostMessage.innerText = data.message;
        });

        socket.on("gameCreated", (data)=>{
            window.removeEventListener("keydown", hostGameKeyDown);
            window.removeEventListener("keyup", hostGameKeyUp);
            hostGameWindow.hidden = true;
            waitingRoomWindow.hidden = false;
            data.players = [playerName];

            data.diff = diffSelection;
            data.duration = duration;
            data.maxPlayers = maxPlayers;
            startWaitingRoom(data, true);
        });

        socket.emit("host", {
            duration: duration,
            maxPlayers: maxPlayers,
            diff: diffSelection,
            name: playerName
        });
    }
}


function hostGameKeyDown(e: any){
    if(e.key === "Enter" && hostGameEnterKeyUpdated === false){
        createGame();
        hostGameEnterKeyUpdated = true;
    }
}

function hostGameKeyUp(e: any){
    if(e.key === "Enter"){
        hostGameEnterKeyUpdated = false;
    }
}


