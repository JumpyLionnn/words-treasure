//windows
const mainMenuWindow = document.querySelector("div.mainMenu") as HTMLDivElement;

const hostGameWindow = document.querySelector("div.hostGame") as HTMLDivElement;

// shared elements

const nameTextbox = document.getElementById("nameTextbox") as HTMLInputElement;
nameTextbox.addEventListener("input", ()=>{
    console.log("input event")
    let name = nameTextbox.value;
    if(name.length > 10 || name.length < 2){
        nameTextbox.classList.add("textboxError");
    }
    else{
        nameTextbox.classList.remove("textboxError");
    }
});


let socket;

