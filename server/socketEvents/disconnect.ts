async function disconnect(socket: any, db: any) {
    let player = await db.get("SELECT * FROM players WHERE id = ?", [socket.id]);
    if(player){
        await db.run("DELETE FROM playersWords WHERE playerId = ?", [socket.id]);
        await db.run("DELETE FROM players WHERE id = ?", [socket.id]);
        if(io.sockets.sockets[socket.id]){
            io.sockets.sockets[socket.id].leave(player.gameId);
            io.sockets.sockets[socket.id].leave(player.gameId + "-playAgain");
        }

        let players = await db.all("SELECT * FROM players WHERE gameId = ?", [player.gameId]);
        if(players.length === 0){
            await db.run("DELETE FROM games WHERE id = ?", [player.gameId]);
        }
        else{
            let game = await db.get("SELECT * FROM games WHERE id = ?", [player.gameId]);
            if(game.host === socket.id){
                let newHost = players[0].id;
                await db.run("UPDATE games SET host = ? WHERE id = ?", [newHost, game.id]);
                if(game.state === "ended"){
                    db.run("UPDATE games SET state = 'waiting' WHERE id = ?", [game.id]);
                        let hostSocket = getSocket(newHost);
                        hostSocket.emit("gameCreated", {
                            code: game.code,
                        maxPlayers: game.maxPlayers,
                        diff: game.diff,
                        duration: game.duration
                    });
                    hostSocket.leave(game.id + "-playAgain");
                    let playerNames: string[] = [];
                    for(let i = 0; i < players.length; i++){
                        if(players[i].playAgain === 1 && !players[i].id === newHost){
                            playerNames.push(players[i].name);
                            hostSocket.emit("playerJoined", {name: players[i].name});
                        } 
                    }

                    io.to(game.id + "-playAgain").emit("joinedGame", {
                        players: playerNames,
                        diff: game.diff,
                        duration: game.duration,
                        maxPlayers: game.maxPlayers,
                        code: game.code,
                        host: player.name
                    });
                }
            }
            io.to(player.gameId).emit("playerLeft", {name: player.name, host: players[0].name});
        }
    }
    
}