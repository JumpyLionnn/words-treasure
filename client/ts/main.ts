const remote = require('electron').remote;

//windows
const mainMenuWindow = document.querySelector("div.mainMenu") as HTMLDivElement;

const howToPlayWindow = document.querySelector("div.howToPlay") as HTMLDivElement;

const hostGameWindow = document.querySelector("div.hostGame") as HTMLDivElement;

const joinGameWindow = document.querySelector("div.joinGame") as HTMLDivElement;

const waitingRoomWindow = document.querySelector("div.waitingRoom") as HTMLDivElement;

const inGameWindow = document.querySelector("div.inGame") as HTMLDivElement;

const scoreWindow = document.querySelector("div.score") as HTMLDivElement;





let socket: Socket = io.connect("http://192.168.100.20:3300/");
let playerName: string;

