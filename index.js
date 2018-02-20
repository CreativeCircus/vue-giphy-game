const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const app = express()

// allow cors
app.use(cors())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const PHASES = [
	"game", // question showing, players submitting and voting
	"post-game" // winner showing
]

const QUESTIONS = [
	// "winning",
	// "friday",
	"hangry",
	"wtf",
	"nailed it!",
	"smh",
	"fail",
	"resting bitch/bastard face",
	"tgif",
];

const CONFIG = {
	PORT: 						6432,
	SUBMISSION_PHASE_LENGTH: 	120 * 1000,
	WINNER_PHASE_LENGTH: 		10 * 1000
}

class Submission {
	constructor(giphyURL, username) {
		this.giphyURL = giphyURL;
		this.username = username;
		this.upvotes = [];
		console.log("created submission", giphyURL, username)
	}
}


let state = {
	phase: 			null, //PHASES[n]
	question: 		null, //QUESTIONS[n]
	phaseStartTime: null,
	phaseLength:	null,
	// when state is sent to front end, we add timeLeftInPhase, which is how long in ms there is left in this phase
	// when state is sent to front end, we add currentTime of Date.now()
	submissions: 	[
		//new Submission("8sn28d", "chrissilich")
	],
}


let goToSubmissionPhase = function() {
	setTimeout(goToWinnerPhase, CONFIG.SUBMISSION_PHASE_LENGTH)
	state.phaseStartTime = Date.now();
	state.phaseLength = CONFIG.SUBMISSION_PHASE_LENGTH;
	// console.log("current time: ", Date.now());
	// console.log("timeToNextPhase: ", state.timeToNextPhase);

	// change phase
	state.phase = PHASES[0]
	console.log("phase change: " + state.phase);
	
	// get new question
	state.question = QUESTIONS[0];
	QUESTIONS.push(QUESTIONS.shift());
	console.log("new question: ", state.question);

	// clear the old submissions
	state.submissions = [];
	console.log("clearing submissions: ", state.submissions);
}

let goToWinnerPhase = function() {
	setTimeout(goToSubmissionPhase, CONFIG.WINNER_PHASE_LENGTH)
	state.phaseStartTime = Date.now();
	state.phaseLength = CONFIG.WINNER_PHASE_LENGTH;

	// sort the submissions
	state.submissions.sort(function(a,b) {
		if (a.upvotes.length < b.upvotes.length) return 1;
		if (a.upvotes.length == b.upvotes.length) return 0;
		if (a.upvotes.length > b.upvotes.length) return -1;
	})

	// change phase
	state.phase = PHASES[1]

	// announce phase in console
	console.log("phase change: " + state.phase);	
}

goToSubmissionPhase();





app.get('/', (req, res) => res.status(200).send('This is the API for the game we make in a Vue class at the Creative Circus. Written by Chris Silich, in 2018.'))


app.get('/status', (req, res) => {
	res.status(200).json( Object.assign({
		currentTime: Date.now(), 
		timeLeftInPhase: state.phaseStartTime + state.phaseLength - Date.now()
	}, state) )
})

app.post('/submission', (req, res) => {
	if (state.phase != PHASES[0]) {
		return res.status(409).send("You can't submit right now.");
	}
	if (!req.body || !req.body.giphyURL || !req.body.username) {
		return res.status(400).send("Your submission was malformed. Make sure it contains a giphyURL and a username.");
	}
	state.submissions.push( new Submission(req.body.giphyURL, req.body.username) )
	res.status(201).send("Submission recieved")
})

app.post('/upvote/:id', (req, res) => {
	if (state.phase != PHASES[0]) {
		return res.status(409).send("You can't vote right now.");
	}
	if (state.submissions.length <= req.params.id) {
		return res.status(404).send("That submission doesn't exist.");		
	}
	var submission = state.submissions[ req.params.id ]
	if (submission.upvotes.indexOf( req.body.username ) === -1) {
		// havent yet upvoted this one	
		submission.upvotes.push( req.body.username )
		res.status(202).send("Upvoted submission " + req.params.id );
	} else {
		res.status(409).send("Upvoted already counted " + req.params.id );
	}
})

app.listen(CONFIG.PORT, () => {
	console.log('Vue Giphy Game Server listening on port ' + CONFIG.PORT)
})