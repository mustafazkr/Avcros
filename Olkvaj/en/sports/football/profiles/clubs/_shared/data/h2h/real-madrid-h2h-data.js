/* ============================================================
   OLKVAJ — Head-to-Head data: Real Madrid
   Location: sports/football/profiles/clubs/_shared/data/h2h/real-madrid-h2h-data.js

   Fixtures in `recent[]` are lightweight references. Full match
   data lives in: _shared/data/matches/<comp>/<season>.js

   ID format: <YYYY><MM><NNNNNN>
     YYYY   = 4-digit year
     MM     = 2-digit month
     NNNNNN = 6-digit sequence within that month
   ============================================================ */

   window.__H2H_DATA__ = {
    "self": {
      "name": "Real Madrid",
      "logoSlug": "real-madrid",
      "sub": "La Liga · Spain"
    },
  
    "opponents": [
  
      {
        "key": "milan",
        "name": "AC Milan",
        "logoSlug": "ac-milan",
        "flag": "italy",
        "country": "italy",
        "countryName": "Italy",
        "sub": "Serie A · Italy",
  
        "matches": 1,
        "wins": 0,
        "draws": 0,
        "losses": 1,
        "goalsFor": 1,
        "goalsAgainst": 3,
        "homeWinPct": 0,
        "awayWinPct": 0,
        "streak": "L1",
        "streakDesc": "Last match lost",
        "biggestWin": "—",
        "biggestWinDesc": "No wins recorded",
        "biggestLoss": "1–3",
        "biggestLossDesc": "2024 · Champions League",
        "topScorer": "Vinícius Jr. (1)",
        "topScorerDesc": "Real Madrid",
        "longest": "—",
        "longestDesc": "No winning streak",
  
        "recent": [
          {
            "id": "202411000001",
            "file": "ucl/2024-25",
            "date": "2024-11-05",
            "season": "2024–25",
            "comp": "ucl",
            "compLabel": "Champions League",
            "home": true,
            "score": "1–3",
            "outcome": "loss"
          }
        ]
      }
  
    ]
  };