
// main menu buttons
const hostGameButton = document.getElementById("hostGameButton") as HTMLButtonElement;

const joinGameButton = document.getElementById("joinGameButton") as HTMLButtonElement;



//main menu buttons events


hostGameButton.addEventListener("click", (e)=>{
    if(socket.disconnected){
        displayAlert("You cannot host a game since you are not connected to the server.");
    }
    else{
        startHostGameWindow();
        hostGameWindow.hidden = false;
        mainMenuWindow.hidden = true;
    }
    
});

joinGameButton.addEventListener("click", (e)=>{
    if(socket.disconnected){
        displayAlert("You cannot join a game since you are not connected to the server.");
    }
    else{
        startJoinGameWindow();
        joinGameWindow.hidden = false;
        mainMenuWindow.hidden = true;
    }
});