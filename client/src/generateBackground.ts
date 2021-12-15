/// <reference path="utilities.ts" />

const backgroundDiv = document.getElementById("background") as HTMLDivElement;

function generateBackground(){
    console.time("background");
    backgroundDiv.innerHTML = "";
    const width = backgroundDiv.clientWidth;
    const height = backgroundDiv.clientHeight;

    for (let i = 0; i < (width * height / backgroundData.spaceForLetter); i++){
        const letterDiv = document.createElement("div");
        letterDiv.innerText = backgroundData.letters.charAt(Random.randint(backgroundData.letters.length));
        letterDiv.style.transform = `rotateZ(${Random.randint(0,360)}deg)`;

        let posX = Random.randint(width);
        let posY = Random.randint(height);
        

        letterDiv.style.top = `${posY}px`;
        letterDiv.style.left = `${posX}px`;

        letterDiv.style.fontSize = `${Random.randfloat(backgroundData.letterSizes.max, backgroundData.letterSizes.min)}em`

        letterDiv.style.color = Random.choice(backgroundData.letterColors); 

        letterDiv.classList.add("letter");
        backgroundDiv.appendChild(letterDiv);
    }
    console.timeEnd("background");
}

window.addEventListener("resize", generateBackground);



const backgroundData = {
    letterColors: [
        "#DBFCFF",
        "#A6CFD5",
        "#7F96FF",
        "#E56399",
        "#BF98A0",
        "#84DCCF",
        "#DDFC74",
        "#D3F9B5",
        "#BF6900",
        "#9BDEAC",
        "#59A96A",
        "#B4E7CE",
        "#23CE6B",
        "#D81E5B",
        "#CC5803",
        "#E2711D",
        "#FFC971",
        "#FFB627",
        "#FF9505"
    ],
    letterSizes: {
        min: 2,
        max: 4
    },
    spaceForLetter: 9000,
    letters: "abcdefghijklmnopqrstuvwzyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
}