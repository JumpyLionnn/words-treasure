async function startGameHandler(data: any, socket: any){
    let game = await getGameByHostId(socket.id);
    if(!game){
        return socket.emit("error", {message: "You are not host in a game"});
    }
    if(game.state !== "waiting"){
        return socket.emit("error", {message: "The game already started"});
    }
    
    let players = await getAllPlayersByGameId(game.id);

    if(players.length === 1){
        return socket.emit("error", {message: "You can not start the game with only 1 player"});
    }

    setGameAsStarted(game.id);

    setTimeout( async ()=>{
        endGame(game);
    }, (game.duration * 60 + timerOffset) * 1000);

    let notAgainPlayers = await deleteAllPlayersThatDidNotPlayAgainByGameId(game.id);
    for(let i = 0; i < notAgainPlayers.length; i++){
        io.sockets.sockets.get(notAgainPlayers[i].id).leave(game.id);
    }

    resetPlayersPlayAgainIndicatorByGameId(game.id);

    io.to(game.id).emit("game-started", {
        word: game.word,
        duration: game.duration
    });
}