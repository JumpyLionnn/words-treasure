async function getRandomWord(difficulty: "easy" | "normal" | "hard"): Promise<string>{
    return (await db.get("SELECT word FROM words WHERE MatchingWords > ? AND MatchingWords < ? ORDER BY RANDOM() LIMIT 1", [difficulties[difficulty].min, difficulties[difficulty].max])).word;
}