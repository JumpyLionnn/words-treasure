async function startGameHandler(data: any, socket: any, db: any){
    let game = await db.get("SELECT * FROM games WHERE host = ?", [socket.id]);
    if(!game){
        socket.emit("startGameError", {message: "You are not host in a game"});
        return;
    }
    if(game.state !== "waiting"){
        socket.emit("startGameError", {message: "The game already started"});
        return;
    }
    let gameId = game.id;
    let players = await db.all("SELECT * FROM Players WHERE gameId = ?", [game.id]);

    if(players.length === 1){
        socket.emit("startGameError", {message: "You can not start the game with only 1 player"});
        return;
    }

    db.run("UPDATE games SET state = 'started' WHERE host = ?", [socket.id]);

    db.run("UPDATE games SET startTime = ? WHERE host = ?", [Math.floor(Date.now() / 1000),socket.id]);
    setTimeout( async ()=>{
        let game = await db.get("SELECT * FROM games WHERE id = ?", [gameId]);
        endGame(game, db);
    }, (game.duration * 60 + timerOffset) * 1000);

    let notAgainPlayers = await db.all("SELECT id FROM players WHERE  gameId = ? AND playAgain = 0", [gameId]);
    for(let i = 0; i < notAgainPlayers.length; i++){
        getSocket(notAgainPlayers[i].id)?.leave(game.id);
    }

    await db.run("DELETE FROM players WHERE gameId = ? AND playAgain = 0", [gameId]);

    await db.run("UPDATE players SET playAgain = 0 WHERE gameId = ?", [gameId]);

    io.to(game.id).emit("gameStarted", {
        word: game.word,
        duration: game.duration
    });
}