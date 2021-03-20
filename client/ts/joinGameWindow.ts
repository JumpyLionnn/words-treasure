// join game elements

const codeTextbox = document.getElementById("codeTextbox") as HTMLInputElement;

const joinButton = document.getElementById("joinBtn") as HTMLButtonElement;

const joinMessage = document.getElementById("joinMessage") as HTMLDivElement;

const joinNameTextbox = document.getElementById("joinNameTextbox") as HTMLInputElement;

joinNameTextbox.addEventListener("input", ()=>{
    let name = joinNameTextbox.value;
    if(name.length > 10 || name.length < 2){
        joinNameTextbox.classList.add("textboxError");
    }
    else{
        joinNameTextbox.classList.remove("textboxError");
    }
});

codeTextbox.addEventListener("input", ()=>{
    codeTextbox.value = codeTextbox.value.toUpperCase();
});

joinButton.addEventListener("click", ()=>{
    let name = joinNameTextbox.value;
    let code = codeTextbox.value;

    if(name.length > 10 || name.length < 2){
        joinMessage.innerText = "The name length should be in range of 2 -10 characters"
    }
    else{
        if(socket === undefined){
            socket = io.connect("http://localhost:3300");
        }
        

        socket.on("joinGameError", (data)=>{
            joinMessage.innerText = data.message;
        });

        socket.on("joinedGame", (data)=>{
            joinGameWindow.hidden = true;
            waitingRoomWindow.hidden = false;
            data.code = code;
            startWaitingRoom(data, false);
        })

        socket.emit("join", {
            name: name,
            code: code
        });
    }
});