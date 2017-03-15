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

### Player
- name : String,
- photo : String,
- team : Object [Team]
- matches : Number

### Match
- name : String
- homeTeam : Object [Team]
- awayTeam : Object [Team]
- fixture : Date - Match Date & Time
- winner : String
- wonBy : String

### Pot
- name : String (unique, required)
- displayName : String (required)
- openTime : Date
- closeTime : Date
- isTeamLevel : Boolean
- multiplierHome : Number
- multiplierAway : Number
- winner : String
- match : Object [Match]

### Bet
- pot : Object [Pot] : (required)
- user : Object [User]
- betOn : String
- betTime : Date
- betAmount : Number
- multiplier : Number
- winAmount : Number

### Transaction
- from : Object [User]
- to : String - Could be 'match' or 'user' or 'null' (user in case of Transfer)
- type : String - Could be 'Bet' or 'Transfer'
- time : Date
- amount : Number
