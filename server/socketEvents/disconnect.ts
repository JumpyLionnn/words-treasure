async function disconnect(socket: any) {
    let player = await getPlayerById(socket.id);
    if(player){ 
        await deletePlayer(player.id);
        socket.leave(player.gameId);
        socket.leave(player.gameId + "-playAgain");
        let game = await getGameById(player.gameId);
        let players = await getAllPlayersByGameId(game.id);
        if(players.length === 0){
            deleteGameById(game.id);
        }
        else if(players.length === 1 && game.state === "started"){
            let lastPlayerSocket = io.sockets.sockets.get(players[0].id);
            lastPlayerSocket.emit("server-disconnect", {message: "You disconnected since all of the players left the game."});
            disconnect(lastPlayerSocket);
        }
        else{
            if(game.host === socket.id){
                let newHostId = players[0].id;
                let newHost = await getPlayerById(newHostId);
                setNewHost(game.id, newHostId);
                if(game.state === "ended"){
                    if(newHost.playAgain === 1){
                        await removePlayAgainMark(newHost.id);
                        await restartGame(game, newHost);
                    }
                }
            }
            io.to(player.gameId).emit("player-left", {name: player.name, host: players[0].name});
        }
    }
    
}