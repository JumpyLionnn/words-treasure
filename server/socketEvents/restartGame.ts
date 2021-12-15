async function restartGame(game: any, host: any){
    let playerNames = await getPlayersNamesThatPlayedAgain(game.id);

    let socket = io.sockets.sockets.get(host.id);
    if(game.state === "waiting"){
        return socket.emit("error", {message: "The game is in waiting room."});
    }
    markPlayerWithPlayAgain(host.id);

    renewGame(game);

    socket.emit("game-created", {
        code: game.code,
        maxPlayers: game.maxPlayers,
        difficulty: game.difficulty,
        duration: game.duration
    });
    for(let i = 0; i < playerNames.length; i++){
        if(playerNames[i] !== host.name){
            socket.emit("player-joined", {name: playerNames[i]});
        }
    }
    playerNames.push(host.name);
    socket.leave(game.id + "-playAgain");
    io.to(game.id + "-playAgain").emit("joined-game", {
        players: playerNames,
        difficulty: game.difficulty,
        duration: game.duration,
        maxPlayers: game.maxPlayers,
        code: game.code,
        host: host.name
    });
}