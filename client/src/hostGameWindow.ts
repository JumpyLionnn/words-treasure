/// <reference path="main.ts" />

// host game buttons
const durationDropdown = document.getElementById("duration") as HTMLSelectElement;
const maxPlayersInput = document.getElementById("max-players-input") as HTMLInputElement;
const difficultyButtons = document.querySelectorAll("button.difficulty-button") as NodeListOf<HTMLButtonElement>;

const createButton = document.getElementById("create-button") as HTMLButtonElement;

let difficultySelection = "normal";

difficultyButtons.forEach((element)=>{
    element.addEventListener("click", ()=>{
        difficultySelection = element.dataset.difficulty as string;
        difficultyButtons.forEach((element)=>{
            element.classList.remove("difficulty-selected");
        });
        element.classList.add("difficulty-selected");
    });
});

maxPlayersInput.addEventListener("input", () =>{
    const value = parseInt(maxPlayersInput.value);
    if(value > parseInt(maxPlayersInput.max)){
        maxPlayersInput.value = maxPlayersInput.max;
    }
    else if(value < parseInt(maxPlayersInput.min)){
        maxPlayersInput.value = maxPlayersInput.min;
    }
});

const hostNameTextbox = document.getElementById("host-name-textbox") as HTMLInputElement;

hostNameTextbox.addEventListener("input", ()=>{
    hostNameTextbox.value = hostNameTextbox.value.replace(/[^a-zA-Z0-9 ]/g,"");
});

createButton.addEventListener("click", createGame);

socket.on("game-created", (data: any)=>{
    window.removeEventListener("keydown", hostGameKeyDown);
    hideAll();
    waitingRoomWindow.hidden = false;
    data.players = [playerName];

    startWaitingRoom(data, true);
});

function startHostGameWindow(){ 
    hostNameTextbox.value = window.localStorage.getItem("word-game-name") || "";
    const settings = JSON.parse(window.localStorage.getItem("word-game-settings") || "{}");
    if(settings.duration){
        durationDropdown.value = settings.duration;
    }
    if(settings.difficulty){
        difficultySelection = settings.difficulty;
        difficultyButtons.forEach((element)=>{
            if(element.dataset.difficulty === settings.difficulty){
                element.classList.add("difficulty-selected");
            }
            else{
                element.classList.remove("difficulty-selected");
            }
        });
    }
    window.addEventListener("keydown", hostGameKeyDown);
}

function createGame(){
    let duration = durationDropdown.selectedIndex + 2;
    let maxPlayers = parseInt(maxPlayersInput.value);
    playerName = hostNameTextbox.value.trim();

    if(playerName.length > 10 || playerName.length < 2){
        displayAlert("The name length should be in range of 2 - 10 letters.");
    }
    else{
        window.localStorage.setItem("word-game-settings", JSON.stringify({
            duration: duration.toString(), 
            difficulty: difficultySelection, 
        }));
        window.localStorage.setItem("word-game-name", playerName);

        socket.emit("host", {
            duration: duration,
            maxPlayers: maxPlayers,
            difficulty: difficultySelection,
            name: playerName
        });
    }
}


function hostGameKeyDown(e: KeyboardEvent){
    if(e.key === "Enter" && (!e.repeat)){
        createGame();
    }
}


