async function hostHandler(data: any, socket: any){
    if(await isThePlayerInAGame(socket.id)){
        return socket.emit("error", {message: "this client is already in a game."});
    }
    // getting data
    let name: string;
    if(typeof data.name === "string"){
        name = data.name.trim();
        if(name.length > 10 || name.length < 2){
            return socket.emit("error", {message: "The name length is not in the range of 2 - 10."});
        }
        if(nameVefication.test(name)){
            return socket.emit("error", {message: "The name must only have letters, digits or spaces."});
        }
    }
    else{
        return socket.emit("error", {message: "The name is not a string."});
    }
    
    let difficulty = data.difficulty;
    if(!(difficulty === "hard" || difficulty === "normal" || difficulty === "easy")){
        return socket.emit("error", {message: "The difficulty is not hard normal or easy"});
    }
    
    let maxPlayers: number;
    if(typeof data.maxPlayers === "number"){
        maxPlayers = data.maxPlayers;
        if((maxPlayers > 30 || maxPlayers < 2) && isInt(maxPlayers)){
            return socket.emit("error", {message: "The maxPlayers is not in range of 2 - 30"});
        }
    }
    else{
        return socket.emit("error", {message: "The maxPlayer is not a number"});
    }

    let duration: number;
    if(typeof data.duration === "number"){
        duration = data.duration;
        if((duration > 10 || duration < 2) && isInt(maxPlayers)){
            return socket.emit("error", {message: "The duration is not in range of 2 - 10"});
        }
    }
    else{
        return socket.emit("error", {message: "The duration is not a number"});
    }

    // gemerate a random game code
    let code = makeCode(5);
    while (!(await isGameCodeUnique(code))){
        code = makeCode(5);
    }

    // choose a random word
    let word = await getRandomWord(difficulty);

    await addGameToDatabase(code, socket.id, duration, difficulty, maxPlayers, word);
    
    let game = await getGameByCode(code);

    socket.join(game.id);

    addPlayerToDatabase(socket.id, game.id, name);
    socket.emit("game-created", {
        code,
        maxPlayers,
        difficulty,
        duration
    });
}


function makeCode(length: number): string {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}