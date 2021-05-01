
//windows
const mainMenuWindow = document.querySelector("div.mainMenu") as HTMLDivElement;

const howToPlayWindow = document.querySelector("div.howToPlay") as HTMLDivElement;

const hostGameWindow = document.querySelector("div.hostGame") as HTMLDivElement;

const joinGameWindow = document.querySelector("div.joinGame") as HTMLDivElement;

const waitingRoomWindow = document.querySelector("div.waitingRoom") as HTMLDivElement;

const inGameWindow = document.querySelector("div.inGame") as HTMLDivElement;

const scoreWindow = document.querySelector("div.score") as HTMLDivElement;


generateBackground();


let socket: Socket = io.connect("/");
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


const mainMenuButtons = document.querySelectorAll("#mainMenuButton") as NodeListOf<HTMLButtonElement>;
mainMenuButtons.forEach((element)=>{
    element.addEventListener("click", (e)=>{
        hideAll();
        mainMenuWindow.hidden = false;
    });
});


const disconnectButtons = document.querySelectorAll("#disconnectButton") as NodeListOf<HTMLButtonElement>;
disconnectButtons.forEach((element)=>{
    element.addEventListener("click", (e)=>{
        displayAlert("Are you sure you want to leave?", "yesno", (result: string) => {
            if(result === "yes"){
                socket.emit("leave", {});
                hideAll();
                mainMenuWindow.hidden = false;
            }
        });
        
    });
});

function hideAll(){
    howToPlayWindow.hidden = true;
    hostGameWindow.hidden = true;
    joinGameWindow.hidden = true;
    waitingRoomWindow.hidden = true;
    inGameWindow.hidden = true;
    scoreWindow.hidden = true;
    waitingForHostToPlayAgainAlert.style.display = "none";
}




