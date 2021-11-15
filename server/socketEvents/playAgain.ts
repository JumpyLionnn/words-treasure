async function playAgainHandler(data: any, socket: any) {
    const player = await db.get("SELECT * FROM players WHERE id = ?", [socket.id]);
    if(!player){
        socket.emit("playAgainError", {message: "You are not in a game."});
        return;
    }
    const game = await db.get("SELECT * FROM games WHERE id = ?", [player.gameId]);

    const players = await db.all("SELECT * FROM players WHERE gameId = ?", [game.id]);
    let playerNames: string[] = [];
    for(let i = 0; i < players.length; i++){
        if(players[i].playAgain === 1){
            playerNames.push(players[i].name);
        }
        
    }

    if(game.state === "started"){
        socket.emit("playAgainError", {message: "The game is active."});
        return;
    }

    

    if(player.id === game.host){

        if(game.state === "waiting"){
            socket.emit("playAgainError", {message: "The game is in waiting state."});
            return;
        }
        db.run("UPDATE players SET playAgain = 1 WHERE id = ?", [player.id]);
        let word = await getRandomWord(game.diff as ("easy" | "normal" | "hard"));
        while(word === game.word){
            word = await getRandomWord(game.diff as ("easy" | "normal" | "hard"));
        }
        db.run("UPDATE games SET state = 'waiting', word = ? WHERE id = ?", [word, game.id]);
        socket.emit("gameCreated", {
            code: game.code,
            maxPlayers: game.maxPlayers,
            diff: game.diff,
            duration: game.duration
        });
        for(let i = 0; i < playerNames.length; i++){
            if(playerNames[i] !== player.name){
                socket.emit("playerJoined", {name: playerNames[i]});
            }
        }
        playerNames.push(player.name);
        io.to(game.id + "-playAgain").emit("joinedGame", {
            players: playerNames,
            diff: game.diff,
            duration: game.duration,
            maxPlayers: game.maxPlayers,
            code: game.code,
            host: player.name
        });
    }
    else{
        if(players.length === game.maxPlayers){
            socket.emit("playAgainError", {message: "Tha game is full."});
            return;
        }

        
        for(let i = 0; i < players.length; i++){
            if(players[i].name === player.name && player.playAgain === 1){
                socket.emit("playAgainError", {message: "You can not play again with this name since there is already a player with the same name."});
                return;
            }
        }

        db.run("UPDATE players SET playAgain = 1 WHERE id = ?", [player.id]);


        let host = await db.get("SELECT * FROM players WHERE id = ?", [game.host]);

        if(host.playAgain === 1){
            io.to(game.id).emit("playerJoined", {name: player.name});
            socket.join(game.id);
            playerNames.unshift(player.name);
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
            if(game.state === "waiting"){
                socket.emit("playAgainError", {message: "The game is in waiting state."});
                return;
            }   
            
            socket.join(game.id + "-playAgain");
            socket.emit("waitingForHost", {message: "Waiting for the host..."});
        }   
    }

}