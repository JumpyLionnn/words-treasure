const timeRemainingDisplay = document.getElementById("time-remaining") as HTMLDivElement;
const wordDisplay = document.getElementById("word-display") as HTMLDivElement;
const wordInput = document.getElementById("word-input") as HTMLInputElement;
const inGameMessage = document.getElementById("in-game-message") as HTMLDivElement;
const submitWordButton = document.getElementById("submit-word") as HTMLButtonElement;
submitWordButton.addEventListener("click", submitWord);
const currentWordsTable = document.getElementById("current-words") as HTMLDivElement;

let timeRemaining: number;
let waitingForWords = [];

wordInput.addEventListener("input", ()=>{
    inGameMessage.innerText = "\n";
    wordInput.value = wordInput.value.toLowerCase().replace(/[^a-z]+/g,"");
});

socket.on("error", (data: any)=>{
    inGameMessage.innerText = data.message;
})

socket.on("word-result", (data: any)=>{
    if(data.correct){
        const div = document.createElement("div");
        div.innerText = data.word;
        if(currentWordsTable.children.length === 0 || currentWordsTable.children[currentWordsTable.children.length -1].children.length === 10){
            const column = document.createElement("div");
            column.classList.add("column");
            column.appendChild(div);
            currentWordsTable.appendChild(column);
        }
        else{
            currentWordsTable.children[currentWordsTable.children.length -1].appendChild(div)
        }
    }
    else{
        wordInput.classList.add("wrong");
        setTimeout(()=>{
            wordInput.classList.remove("wrong");
        }, 400);
        inGameMessage.innerText = data.message;
    }
});

socket.on("ended", (data: any)=>{
    window.removeEventListener("keydown", inGameKeyDown);
    inGameWindow.hidden = true;
    scoreWindow.hidden = false;
    startScoreWindow(data);
});


function startInGameWindow(data: any){
    inGameMessage.innerText = "\n";
    wordInput.value = "";
    currentWordsTable.innerHTML = "";

    wordDisplay.innerText = data.word;
    
    inGameWindow.addEventListener("keydown", inGameKeyDown);

    timeRemainingDisplay.innerText = data.duration + ":00";
    timeRemaining = data.duration * 60;
    let timer  = setInterval(()=>{
        timeRemaining--;
        let seconds = timeRemaining % 60;

        if(timeRemaining === 0){
            clearInterval(timer);
        }

        if(seconds < 10){
            timeRemainingDisplay.innerText = Math.floor(timeRemaining / 60) + ":0" + seconds;
        }
        else{
            timeRemainingDisplay.innerText = Math.floor(timeRemaining / 60) + ":" + seconds;
        }
    }, 1000);
}

function submitWord(){
    wordInput.focus();
    waitingForWords.push(wordInput.value);
    socket.emit("add-word", {word: wordInput.value});
    wordInput.value = "";
}


function inGameKeyDown(e: KeyboardEvent){
    if(e.key === "Enter" && (!e.repeat)){
        submitWord();
    }
}