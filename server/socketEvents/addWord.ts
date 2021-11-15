async function addWordHandler(data: any, socket: any, db: any){
    let player = await db.get("SELECT * FROM players WHERE id = ?", [socket.id]);
    if(!player){
        socket.emit("addWordError", {message: "You are not in a game"});
        return;
    }
    let game = await db.get("SELECT * FROM games WHERE id = ?", [player.gameId]);

    if(game.state !== "started"){
        socket.emit("addWordError", {message: "The game is not active."});
        return;
    }
    
    let incorrectWordPrice = 0;
    if(game.diff === "easy"){
        incorrectWordPrice = 1;
    }
    if(game.diff === "normal"){
        incorrectWordPrice = 3;
    }
    else if(game.diff === "hard"){
        incorrectWordPrice = 4;
    }

    // check if all of the player's word letters are inside the game word
    if(!checkMatchingWord(data.word, game.word)){
        await db.run("UPDATE players SET points = points - ? WHERE id = ?", [incorrectWordPrice, socket.id]);
        socket.emit("wordResult", {
            correct: false,
            word: data.word,
            message: "The word's letters are not matching the given word's letters"
        });
        return;
    }

    let word = await db.get("SELECT * FROM words WHERE word = ?", data.word);
    if(!word){
        await db.run("UPDATE players SET points = points - ? WHERE id = ?", [incorrectWordPrice, socket.id]);
        socket.emit("wordResult", {
            correct: false,
            word: data.word,
            message: "The word does not exists in the words stockpile"
        });
        return;
    }
    let wordDuplicate = await db.get("SELECT word FROM playersWords WHERE playerId = ? AND word = ?", [socket.id, data.word]);
    if(wordDuplicate){
        await db.run("UPDATE players SET points = points - ? WHERE id = ?", [incorrectWordPrice, socket.id]);
        socket.emit("wordResult", {
            correct: false,
            word: data.word,
            message: "You already wrote this word"
        });
        return;
    }

    let wordCount = (await db.get("SELECT COUNT(*) AS count FROM playersWords WHERE word = ? AND gameId = ?", [data.word, game.id]))["count"];

    let wordPlacePoints = 0;
    if(wordCount === 0){
        wordPlacePoints = 5;
    }
    else if(wordCount === 1){
        wordPlacePoints = 3;
    }
    else if(wordCount === 2){
        wordPlacePoints = 1;
    }
    
    await db.run("UPDATE players SET points = points + ? WHERE id = ?", [wordPlacePoints, socket.id]);

    await db.run("INSERT INTO playersWords(playerId, gameId, word) VALUES (?, ?, ?)", [socket.id, game.id, data.word]);
    
    socket.emit("wordResult", {
        correct: true,
        word: data.word
    });
}

function checkMatchingWord(word: string, matchingWord: string): boolean{
    let remainingLetters = matchingWord.split("");
    for(let i = 0; i < word.length; i++){
        if(remainingLetters.includes(word[i])){
            remainingLetters.splice(remainingLetters.indexOf(word[i]), 1);
        }
        else{
            return false;
        }
    }
    return true;
}


