/* 
const contextMenu = document.getElementById("contextMenu") as HTMLDivElement;


window.addEventListener('contextmenu', (e: MouseEvent) => {
    if(focusedInput){
        contextMenu.style.display = "flex";
        contextMenu.style.top = e.y + "px";
        contextMenu.style.left = e.x + "px";
    }
    else{
        contextMenu.style.display = "none";
    }
    
    e.preventDefault(); 
  }, false);

window.addEventListener("click", (e: MouseEvent)=>{
    if(e.target !== contextMenu){
        contextMenu.style.display = "none";
    }
});


const copyButton = document.getElementById("contextMenuCopyButton") as HTMLButtonElement;

copyButton.addEventListener("click", ()=>{
    console.log("copy button pressed");
    document.execCommand("copy");
});


const pasteButton = document.getElementById("contextMenuPasteButton") as HTMLButtonElement;


pasteButton.addEventListener("click", ()=>{
    console.log("paste button pressed");
    pasteButton.blur();
    focusedInput?.focus();
    navigator.clipboard.readText()
    .then(text => {
        console.log('Pasted content: ', text);
    })
    .catch(err => {
        console.error('Failed to read clipboard contents: ', err);
    });
    document.execCommand("paste", true);
    focusedInput?.blur();
});


let focusedInput: HTMLInputElement | null = null;


document.querySelectorAll("input").forEach((input: HTMLInputElement)=>{
    if(!input.classList.contains("wordInput") && !input.readOnly){
        input.addEventListener("focus", ()=>{
            console.log("focus");   
            focusedInput = input;    
        });
        input.addEventListener("blur", ()=>{
            console.log("blur");
            setTimeout(()=>{
                console.log("blur delay")
                if(input === focusedInput){
                    console.log("blured");
                    focusedInput = null; 
                }
                
            }, 100);
        });
    }
});


*/