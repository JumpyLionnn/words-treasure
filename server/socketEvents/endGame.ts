async function endGame(game: any, db: any) {

    let players = await db.all("SELECT * FROM players WHERE gameId = ?", game.id);
    

    let results: {scores: Player[]} = {scores: []};

    //calculating score

    let words: {[player: string]: {words: string[], name: string, points: number}} = {};
    for(let i = 0; i < players.length; i++){
        words[players[i].id] = {words: [], name: players[i].name, points: players[i].points};
        let playerWords = await db.all("SELECT word FROM playersWords WHERE playerId = ?",[players[i].id]);
        for(let j = 0; j < playerWords.length; j++){
            words[players[i].id].words.push(playerWords[j].word);
        }
    }
    for(let player in words){
        let points = words[player].points;
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
    });

    await db.run("UPDATE games SET state = 'ended' WHERE id = ?",[game.id]);

    for(let i = 0; i < players.length; i++){
        db.run("DELETE FROM playersWords WHERE playerId = ?", [players[i].id]);
    }

    io.to(game.id).emit("ended", results);
}

interface Player{
    name: string,
    score: number
}