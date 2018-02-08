const bodyParser = require('body-parser')
const express = require('express')
const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const PHASES = [
	"submission",
	"winner"
]

const QUESTIONS = [
	"question1",
	"question2",
	"question3",
	"question4",
	"question5",
];

const CONFIG = {
	PORT: 						3000,
	SUBMISSION_PHASE_LENGTH: 	60 * 1000,
	WINNER_PHASE_LENGTH: 		60 * 1000
}

class Submission {
	constructor(giphyID, username) {
		this.giphyID = giphyID;
		this.username = username;
		this.upvotes = 0;
	}
}


let state = {
	phase: 			null, //PHASES[n]
	question: 		null, //QUESTIONS[n]
	time_next_phase: 0,
	winner: 		null,
	submissions: 	[
		//new Submission("8sn28d", "chrissilich")
	],
}


let goToSubmissionPhase = function() {
	setTimeout(goToWinnerPhase, CONFIG.SUBMISSION_PHASE_LENGTH)
	state.time_next_phase = Date.now() + CONFIG.SUBMISSION_PHASE_LENGTH;
	// console.log("current time: ", Date.now());
	// console.log("time_next_phase: ", state.time_next_phase);

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
	state.time_next_phase = Date.now() + CONFIG.SUBMISSION_PHASE_LENGTH;

	// sort the submissions
	state.submissions.sort(function(a,b) {
		if (a.upvotes < b.upvotes) return -1;
		if (a.upvotes == b.upvotes) return 0;
		if (a.upvotes > b.upvotes) return 1;
	})

	// change phase
	state.phase = PHASES[1]

	// announce phase in console
	console.log("phase change: " + state.phase);	
}

goToSubmissionPhase();




app.get('/', (req, res) => res.status(200).send('This is the API for the game we make in a Vue class at the Creative Circus. Written by Chris Silich, in 2018.'))


app.get('/status', (req, res) => {
	res.status(200).json(state)
})

app.get('/submission', (req, res) => {
	res.json(state.submissions)
})

app.post('/submission', (req, res) => {
	if (state.phase != PHASES[0]) {
		return res.status(409).send("You can't submit right now.");
	}
	state.submissions.push( new Submission(req.body.giphyID, req.body.username) )
	res.status(201).send("Submission recieved")
})

app.post('/submission/:id', (req, res) => {
	if (state.phase != PHASES[0]) {
		return res.status(409).send("You can't vote right now.");
	}
	if (state.submissions.length <= req.params.id) {
		return res.status(404).send("That submission doesn't exist.");		
	}
	state.submissions[ req.params.id ].upvotes++;
	res.status(202).send("Upvoted submission " + req.params.id );
})

app.listen(CONFIG.PORT, () => {
	console.log('Vue Giphy Game Server listening on port ' + CONFIG.PORT)
})