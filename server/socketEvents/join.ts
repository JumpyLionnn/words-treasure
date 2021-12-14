async function joinHandler(data: any, socket: any){
    if(await isThePlayerInAGame(socket.id)){
        socket.emit("error", {message: "this client is already in a game"});
        return;
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
    let game: any;
    if(typeof data.code === "string"){
        let code = data.code;
        game = await getGameByCode(code);
        if(!game){
            return socket.emit("error", {message: "The game you tried to join does not exist."});
        }
    }

    if(game.state !== "waiting"){
        socket.emit("error", {message: "The game you tried to join already started."});
        return;
    }


    let players = await getAllPlayersByGameId(game.id);
    if(players.length === game.maxPlayers){
        socket.emit("error", {message: "The game you tried to join is full"});
        return;
    }
    let playerNames: string[] = [name];
    for(let i = 0; i < players.length; i++){
        if(players[i].name === name){
            socket.emit("error", {message: "The game you tried to join already has a player with the same name"});
            return;
        }
        playerNames.push(players[i].name);
    }

    addPlayerToDatabase(socket.id, game.id, name);

    io.to(game.id).emit("player-joined", {name});
    socket.join(game.id);
    socket.emit("joined-game", {
        players: playerNames,
        difficulty: game.difficulty,
        duration: game.duration,
        maxPlayers: game.maxPlayers,
        code: game.code,
        host: (await getPlayerById(game.host)).name
    });
}