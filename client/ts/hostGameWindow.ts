/// <reference path=".d.ts" />

// host game buttons

const durationDropDown = document.getElementById("duration") as HTMLSelectElement;

const maxPlayersDropDown = document.getElementById("maxPlayers") as HTMLSelectElement;


const createButton = document.getElementById("createBtn") as HTMLButtonElement;

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


let diffSelection = "normal";

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

createButton.addEventListener("click", ()=>{
    let duration = durationDropDown.selectedIndex + 2;
    let maxPlayers = maxPlayersDropDown.selectedIndex + 2;
    let name = hostNameTextbox.value;

    if(name.length > 10 || name.length < 2){
        console.log("the name length is not correct");
    }
    else{
        socket.on("hostGameError", (data)=>{
            console.log(data);
        });

        socket.on("gameCreated", (data)=>{
            hostGameWindow.hidden = true;
            waitingRoomWindow.hidden = false;
            data.players = [name];

            data.diff = diffSelection;
            data.duration = duration;
            data.maxPlayers = maxPlayers;
            startWaitingRoom(data, true);
        })

        socket.emit("host", {
            duration: duration,
            maxPlayers: maxPlayers,
            diff: diffSelection,
            name: name
        });
    }
        
});


