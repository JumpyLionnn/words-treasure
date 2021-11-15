
const scoreTable = document.querySelector(".scoreTable tbody") as HTMLTableElement;


const waitingForHostToPlayAgainAlert = document.getElementById("waitingForHost") as HTMLDivElement;

const waitingForHostToPlayAgainText = document.getElementById("waitingForHostText") as HTMLParagraphElement;

const waitingForHostToPlayAgainCancelButton = document.getElementById("waitingForHostCancelButton") as HTMLButtonElement;
const waitingForHostToPlayAgainCloseButton = document.getElementById("waitingForHostCloseButton") as HTMLButtonElement;

let waitingForHostToPlayAgainTextInterval: NodeJS.Timer;              



function startScoreWindow(data: any){
    scoreTable.innerHTML = "";
    let scores = data.scores;
    for(let i = 0; i < scores.length; i++){
        const tr = document.createElement("tr");

        const placeTd = document.createElement("td");
        placeTd.innerText = (i + 1).toString();
        tr.appendChild(placeTd);

        const nameTd = document.createElement("td");
        if(scores[i].name === playerName){
            nameTd.innerText = scores[i].name + "(you)";
        }
        else{
            nameTd.innerText = scores[i].name;
        }
        
        tr.appendChild(nameTd);

        const scoreTd = document.createElement("td");
        scoreTd.innerText = scores[i].score;
        tr.appendChild(scoreTd);

        scoreTable.appendChild(tr);
    }
}


(document.getElementById("playAgainButton") as HTMLButtonElement).addEventListener("click", ()=>{
    socket.emit("playAgain", {});
});


socket.on("waitingForHost", (data: any)=>{
    waitingForHostToPlayAgainAlert.style.display = "flex";
    let dotCount = 0;
    waitingForHostToPlayAgainTextInterval = setInterval(()=>{
        dotCount++;
        if(dotCount === 4){
            dotCount = 0;
        }
        
        waitingForHostToPlayAgainText.innerText = "Waiting for the host" + ".".repeat(dotCount);
    }, 1000)
});

waitingForHostToPlayAgainCancelButton.addEventListener("click", ()=>{
    clearInterval(waitingForHostToPlayAgainTextInterval);
    waitingForHostToPlayAgainAlert.style.display = "none";
    socket.emit("leave", {});
});
waitingForHostToPlayAgainCloseButton.addEventListener("click", ()=>{
    clearInterval(waitingForHostToPlayAgainTextInterval);
    waitingForHostToPlayAgainAlert.style.display = "none";
    socket.emit("leave", {});
});



socket.on("playAgainError", (data: any)=>{
    displayAlert(data.message);
});