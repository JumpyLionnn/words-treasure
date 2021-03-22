async function addWordHandler(data: any, socket: any, db: any){
    let player = await db.get("SELECT * FROM players WHERE id = ?", socket.id);
    if(!player){
        socket.emit("addWordError", {message: "You are not in a game"});
        return;
    }
    let game = await db.get("SELECT * FROM games WHERE id = ?", [player.gameId]);

    if(game.state === "ended"){
        socket.emit("addWordError", {message: "The game already ended"});
        return;
    }

    // check if all of the player's word letters are inside the game word
    if(!checkMatchingWord(data.word, game.word)){
        socket.emit("wordResult", {
            correct: false,
            word: data.word,
            message: "The word's letters are not matching the given word's letters"
        });
        return;
    }

    let word = await db.get("SELECT * FROM words WHERE word = ?", data.word);
    if(!word){
        socket.emit("wordResult", {
            correct: false,
            word: data.word,
            message: "The word does not exists in the words stockpile"
        });
        return;
    }
    let wordDuplicate = await db.get("SELECT word FROM playersWords WHERE playerId = ? AND word = ?", [socket.id, data.word]);
    if(wordDuplicate){
        socket.emit("wordResult", {
            correct: false,
            word: data.word,
            message: "You already wrote this word"
        });
        return;
    }



    await db.run("INSERT INTO playersWords(playerId, word) VALUES (?, ?)", [socket.id, data.word]);
    //await db.run("UPDATE players SET numOfWords = ?", [player.numOfWords + 1]);
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


