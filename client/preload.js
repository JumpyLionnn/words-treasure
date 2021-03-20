const remote = require('electron');
let currWindow = remote.remote.BrowserWindow.getFocusedWindow();

window.close = function() {
    currWindow.close();
}