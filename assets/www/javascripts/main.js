$(document).ready(function() {

    var qnaPanel = document.getElementById('qna-panel');
    var showAnswerButton = document.getElementById('show-answer-button');
    var showQuestionButton = document.getElementById('show-question-button');

    $(showQuestionButton).hide();

    var questions = $('.question');
    if (questions.length > 0) {
        $(qnaPanel).html($(questions[0]).val());
        $(qnaPanel).attr('question', $(questions[0]).val());
        $(qnaPanel).attr('answer', $(questions[0]).attr('answer'));
        $(qnaPanel).attr('note', $(questions[0]).attr('note'));
        $(qnaPanel).attr('sequence', $(questions[0]).attr('sequence'));
    }

});

$(document).on('click', '#show-answer-button', function(event) {
    event.preventDefault();
    var qnaPanel = document.getElementById('qna-panel');
    var showQuestionButton = document.getElementById('show-question-button');
    $(qnaPanel).html($('#qna-panel').attr('answer'));
    if ($(qnaPanel).attr('note') !== 'null' && $(qnaPanel).attr('note') !== null && $(qnaPanel).attr('note') !== '') {
        $(qnaPanel).append('<br/><strong>Note:</strong><br/>' + $(qnaPanel).attr('note'));
    }
    $(this).hide();
    $(showQuestionButton).show();
});

$(document).on('click', '#show-question-button', function(event) {
    event.preventDefault();
    var qnaPanel = document.getElementById('qna-panel');
    var showAnswerButton = document.getElementById('show-answer-button');
    $(qnaPanel).html($('#qna-panel').attr('question'));
    $(this).hide();
    $(showAnswerButton).show();
});

$(document).on('click', '#next-button', function(event) {
    event.preventDefault();
    var qnaPanel = document.getElementById('qna-panel');
    var nextSequence = parseInt($(qnaPanel).attr('sequence')) + 1;
    var nextQuestion = $('.question[sequence="' + nextSequence +'"]');
    $(qnaPanel).html($(nextQuestion).val());

    if (parseInt($(qnaPanel).attr('sequence')) ===  $('.question').size() -1) {
        alert('That was the last question.  Your ninja skills have improved by ten points.');
    }

    $(qnaPanel).attr('question', $(nextQuestion).val());
    $(qnaPanel).attr('answer', $(nextQuestion).attr('answer'));
    $(qnaPanel).attr('note', $(nextQuestion).attr('note'));
    if (parseInt($(qnaPanel).attr('sequence')) !==  $('.question').size() -1) {
        $(qnaPanel).attr('sequence', parseInt($(qnaPanel).attr('sequence')) + 1);
    }

    var showAnswerButton = document.getElementById('show-answer-button');
    var showQuestionButton = document.getElementById('show-question-button');
    $(showAnswerButton).show();
    $(showQuestionButton).hide();
});

$(document).on('click', '#prev-button', function(event) {
    event.preventDefault();
    var qnaPanel = document.getElementById('qna-panel');
    var prevSequence = parseInt($(qnaPanel).attr('sequence')) - 1;
    var prevQuestion = $('.question[sequence="' + prevSequence +'"]');

    if ((parseInt($(qnaPanel).attr('sequence')) - 1) === -1) {
        alert('Oops...this is the first question.  Go the other way.');
    }

    $(qnaPanel).html($(prevQuestion).val());
    $(qnaPanel).attr('question', $(prevQuestion).val());
    $(qnaPanel).attr('answer', $(prevQuestion).attr('answer'));
    $(qnaPanel).attr('note', $(prevQuestion).attr('note'));
    if ((parseInt($(qnaPanel).attr('sequence')) - 1) !== -1) {
        $(qnaPanel).attr('sequence', parseInt($(qnaPanel).attr('sequence')) - 1);
    }

    var showAnswerButton = document.getElementById('show-answer-button');
    var showQuestionButton = document.getElementById('show-question-button');

    $(showAnswerButton).show();
    $(showQuestionButton).hide();
});