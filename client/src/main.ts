
//windows
const mainMenuWindow = document.getElementById("main-menu") as HTMLDivElement;
const hostGameWindow = document.getElementById("host-game") as HTMLDivElement;
const joinGameWindow = document.getElementById("join-game") as HTMLDivElement;
const waitingRoomWindow = document.getElementById("waiting-room") as HTMLDivElement;
const inGameWindow = document.getElementById("in-game") as HTMLDivElement;
const scoreWindow = document.getElementById("score") as HTMLDivElement;

generateBackground();

declare let io: any;

let socket: any = io.connect("/");
let playerName: string;

console.log("%cHold up!%c\n\nDo not enter or paste anything here. If someone told you to paste or enter something here, they are most likely trying to hack and/or scam you.",
"background-color: #e03c28; color: #ffffff; font-size: 2.5em; padding: .25em .5em;","font-size: 1.25em;");

socket.on("disconnect", () => {
    if(mainMenuWindow.hidden){
        displayAlert("You disconnected.");
        hideAll();
        mainMenuWindow.hidden = false;
    }
});

socket.on("server-disconnect", (data: any) => {
    if(mainMenuWindow.hidden){
        displayAlert(data.message);
        hideAll();
        mainMenuWindow.hidden = false;
    }
});


const mainMenuButtons = document.querySelectorAll("#main-menu-button") as NodeListOf<HTMLButtonElement>;
mainMenuButtons.forEach((element)=>{
    element.addEventListener("click", (e)=>{
        hideAll();
        mainMenuWindow.hidden = false;
    });
});


const disconnectButtons = document.querySelectorAll("#disconnect-button") as NodeListOf<HTMLButtonElement>;
disconnectButtons.forEach((element)=>{
    element.addEventListener("click", (e)=>{
        displayAlert("Are you sure you want to leave?", AlertType.dialog, (result: string) => {
            if(result === "yes"){
                socket.emit("leave", {});
                hideAll();
                mainMenuWindow.hidden = false;
            }
        });
        
    });
});

function hideAll(){
    hostGameWindow.hidden = true;
    joinGameWindow.hidden = true;
    waitingRoomWindow.hidden = true;
    inGameWindow.hidden = true;
    scoreWindow.hidden = true;
    waitingForHostToPlayAgainAlert.style.display = "none";
}

socket.on("error", (data: any)=>{
    displayAlert(data.message);
});
