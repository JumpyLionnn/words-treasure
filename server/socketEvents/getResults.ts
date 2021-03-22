async function endGame(game: any, db: any) {

    let players = await db.all(" SELECT * FROM players WHERE gameId = ?", game.id);

    let results: {scores: Player[]} = {scores: []};

    //calculating score

    let words: {[player: string]: {words: string[], name: string}} = {};
    for(let i = 0; i < players.length; i++){
        words[players[i].id] = {words: [], name: players[i].name};
        let playerWords = await db.all("SELECT word FROM playersWords WHERE playerId = ?",[players[i].id]);
        for(let j = 0; j < playerWords.length; j++){
            words[players[i].id].words.push(playerWords[j].word);
        }
    }
    for(let player in words){
        let points = 0;
        for(let i = 0; i < words[player].words.length; i++){
            let unique = true;
            for(let otherPlayer in words){
                if(player === otherPlayer){continue;}
                for(let j = 0; j < words[otherPlayer].words.length; j++){
                    if(words[otherPlayer].words[j] === words[player].words[i]){
                        unique = false;
                        break;
                    }
                }
            }
            if(unique){
                points += 10;
            }
            else{
                points += 5;    
            }
        }

        results.scores.push({
            name: words[player].name,
            score: points
        });
    }
    
    results.scores.sort((a,b)=>{
        return b.score - a.score;
    })

    io.to(game.id).emit("ended", results);
    for(let player in words){
        disconnect(player, db);
    }
}

interface Player{
    name: string,
    score: number
}