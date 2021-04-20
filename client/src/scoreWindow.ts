
const scoreTable = document.querySelector(".scoreTable tbody") as HTMLTableElement;




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