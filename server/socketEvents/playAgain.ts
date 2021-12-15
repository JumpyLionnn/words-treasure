async function playAgainHandler(data: any, socket: any) {
    const player = await getPlayerById(socket.id);
    if(!player){
        return socket.emit("error", {message: "You are not in a game."});
    }
    const game = await getGameById(player.gameId);

    
    if(game.state === "started"){
        return socket.emit("error", {message: "The game is active."});
    }

    
    if(player.id === game.host){
        await restartGame(game, player);
    }
    else{
        let playerNames = await getPlayersNamesThatPlayedAgain(game.id);

        if(playerNames.length === game.maxPlayers){
            return socket.emit("error", {message: "Tha game is full."});
        }

        
        for(let i = 0; i < playerNames.length; i++){
            if(playerNames[i] === player.name && player.playAgain === 1){
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