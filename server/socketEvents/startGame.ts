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
    let players = await db.all("SELECT * FROM Players WHERE gameId = ?", [game.id]);

    if(players.length === 1){
        socket.emit("startGameError", {message: "You can not start the game with only 1 player"});
        return;
    }

    db.run("UPDATE games SET state = 'started' WHERE host = ?", [socket.id]);

    db.run("UPDATE games SET startTime = ? WHERE host = ?", [Math.floor(Date.now() / 1000),socket.id]);

    setTimeout(()=>{
        endGame(game, db);
    }, (game.duration * 60 + timerOffset) * 1000);

    io.to(game.id).emit("gameStarted", {
        word: game.word,
        duration: game.duration
    });
}