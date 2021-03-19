// main menu buttons
const hostGameButton = document.getElementById("hostGameButton") as HTMLButtonElement;





//main menu buttons eventssssssssssssssssss


hostGameButton.addEventListener("click", (e)=>{
    hostGameWindow.hidden = false;
    mainMenuWindow.hidden = true;
});