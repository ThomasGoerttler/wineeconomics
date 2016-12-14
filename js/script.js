CURRENT_OPEN_DATA = "CURRENT_OPEN_DATA_13"
PAST_RESULTS = "PAST_RESULTS_05"

$(document).ready(function() {
	question_already_answered = false
	$("#question").text("question")
	current_question_id = 0
	
	if(typeof(Storage) !== "undefined") {
		if (localStorage.getItem(CURRENT_OPEN_DATA) != null) {
			open_questions = JSON.parse(localStorage.getItem(CURRENT_OPEN_DATA)).open_questions
			wrong = JSON.parse(localStorage.getItem(CURRENT_OPEN_DATA)).wrong
			count_of_questions = JSON.parse(localStorage.getItem(CURRENT_OPEN_DATA)).count_of_questions
			
		} else {
			open_questions = question_data.questions.slice(0)
			wrong = 0
			count_of_questions = question_data.questions.length
		}
	} 
	else { 
		open_questions = question_data.questions.slice(0)
		wrong = 0
		count_of_questions = question_data.questions.length
	}
	
	display_question_container()
	if (open_questions.length == 0 ){
		show_result_of_try()
	}
	else {
		next_question()
	}
	$("#list_of_all_questions_subheading").text('')
	$("#list_of_all_questions_subheading").append('List of all ' + count_of_questions + ' questions having been added. In case you observe an error, do not hesitate to <a href="mailto:thomas.goerttler@gmail.com">contact</a> me.')
	
	
	$("#next_question").click(function(event) {	
		if (open_questions.length == 0 ){
			show_result_of_try()
		}
		else if(question_already_answered) {
			next_question()
		} else {
			alert("Answer the question!")
		}
  })
	
	$("#mistake_found").click(function(event) {	
		element = open_questions[current_question_id]
		string = "I have found a mistake. \n\n\n\n #### your text ####  \n\n\n\nQuestion: " + element.question + " \nCorrect answer: " + element.correct_answer + " \nWrong answers: " 
		for(i in element.wrong_answers) {
			string += "\n" + element.wrong_answers[i]
		}
		$('#message').text(string)
		$('#mistake_modal').modal('show');
	})
	
});

$(document).on("click", ".portfolio-caption", function(event) {
	question_answer($(this))
});

function show_result_of_try() {
	text = "You have answered all " + count_of_questions + " questions correctly by making " + wrong + " mistakes. Do not hesitate to contribute your own question. Have a watch at your history."
	
	
	add_another_gone_through(wrong, count_of_questions)
	
	if(typeof(Storage) !== "undefined") {
		if (localStorage.getItem(PAST_RESULTS) != null) {
			past_results = JSON.parse(localStorage.getItem(PAST_RESULTS)).results
		} else {
			past_results = null
		}
	} else {
		past_results = null
	}
	console.log(past_results)
	if(past_results != null) {

		labels = []
		answers_county = []
		wrongies = []
		for(var index = 0; index < past_results.length; index++) {
		//	text += "<br>" + index+1  + ". " + past_results[index].wrong + " of " + past_results[index].count_of_questions + " were wrong."
			d = new Date(past_results[index].time)
			str = ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);

			
			labels.push(str)
			answers_county.push(past_results[index].count_of_questions)
			wrongies.push(past_results[index].wrong)
		}
		text += '<canvas id="myChart"></canvas>'

	}
	


	$('#modal-body-end').text("")
	$('#modal-body-end').append(text)

	$('#end_modal').on('shown.bs.modal', function (e) {
		if(past_results != null) {
			var data = {
			labels: labels,
			datasets: [
			{
				label: "Questions answered",
				fillColor: "rgba(252,248,227,0.2)",
				strokeColor: "rgba(252,248,227,1)",
				pointColor: "rgba(252,248,227,1)",
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(252,248,227,1)",
				data: answers_county
			},
			{
				label: "Wrong answers",
				fillColor: "rgba(217, 83, 79,0.2)",
				strokeColor: "rgba(217, 83, 79,1)",
				pointColor: "rgba(217, 83, 79,1)",
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(217, 83, 79,1)",
				data: wrongies
			}
			]
			};

			var option = {
				responsive: true,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
			};
			
			var ctx = document.getElementById("myChart").getContext('2d');
			var myLineChart = new Chart(ctx).Line(data, option); //'Line' defines type of the chart.
			myLineChart()
		}
	});
	$('#end_modal').modal('show');

	

	
	open_questions = question_data.questions.slice(0)
	wrong = 0
	count_of_questions = question_data.questions.length
	update_current_open_data(open_questions, wrong, count_of_questions)
	next_question()
}

/*
* Update cookies
*/
function update_current_open_data (open_questions, wrong, count_of_questions) {
	if(typeof(Storage) !== "undefined") {

		current = new Object()
		current.open_questions = open_questions
		current.wrong = wrong
		current.count_of_questions = count_of_questions

		localStorage.setItem(CURRENT_OPEN_DATA, JSON.stringify(current))
	} 
}

function add_another_gone_through (wrong, count_of_questions){
	if(typeof(Storage) !== "undefined") {
		
		if (localStorage.getItem(PAST_RESULTS) != null) {
			current = JSON.parse(localStorage.getItem(PAST_RESULTS))
		} else {
			current = new Object()
			current.results = new Array()
		}
		result = new Object()
		result.time = "" + new Date()
		result.wrong = wrong
		result.count_of_questions = count_of_questions
		current.results.push(result)
		console.log(current)
		localStorage.setItem(PAST_RESULTS, JSON.stringify(current))
	} 
}


function display_question_container() {
	for(index in question_data.questions) {
		wrongs = ""
		for (j in question_data.questions[index].wrong_answers) {
			wrongs += question_data.questions[index].wrong_answers[j] + "<br>"
		}
		string = '<div class="panel panel-warning">'
			+ '<div class="panel-heading">' + question_data.questions[index].question + '</div>'
			+ '<div class="panel-footer">' + question_data.questions[index].correct_answer + '</div>'
			+ '<div class="panel-body">' + wrongs + '</div></div>'
		$("#questions_container").append(string)
	}
}

function next_question() {
	already_solved = count_of_questions - open_questions.length
	at_least_tries = count_of_questions + wrong
	
	$("#already_solved_bar").css('width', already_solved/at_least_tries * 100 + "%" )
	$("#between_solved_bar").css('width', (at_least_tries - already_solved - wrong)/at_least_tries * 100 + "%" )
	$("#false_solved_bar").css('width', wrong/at_least_tries * 100 + "%" )
	question_already_answered = false
	index =  Math.floor(Math.random() * open_questions.length)
	current_question_id = index
	display_new_question(open_questions[index])
}

function question_answer(element) {
	if(!question_already_answered) {
		if(answer_true(element[0].id)) {
			element.css('background-color', '#5cb85c');
			element.css('color', 'white');
			open_questions.splice(current_question_id, 1)
			update_current_open_data(open_questions, wrong, count_of_questions)
		}
		else {
			element.css('background-color', '#d9534f');
			element.css('color', 'white');
			$( ".portfolio-caption" ).each(function( index, element ) {
				if(answer_true($(element)[0].id)) {
					$(element).css('background-color', '#5cb85c');
					$(element).css('color', 'white');
					}
			});
			wrong++
			update_current_open_data(open_questions, wrong, count_of_questions)
		}
	}
	question_already_answered = true
}

function answer_true(id) {
	if(id === "right")
		return(true)
	return(false)
}

function display_new_question(questions) {
	answers = shuffle(questions.wrong_answers.concat(questions.correct_answer))
	$("#anser_container").text('')
	$("#question").text(questions.question)
	for(index in answers) {
		added_answer = '<div class="col-md-4 col-sm-6 portfolio-item">'
			+ '<div class="portfolio-caption" style="border-radius: 3px; background-color: #fcf8e3; border: 1px solid transparent; color: #8a6d3b; border-color: #faebcc;" id="' + is_right(answers[index], questions.correct_answer) + '">'
				+ answers[index]
			+ '</div>'
		+ '</div>'
		$("#anser_container").append(added_answer)
	}
}

function is_right(answer, solution) {
	if(answer === solution) {
		return("right")
	} else {
		return("wrong")
	}
}

function shuffle (array) {
	var i = 0
		, j = 0
		, temp = null

	for (i = array.length - 1; i > 0; i -= 1) {
		j = Math.floor(Math.random() * (i + 1))
		temp = array[i]
		array[i] = array[j]
		array[j] = temp
	}
	return(array)
}

