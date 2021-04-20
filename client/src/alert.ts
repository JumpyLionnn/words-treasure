const alertScreen = document.getElementById("alert") as HTMLDivElement;

alertScreen.addEventListener("click", (e)=>{    
    if(e.target === alertScreen){
        alertScreen.style.display = "none";
        if(alertCallback){
            alertCallback("no");
        }
    }
    
});

const alertText = document.getElementById("alertText") as HTMLParagraphElement;

const alertCloseNutton = document.getElementById("alertCloseButton") as HTMLButtonElement;

alertCloseNutton.addEventListener("click", ()=>{
    alertScreen.style.display = "none";
    if(alertCallback){
        alertCallback("no");
    }
});

const alertOkButton = document.getElementById("alertOkButton") as HTMLButtonElement;

alertOkButton.addEventListener("click", ()=>{
    alertScreen.style.display = "none";
});

const yesnoAlert = document.getElementById("yesnoAlert") as HTMLDivElement;

const alertNoButton = document.getElementById("alertNoButton") as HTMLButtonElement;

alertNoButton.addEventListener("click", ()=>{
    alertScreen.style.display = "none";
    if(alertCallback){
        alertCallback("no");
    }
});

const alertYesButton = document.getElementById("alertYesButton") as HTMLButtonElement;

alertYesButton.addEventListener("click", ()=>{
    alertScreen.style.display = "none";
    if(alertCallback){
        alertCallback("yes");
    }
});

let alertCallback: (result: string)=>void;

function displayAlert(alertMessage: string, alertType: string = "normal", callback?:(result: string)=>void){
    if(alertType === "normal"){
        alertOkButton.hidden = false;

        yesnoAlert.hidden = true;
    }
    else if(alertType === "yesno"){
        alertOkButton.hidden = true;

        yesnoAlert.hidden = false;
    }
    if(callback){
        alertCallback = callback;
    }
    alertText.innerText = alertMessage;
    alertScreen.style.display = "flex";
}