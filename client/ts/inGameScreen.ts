/*
<div class="wordDisplay" id="wordDisplay"></div>
<input type="text" name="wordInput" class="wordInput" id="wordInput">
<button class="submitWord" id="submitWord">Submit</button>
<table class="currentWords"></table>
*/
const timeRemainingDiv = document.getElementById("timeRemaining") as HTMLDivElement;

const wordDisplayDiv = document.getElementById("wordDisplay") as HTMLDivElement;

const wordInput = document.getElementById("wordInput") as HTMLInputElement;
wordInput.addEventListener("input", ()=>{
    wordInput.value = wordInput.value.replace(/[\W_]+/g,"");
});

const submitWordBtn = document.getElementById("submitWord") as HTMLButtonElement;
submitWordBtn.addEventListener("click", submitWord);

const currentWordsTable = document.getElementById("currentWords") as HTMLTableElement;

let timeRemaining: number;


function startInGameWindow(data: any){
    wordDisplayDiv.innerText = data.word;

    let enterKeyUpdated = false;
    window.addEventListener("keydown", (e)=>{
        if(e.key === "Enter" && enterKeyUpdated === false){
            enterKeyUpdated = true;
            submitWord();
        }
    });
    window.addEventListener("keyup", (e)=>{
        if(e.key === "Enter"){
            enterKeyUpdated = false;
        }
    });

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


    socket.on("addWordError", (data)=>{
        console.log(data);
    })

    socket.on("wordResult", (data)=>{
        if(data.correct){
            wordInput.value = "";
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
    });

    socket.on("ended", (data)=>{
        inGameWindow.hidden = true;
        scoreWindow.hidden = false;
        startScoreWindow(data);
    });
}

function submitWord(){
    wordInput.focus();
    socket.emit("addWord", {word: wordInput.value});
}
