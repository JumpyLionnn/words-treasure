"use strict";
// host game buttons
const createButton = document.getElementById("createBtn");
createButton.addEventListener("click", () => {
});
//windows
const mainMenuWindow = document.querySelector("div.mainMenu");
const hostGameWindow = document.querySelector("div.hostGame");
// shared elements
const nameTextbox = document.getElementById("nameTextbox");
nameTextbox.addEventListener("input", () => {
    console.log("input event");
    let name = nameTextbox.value;
    if (name.length > 10 || name.length < 2) {
        nameTextbox.classList.add("textboxError");
    }
    else {
        nameTextbox.classList.remove("textboxError");
    }
});
let socket;
// main menu buttons
const hostGameButton = document.getElementById("hostGameButton");
//main menu buttons eventssssssssssssssssss
hostGameButton.addEventListener("click", (e) => {
    hostGameWindow.hidden = false;
    mainMenuWindow.hidden = true;
});
