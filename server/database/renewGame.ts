async function renewGame(game: any){
    let word = await getRandomWord(game.difficulty);
        while(word === game.word){
            word = await getRandomWord(game.difficulty);
        }
        db.run("UPDATE games SET state = 'waiting', word = ? WHERE id = ?", [word, game.id]);
}