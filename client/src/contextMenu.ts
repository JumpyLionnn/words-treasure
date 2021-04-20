/*
const contextMenu = document.getElementById("contextMenu") as HTMLDivElement;


window.addEventListener('contextmenu', (e: MouseEvent) => { 
    contextMenu.style.display = "flex";
    contextMenu.style.top = e.y + "px";
    contextMenu.style.left = e.x + "px";
    e.preventDefault(); 
  }, false);

window.addEventListener("click", (e: MouseEvent)=>{
    if(e.target !== contextMenu){
        contextMenu.style.display = "none";
    }
});


const copyButton = document.getElementById("contextMenuCopyButton") as HTMLButtonElement;

copyButton.addEventListener("click", ()=>{
    document.execCommand("copy");
});


const pasteButton = document.getElementById("contextMenuPasteButton") as HTMLButtonElement;


pasteButton.addEventListener("click", ()=>{
    document.execCommand("paste");
});
*/