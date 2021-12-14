const alertScreen = document.getElementById("alert") as HTMLDivElement;
alertScreen.addEventListener("click", (e)=>{    
    if(e.target === alertScreen){
        alertScreen.style.display = "none";
        if(alertCallback){
            alertCallback("no");
        }
    }
    
});

const dialogAlert = document.getElementById("dialog-alert") as HTMLDivElement;

const alertText = document.getElementById("alert-text") as HTMLParagraphElement;

(document.getElementById("alert-close-button") as HTMLButtonElement).addEventListener("click", ()=>{
    alertScreen.style.display = "none";
    if(alertCallback){
        alertCallback("no");
    }
});

const alertOkButton = document.getElementById("alert-ok-button") as HTMLButtonElement;
alertOkButton.addEventListener("click", ()=>{
    alertScreen.style.display = "none";
});



(document.getElementById("alert-no-button") as HTMLButtonElement).addEventListener("click", ()=>{
    alertScreen.style.display = "none";
    if(alertCallback){
        alertCallback("no");
    }
});

(document.getElementById("alert-yes-button") as HTMLButtonElement).addEventListener("click", ()=>{
    alertScreen.style.display = "none";
    if(alertCallback){
        alertCallback("yes");
    }
});

enum AlertType {
    confirmition,
    dialog
}

let alertCallback: (result: string)=>void;

function displayAlert(alertMessage: string, alertType: AlertType = AlertType.confirmition, callback?:(result: string)=>void){
    if(alertType === AlertType.confirmition){
        alertOkButton.hidden = false;

        dialogAlert.hidden = true;
    }
    else if(alertType === AlertType.dialog){
        alertOkButton.hidden = true;

        dialogAlert.hidden = false;
    }
    if(callback){
        alertCallback = callback;
    }
    alertText.innerText = alertMessage;
    alertScreen.style.display = "flex";
}