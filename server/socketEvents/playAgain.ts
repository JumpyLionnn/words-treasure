async function playAgainHandler(data: any, socket: any, db: any) {
    const player = await db.get("SELECT * FROM players WHERE id = ?", [socket.id]);
    if(!player){
        socket.emit("playAgainError", {message: "The player does not exist."});
        return;
    }
    const game = await db.get("SELECT * FROM games WHERE id = ?", [player.gameId]);

    const players = await db.all("SELECT * FROM players WHERE gameId = ?", [game.id]);
    let playerNames: string[] = [];
    for(let i = 0; i < players.length; i++){
        playerNames.push(players[i].name);
    }

    if(game.state === "started"){
        socket.emit("playAgainError", {message: "The game is active."});
        return;
    }

    if(game.state === "ended"){
        db.run("UPDATE games SET state = 'waiting' WHERE id = ?", [game.id]);
    }

    if(player.id === game.host){
        socket.emit("gameCreated", {
            code: game.code,
            maxPlayers: game.maxPlayers,
            diff: game.diff,
            duration: game.duration
        });
        // emit to every socket that wanted to play again and in the game exept the host
        for(let i = 0; i < players.length; i++){
            if(players[i].playAgain === 1 && players[i].id !== game.host){
                io.to(players[i].id).emit("joinedGame", {
                    players: playerNames,
                    diff: game.diff,
                    duration: game.duration,
                    maxPlayers: game.maxPlayers,
                    code: game.code,
                    host: player.name
                });
            }
        }
        
    }
    else{
        if(players.length < game.maxPlayers){
            socket.emit("playAgainError", {message: "Tha game is full."});
            return;
        }

        
        for(let i = 0; i < players.length; i++){
            if(players[i].name === player.name && player.playAgain === 1){
                socket.emit("playAgainError", {message: "You can not play again with this name since there is already a player with the same name."});
                return;
            }
        }


        let host = await db.get("SELECT * FROM players WHERE id = ?", [game.host]);

        if(host.playAgain === 1){
            socket.emit("joinedGame", {
                players: playerNames,
                diff: game.diff,
                duration: game.duration,
                maxPlayers: game.maxPlayers,
                code: game.code,
                host: host.name
            });
        }
        else{
            socket.emit("waitingForHost", {message: "Waiting for the host..."});
        }   
    }

}