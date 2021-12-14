async function addWordHandler(data: any, socket: any){
    let player = await getPlayerById(socket.id);
    if(!player){
        return socket.emit("error", {message: "You are not in a game"});
    }
    let game = await getGameById(player.gameId);

    if(game.state !== "started"){
        return socket.emit("error", {message: "The game is not active."});
    }

    // check if all of the player's word letters are inside the game word
    if(!checkMatchingWord(data.word, game.word)){
        setPlayerPoints(player.id, player.points - gameScoring.incorrectWordPrice[game.difficulty]);
        return socket.emit("word-result", {
            correct: false,
            word: data.word,
            message: "The word's letters are not matching the given word's letters"
        });
    }

    if(!(await doesWordExist(data.word))){
        setPlayerPoints(player.id, player.points - gameScoring.incorrectWordPrice[game.difficulty]);
        return socket.emit("word-result", {
            correct: false,
            word: data.word,
            message: "The word does not exists in the words stockpile"
        });
    }

    if(await isDuplicateWord(data.word, player.id)){
        setPlayerPoints(player.id, player.points - gameScoring.incorrectWordPrice[game.difficulty]);
        return socket.emit("word-result", {
            correct: false,
            word: data.word,
            message: "You already wrote this word"
        });
    }

    setPlayerPoints(player.id, player.points + gameScoring.wordPlacePoints[(await countWords(data.word, player.gameId) + 1).toString()]);

    addWordToPlayer(socket.id, game.id, data.word);
    
    socket.emit("word-result", {
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


