questions
	winning
	friday
	hangry
	wtf
	nailed it!
	smh
	


back end logic
	timer to change phases
	during submitting phase, generate a question, and recieve submissions and upvotes
	during winner phase, just show who won the last round


back end routes
GET /status
	phase: submitting or winner
	question
	time of next phase

POST /submission
	name
	giphy

GET /submission
	submissions
		id
		name
		giphy

POST /submission/:id
	id


front end
	GET /status
		if phase is winner, show countdown to next game screen
		if phase is submitting, go to voting screen

	countdown to next game screen
		shows countdown
		at end of countdown, does another status request

	voting screen
		GET /submission
		hows already submitted giphys, with names. one tap to upvote the ones you like
		shows button to submit a giphy, which takes you to submission screen

	submitting screen
		shows question
		has giphy search tool to find the giphy you want to submit
		tap the one you want to submit
			POST /submission
			go to voting screen