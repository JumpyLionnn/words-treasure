
// main menu buttons
const hostGameButton = document.getElementById("hostGameButton") as HTMLButtonElement;

const joinGameButton = document.getElementById("joinGameButton") as HTMLButtonElement;

const howToPlayButton = document.getElementById("howToPlayButton") as HTMLButtonElement;

const exitButton = document.getElementById("exitButton") as HTMLButtonElement;



//main menu buttons events


hostGameButton.addEventListener("click", (e)=>{
    startHostGameWindow();
    hostGameWindow.hidden = false;
    mainMenuWindow.hidden = true;
});

joinGameButton.addEventListener("click", (e)=>{
    startJoinGameWindow();
    joinGameWindow.hidden = false;
    mainMenuWindow.hidden = true;
});

howToPlayButton.addEventListener("click", (e)=>{
    howToPlayWindow.hidden = false;
    mainMenuWindow.hidden = true;
});



exitButton.addEventListener("click", (e)=>{
    remote.getCurrentWindow().close();
});