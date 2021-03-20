async function joinHandler(data: any, socket: any, db: any){
    let player = await db.get("SELECT * FROM players WHERE id = ?", [socket.id]);
    if(player){
        socket.emit("joinGameError", {message: "this client is already in a game"});
        return;
    }
    // getting data
    let name: string;
    if(typeof data.name === "string"){
        name = data.name;
        if(name.length > 10 || name.length < 2){
            socket.emit("joinGameError", {message: "The name length is not in the range of 2 - 10"});
            return;
        }
    }
    else{
        socket.emit("joinGameError", {message: "The name is not a string"});
        return;
    }
    let game: any;
    if(typeof data.code === "string"){
        let code = data.code;
        game = await db.get("SELECT * FROM games WHERE code = ?", [code]);
        if(!game){
            socket.emit("joinGameError", {message: "The game you tried to join does not exist"});
            return;
        }
    }

    if(game.state !== "waiting"){
        socket.emit("joinGameError", {message: "The game you tried to join already started"});
        return;
    }


    let players = await db.all("SELECT * FROM players WHERE gameId = ?", [game.id]);
    if(players.length === game.maxPlayers){
        socket.emit("joinGameError", {message: "The game you tried to join is full"});
        return;
    }
    let playerNames: string[] = [name];
    for(let i = 0; i < players.length; i++){
        if(players[i].name === name){
            socket.emit("joinGameError", {message: "The game you tried to join already has aplayer with the same name"});
            return;
        }
        playerNames.push(players[i].name);
    }

    db.run("INSERT INTO players(id, gameId, name, numOfWords) VALUES (? ,? ,? ,0)", [socket.id, game.id, name]);

    let host = await db.get("SELECT name FROM players WHERE id = ?", [game.host])

    io.to(game.id).emit("playerJoined", {name: name});
    socket.join(game.id);

    socket.emit("joinedGame", {
        players: playerNames,
        diff: game.diff,
        duration: game.duration,
        maxPlayers: game.maxPlayers,
        code: game.code,
        host: host.name
    });
}