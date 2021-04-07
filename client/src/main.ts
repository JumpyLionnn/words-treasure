
//windows
const mainMenuWindow = document.querySelector("div.mainMenu") as HTMLDivElement;

const howToPlayWindow = document.querySelector("div.howToPlay") as HTMLDivElement;

const hostGameWindow = document.querySelector("div.hostGame") as HTMLDivElement;

const joinGameWindow = document.querySelector("div.joinGame") as HTMLDivElement;

const waitingRoomWindow = document.querySelector("div.waitingRoom") as HTMLDivElement;

const inGameWindow = document.querySelector("div.inGame") as HTMLDivElement;

const scoreWindow = document.querySelector("div.score") as HTMLDivElement;





let socket: Socket = io.connect("/");
let playerName: string;


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
        socket.emit("leave", {});
        hideAll();
        mainMenuWindow.hidden = false;
    });
});

function hideAll(){
    howToPlayWindow.hidden = true;
    hostGameWindow.hidden = true;
    joinGameWindow.hidden = true;
    waitingRoomWindow.hidden = true;
    inGameWindow.hidden = true;
    scoreWindow.hidden = true;
}
