/// <reference path="./modules/random.ts"/>

const backgroundDiv = document.getElementById("background") as HTMLDivElement;

function generateBackground(){
    backgroundDiv.style.backgroundColor = Random.choice(backgroundData.backgroundColors);
    backgroundDiv.innerHTML = "";

    const screenWidth = backgroundDiv.clientWidth;
    const screenHeight = backgroundDiv.clientHeight;
    for (let i = 0; i < backgroundData.lettersNumber; i++){
        const letterDiv = document.createElement("div");
        letterDiv.innerText = backgroundData.letters.charAt(Random.randint(backgroundData.letters.length));
        letterDiv.style.transform = `rotateZ(${Random.randint(0,360)}deg)`;

        let posX = Random.randint(screenWidth);
        let posY = Random.randint(screenHeight);
        

        letterDiv.style.top = `${posY}px`;
        letterDiv.style.left = `${posX}px`;

        letterDiv.style.fontSize = `${Random.randfloat(backgroundData.letterSizes.max, backgroundData.letterSizes.min)}em`

        letterDiv.style.color = Random.choice(backgroundData.letterColors);

        letterDiv.classList.add("letter");
        backgroundDiv.appendChild(letterDiv);
    }
}

function distance(x1: number, y1: number, x2: number, y2: number): number{
    return Math.abs(Math.sqrt(x1 * x1 + y1 * y1) - Math.sqrt(x2 * x2 + y2 * y2));
}

window.addEventListener("resize", generateBackground);



const backgroundData = {
    backgroundColors: [
        "#50cdfa",
    ],
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
    lettersNumber: 200,
    letters: "abcdefghijklmnopqrstuvwzyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
}