async function getPlayersNamesThatPlayedAgain(gameId: number): Promise<string[]>{
    const players = await getAllPlayersByGameId(gameId);
    let playerNames: string[] = [];
    for(let i = 0; i < players.length; i++){
        if(players[i].playAgain === 1){
            playerNames.push(players[i].name);
        }
    }
    return playerNames;
}