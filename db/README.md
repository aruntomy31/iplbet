# IPL Betting DB Model

Following are the list of Schema along with their attributes

### User
- id : String (unique, required)
- name : String
- email : String
- photoURL : String
- admin : Boolean
- suspended : Boolean
- activateCode : String
- balance : Number

### Team
- id : String (unique, required) - IPL Team Short Name
- name : String
- logo : String,
- currentPosition : Number,
- positionLastYear : Number,
- titles : Number,
- players : Object [Player]
- teamStats : Object [TeamStatistics]

### Player
- name : String,
- photo : String,
- team : Object [Team]
- matches : Number
- battingStats : Object [BattingStatistics]
- bowlingStats : Object [BowlingStatistics]
- fieldingStats : Object [FieldingStatistics]

### BattingStatistics
- notOuts : Number
- runsScored : Number
- strikeRate : Number
- highScore : Number
- hundreds : Number
- fifties : Number
- fours : Number
- sixes : Number

### BowlingStatistics
- balls : Number
- maidens : Number
- runsConceded : Number
- wickets : Number
- bestFigures : String

### FieldingStatistics
- catches : Number
- stumpings : Number
- runOuts : Number

### TeamStatistics
- matches : Number
- won : Number
- lost : Number
- tie : Number
- nr : Number - No Result
- netRR : Number
- points : Number

### Match
- name : String
- homeTeam : Object [Team]
- awayTeam : Object [Team]
- fixture : Date - Match Date & Time
- batFirst : String
- winner : String
- wonBy : String

### Pot
- name : String (unique, required)
- openTime : Date
- closeTime : Date
- multiplier : Number
- winner : String
- match : Object [Match]

### Bet
- pot : Object [Pot] : (required)
- user : Object [User]
- betOn : String
- winner : String - Could be optional, since we are storing who is the winner in the Pot
- betTime : Date
- betAmount : Number
