const timeRemainingDiv = document.getElementById("timeRemaining") as HTMLDivElement;

const wordDisplayDiv = document.getElementById("wordDisplay") as HTMLDivElement;

const wordInput = document.getElementById("wordInput") as HTMLInputElement;
wordInput.addEventListener("input", ()=>{
    inGameMessage.innerText = "";
    wordInput.value = wordInput.value.replace(/[\W_]+/g,"");
});

const inGameMessage = document.getElementById("inGameMessage") as HTMLDivElement;

const submitWordBtn = document.getElementById("submitWord") as HTMLButtonElement;
submitWordBtn.addEventListener("click", submitWord);

const currentWordsTable = document.getElementById("currentWords") as HTMLTableElement;

let timeRemaining: number;

let inGameEnterKeyUpdated = false;

socket.on("addWordError", (data)=>{
    inGameMessage.innerText = data.message;
})

socket.on("wordResult", (data)=>{
    if(data.correct){
        const wordTh = document.createElement("td");
        wordTh.innerText = data.word;
        if(currentWordsTable.lastChild){
            if(currentWordsTable.lastChild.childNodes.length === 5){
                const tr = document.createElement("tr");
                tr.appendChild(wordTh);
                currentWordsTable.appendChild(tr);
            }
            else{
                currentWordsTable.lastChild.appendChild(wordTh);
            }
        }
        else{
            const tr = document.createElement("tr");
            tr.appendChild(wordTh);
            currentWordsTable.appendChild(tr);
        }   
        
    }
    else{
        inGameMessage.innerText = data.message;
    }
});

socket.on("ended", (data)=>{
    window.removeEventListener("keydown", inGameKeyDown);
    window.removeEventListener("keyup", inGameKeyUp);
    inGameWindow.hidden = true;
    scoreWindow.hidden = false;
    startScoreWindow(data);
});


function startInGameWindow(data: any){
    inGameMessage.innerText = "";
    wordInput.value = "";
    currentWordsTable.innerHTML = "";

    wordDisplayDiv.innerText = data.word;
    
    inGameWindow.addEventListener("keydown", inGameKeyDown);
    inGameWindow.addEventListener("keyup", inGameKeyUp);

    timeRemainingDiv.innerText = data.duration + ":00";
    timeRemaining = data.duration * 60;
    let timer  = setInterval(()=>{
        timeRemaining--;
        let seconds = timeRemaining % 60;

        if(timeRemaining === 0){
            clearInterval(timer);
            window.removeEventListener("keydown", submitWord);
        }

        if(seconds < 10){
            timeRemainingDiv.innerText = Math.floor(timeRemaining / 60) + ":0" + seconds;
        }
        else{
            timeRemainingDiv.innerText = Math.floor(timeRemaining / 60) + ":" + seconds;
        }
    }, 1000);
}

function submitWord(){
    wordInput.focus();
    socket.emit("addWord", {word: wordInput.value});
    wordInput.value = "";
}


function inGameKeyDown(e: any){
    if(e.key === "Enter" && inGameEnterKeyUpdated === false){
        inGameEnterKeyUpdated = true;
        submitWord();
    }
}


function inGameKeyUp(e: any){
    if(e.key === "Enter"){
        inGameEnterKeyUpdated = false;
    }
}