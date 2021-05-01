async function hostHandler(data: any, socket: any, db: any){

    let player = await db.get("SELECT * FROM players WHERE id = ?", [socket.id]);
    if(player){
        socket.emit("hostGameError", {message: "this client is already in a game."});
        return;
    }
    // getting data
    let name: string;
    if(typeof data.name === "string"){
        name = data.name.trim();
        if(name.length > 10 || name.length < 2){
            socket.emit("hostGameError", {message: "The name length is not in the range of 2 - 10."});
            return;
        }
        if(nameVefication.test(name)){
            socket.emit("hostGameError", {message: "The name must only have letters, digits or spaces."});
            return;
        }
    }
    else{
        socket.emit("hostGameError", {message: "The name is not a string."});
        return;
    }
    let diff: string;
    if(typeof data.diff === "string"){
        diff = data.diff;
        if(!(diff === "hard" || diff === "normal" || diff === "easy")){
            socket.emit("hostGameError", {message: "The difficulty is not hard normal or easy"});
            return;
        }
    }
    else{
        socket.emit("hostGameError", {message: "The difficulty is not a string"});
        return;
    }

    let maxPlayers: number;
    if(typeof data.maxPlayers === "number"){
        maxPlayers = data.maxPlayers;
        if(maxPlayers > 10 || maxPlayers < 2){
            socket.emit("hostGameError", {message: "The maxPlayers is not in range of 2 - 10"});
            return;
        }
    }
    else{
        socket.emit("hostGameError", {message: "The maxPlayer is not a number"});
        return;
    }

    let duration: number;
    if(typeof data.duration === "number"){
        duration = data.duration;
        if(duration > 10 || duration < 2){
            socket.emit("hostGameError", {message: "The duration is not in range of 2 - 10"});
            return;
        }
    }
    else{
        socket.emit("hostGameError", {message: "The duration is not a number"});
        return;
    }

    // gemerate a random game code
    let code = makeCode(5);
    let result = await db.get("SELECT * FROM games WHERE code = ?", [code]);
    while (result){
        let code = makeCode(5);
        let result = await db.get("SELECT * FROM games WHERE code = ?", [code]);
    }

    // choose a random word
    let word = await db.get("SELECT word FROM diff WHERE diff = ? ORDER BY RANDOM() LIMIT 1", [diff])


    await db.run(`INSERT INTO games(code, state, host, duration, diff, maxPlayers, word) VALUES
        (?, 'waiting', ?, ?, ?, ?, ?);`, [code, socket.id, duration, diff, maxPlayers, word.word]);

    let game = await db.get(`SELECT * FROM games WHERE code = ?`, [code]);

    socket.join(game.id);

    await db.run(`INSERT INTO players(id, gameId, name) VALUES (?, ?, ?)`, [socket.id, game.id, name])
    socket.emit("gameCreated", {
        code,
        maxPlayers,
        diff,
        duration
    });

}


function makeCode(length: number): string {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}