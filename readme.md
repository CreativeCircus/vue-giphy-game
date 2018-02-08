# Vue Giphy Game Server

This is the server for the game we make as the main project in the Vue class. The server itself has nothing to
do with Vue, and it's all prewritten, so students don't need to download this code, unless they want to learn how
it works on their own.

## API
This server will be deployed somewhere, ask your teacher for the URL. Once you have that, make requests to that URL plus the routes listed below. E.g. If the server URL is `http://example.com:6432` and you want to access the upvote route, you might request `http://example.com:6432/upvote/5`

### `GET /status`
Do a GET request for `/status` to get the current state of the game, in JSON object form. This should be done when the player first loads the game, so that their interface is in sync with the phase/timing of the game's rounds, and at any other time that the player's device needs to learn or confirm what the game's state is. Inside this JSON object, you'll find
1. `phase` *String.* Describes the phase of the two phase game. Either "submission" or "winner". The sumbission phase is when the game is taking submissions, and allowing people to vote on the submission they like best. The winner phase is when the game is not taking submissions or votes, but is simply showing who won this round with the most upvoted submission.
2. `question` *String.* The question this round is based on.
3. `time_next_phase` *Number.* The unix timestamp of when this round is scheduled to end. Use this on the front end to show a countdown til the end of the round.
4. `submissions` *Array of Submission Objects.* This contains all the submissions already in the system. Each submission object will contain:
   - `giphyID` *String.* The giphy ID of the chosen gif
   - `username` *String.* The name of the submitting user

### `POST /submission`
Do a POST request for `/submission` to enter a new submission in the game. With the request you must send two pieces of data:
1. `giphyID` *String.* The string of letters and numbers that represents a gif on the Giphy service. You'll need to create you own ajax requests to the (Giphy API)[https://developers.giphy.com/docs/] to find and choose gifs.
2. `username` *String.* A user name the user has entered to represent them on the scoreboard. No security here, just let the user type a name.

### `POST /upvote/{id}`
Do a POST request for `/upvote/{id}` where `{id}` is the actual index of the submission you want to upvote. Again, no security here, this is just for fun. Yes, people could abuse and vote more than once quite easily.
