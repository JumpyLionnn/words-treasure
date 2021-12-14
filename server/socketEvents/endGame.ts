async function endGame(game: any) {
    let players = await getAllPlayersByGameId(game.id);

    let results: {scores: Player[]} = {scores: []};

    //calculating score
    let words: {[player: string]: {words: string[], name: string, points: number}} = {};
    for(let i = 0; i < players.length; i++){
        words[players[i].id] = {words: [], name: players[i].name, points: players[i].points};
        let playerWords = await getAllPlayersWords(players[i].id);
        for(let j = 0; j < playerWords.length; j++){
            words[players[i].id].words.push(playerWords[j].word);
        }
    }
    for(let player in words){
        let points = words[player].points;
        for(let i = 0; i < words[player].words.length; i++){
            let unique = true;
            for(let otherPlayer in words){
                if(player === otherPlayer) continue;
                if(!unique) break;
                for(let j = 0; j < words[otherPlayer].words.length; j++){
                    if(words[otherPlayer].words[j] === words[player].words[i]){
                        unique = false;
                        break;
                    }
                }
            }
            points += gameScoring.base;    
            if(unique){
                points += gameScoring.uniqueBonus;
            }
        }
        
        results.scores.push({
            name: words[player].name,
            score: points
        }); 
    }
    
    results.scores.sort((a,b)=>{
        return b.score - a.score;
    });

    setGameState(game.id, "ended");

    deleteGamesWords(game.id);

    io.to(game.id).emit("ended", results);
}

interface Player{
    name: string,
    score: number
}