APIs

### User APIs

1. [GET] /apis/user/all - List of all users
2. [GET] /apis/user/active - List of active users
3. [GET] /apis/user/activate/:user/:code - Activate User [user - userId, code - activationCode]
4. [POST] /apis/user/activate - Activate User [admin only]
5. [POST] /apis/user/deactivate - Deactivate User [admin only]
6. [GET] /apis/user/balance/:days - Get balance of last ':days' days on per day basis

### Team APIs

1. [GET] /apis/team/all - List of all teams ???????? NEED OF PLAYERS => Can be found via Player APIs ????????
2. [GET] /apis/team/match/:matchId - List of teams involved in a match [matchId - ObjectId of match]
3. [GET] /apis/team/:team - Details of specific team [team - Team Short Name (all caps)] ???????? NEED OF PLAYERS ????????

### Player APIs

1. [GET] /apis/player/all - List of all players
2. [GET] /apis/player/team/:team - List of players in a team [team - Team Short Name (all caps)]
3. [GET] /apis/player/match/:matchId - List of players in a match [matchId - ObjectId of match]

### Match APIs

1. [GET] /apis/match/all - List of all matches
2. [GET] /apis/match/undeclared - List of undeclared matches

### Pot APIs

1. [GET] /apis/pot/all - List of all pots
2. [GET] /apis/pot/open - List of open pots (open for betting)
3. [GET] /apis/pot/closed - List of closed pots
4. [GET] /apis/pot/match/:matchId - List of all pots for a match [matchId - ObjectId of match]
5. [POST] /apis/pot/add - Add new pot

### Bet APIs

1. [GET] /apis/bet/all - List of all bets [admin only]
2. [GET] /apis/bet/pot/:potId - List of all bets for a pot [admin only, potId - ObjectId of pot]
3. [GET] /apis/bet/user - List of all bets placed by session user [user only]
4. [POST] /apis/bet/place - Place a new bet [active user only]

### Balance Related APIs

1. [POST] /apis/balance/update/all - Update all players' balance by an amount [admin only]
2. [POST] /apis/balance/update/user/:user - Update single player's balance by an amount [admin only]
3. [POST] /apis/balance/transfer - Transfer funds [active user only]

### IPL 2017 APIs

1. [GET] /ipl/standings - Group Standings of the teams
2. [GET] /ipl/most-runs - List of players in descending order of Most Runs Scored
3. [GET] /ipl/most-sixes - List of players in descending order of Most Sixes
4. [GET] /ipl/highest-scores - List of players in descending order of Highest Scores
5. [GET] /ipl/best-batting-strike-rate - List of players for Best Batting Strike Rate
6. [GET] /ipl/most-wickets - List of players in descending order of Wickets taken
7. [GET] /ipl/best-bowling-innings - List of players for Best Bowling Innings
8. [GET] /ipl/best-bowling-average - List of players for Best Bowling Average
9. [GET] /ipl/best-bowling-economy - List of players for Best Bowling Economy