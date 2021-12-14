async function playAgainHandler(data: any, socket: any) {
    const player = await getPlayerById(socket.id);
    if(!player){
        return socket.emit("error", {message: "You are not in a game."});
    }
    const game = await getGameById(player.gameId);

    
    if(game.state === "started"){
        return socket.emit("error", {message: "The game is active."});
    }

    const players = await getAllPlayersByGameId(game.id);
    let playerNames: string[] = [];
    for(let i = 0; i < players.length; i++){
        if(players[i].playAgain === 1){
            playerNames.push(players[i].name);
        }
    }

    if(player.id === game.host){
        if(game.state === "waiting"){
            return socket.emit("error", {message: "The game is in waiting room."});
        }
        markPlayerWithPlayAgain(player.id);

        renewGame(game);

        socket.emit("game-created", {
            code: game.code,
            maxPlayers: game.maxPlayers,
            difficulty: game.difficulty,
            duration: game.duration
        });
        for(let i = 0; i < playerNames.length; i++){
            if(playerNames[i] !== player.name){
                socket.emit("player-joined", {name: playerNames[i]});
            }
        }
        playerNames.push(player.name);
        io.to(game.id + "-playAgain").emit("joined-game", {
            players: playerNames,
            difficulty: game.difficulty,
            duration: game.duration,
            maxPlayers: game.maxPlayers,
            code: game.code,
            host: player.name
        });
    }
    else{
        if(players.length === game.maxPlayers){
            return socket.emit("error", {message: "Tha game is full."});
        }

        
        for(let i = 0; i < players.length; i++){
            if(players[i].name === player.name && player.playAgain === 1){
                return socket.emit("error", {message: "You can not play again with this name since there is already a player with the same name."});
            }
        }

        markPlayerWithPlayAgain(player.id);

        let host = await getPlayerById(game.host);

        if(host.playAgain === 1){
            io.to(game.id).emit("player-joined", {name: player.name});
            socket.join(game.id);
            playerNames.unshift(player.name);
            socket.emit("joined-game", {
                players: playerNames,
                difficulty: game.difficulty,
                duration: game.duration,
                maxPlayers: game.maxPlayers,
                code: game.code,
                host: host.name
            });
        }
        else{
            if(game.state === "waiting"){
                socket.emit("error", {message: "The game is in waiting room."});
                return;
            }   
            
            socket.join(game.id + "-playAgain");
            socket.emit("waiting-for-host", {message: "Waiting for the host..."});
        }   
    }
}