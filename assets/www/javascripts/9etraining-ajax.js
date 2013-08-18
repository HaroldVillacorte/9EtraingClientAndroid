$(document).ready(function() {

    /**
     * Ajax show busy.
     */
    function showBusy()
    {
        $('#ajax-content').html('<div><img id="load-gif" src="images/load.gif" /></div>');
    }

    /**
     * Ajax Update page.
     * @param {string} html Ajax content.
     */
    function updateSettingsPage(html) {
        $('#ajax-content').hide().html(html).fadeIn();
        $('#input-username').val(localStorage.getItem('username'));
        $('#input-apikey').val(localStorage.getItem('apiKey'));
        if ($('#top-bar').hasClass('expanded')) {
            $('#top-bar').removeClass('expanded');
        };
    }

    $('.settings-link').click(function(event) {
        event.preventDefault();
        var link = $(this).attr('href');
        $.ajax({
            url: link,
            type: 'GET',
            dataType: 'html',
            beforeSend: function()
            {
              showBusy();
            },
            success: function(html)
            {
              updateSettingsPage(html);
            }
        });
    });

    try {
        var domains = JSON.parse(localStorage.getItem('domains'));
        var categories = JSON.parse(localStorage.getItem('categories'));
    } catch (e) {
        return true;
    }

    // Set the Domain menus.
    if (domains !== null) {
        $('#settings-front').before('<ul class="accordion" id="front-accordion"></ul>');
        for (i = 0; i < domains.length; i++) {
            $('#study-links').append('<li class="has-dropdown domain-link" domainid="' +
                    domains[i].id + '"><a href="#">' + domains[i].name +
                    '</a><ul class="dropdown" id="domain-' + domains[i].id +
                    '"></ul></li><li class="divider"></li>');
            $('#front-accordion').append('<li><div class="title"><h5>' +
                    domains[i].name + '</h5></div><div class="content"><ul id="front-domain-' +
                    domains[i].id + '"></ul></div></li>');
        };
    }

    // Set the Category menus.
    if (categories !== null) {
        for (i = 0; i < categories.length; i++) {
            var UlDomain = $('#domain-' + categories[i].domainId);
            $(UlDomain).append('<li><a href="questions.html" class="question-link" categoryid="' +
                    categories[i].id + '" categoryname="' + categories[i].name + '">' +
                    categories[i].name + '</a></li><li class="divider"></li>');
            var frontDomain = document.getElementById('front-domain-' + categories[i].domainId);
            $(frontDomain).append('<li><a href="questions.html" class="question-link" categoryid="'+
                    categories[i].id + '" categoryname="' +
                    categories[i].name+'">' + categories[i].name + '</a></li>');
        }
    }
});

$(document).on('click', '.question-link', function(event) {
    event.preventDefault();

    var link = $(this).attr('href');
    var categoryId = parseInt($(this).attr('categoryid'));
    var categoryName = $(this).attr('categoryname');

    function showBusy()
    {
        $('#ajax-content').html('<div><img id="load-gif" src="images/load.gif" /></div>');
    }

    function updateQuestionsPage(html) {
        var allQuestions = JSON.parse(localStorage.getItem('questions'));
        var questions = [];

        for (i = 0; i < allQuestions.length; i++) {
            if (allQuestions[i].categoryId === categoryId) {
                questions.push(allQuestions[i]);
            }
        }

        $('#ajax-content').hide().html(html).fadeIn();
        for (i = 0; i < questions.length; i++) {
            if (questions[i].categoryId === categoryId) {
                $('#question-list').append('<input class="question" type="hidden" sequence="' +
                        i + '" note="' + questions[i].note + '" answer="' +
                        questions[i].answer + '" value="' + questions[i].question +
                        '" name="question-' + questions[i].id + '">');
            }
        }

        var qnaPanel = document.getElementById('qna-panel');
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

        $('#category-title').html(categoryName);
        if ($('#top-bar').hasClass('expanded')) {
        	$('#toggle-topbar').click();
        };
    }

    $.ajax({
        url: link,
        type: 'GET',
        dataType: 'html',
        beforeSend: function()
        {
          showBusy();
        },
        success: function(html)
        {
          updateQuestionsPage(html);
        }
    });
});

$(document).on('submit', '#login-form', function(event) {
    event.preventDefault();

    function updatePage(data) {
        $('#ajax-content').hide().html(data).fadeIn('slow');
        $('#input-username').val(localStorage.getItem('username'));
        $('#input-apikey').val(localStorage.getItem('apiKey'));
    }

    var ajaxHtml = $('#ajax-content').html();
    var username = $('#input-username').val();
    var apiKey = $('#input-apikey').val();

    // Saveusername and password.
    if (typeof(localStorage) === 'undefined' )
    {
        alert('Your browser does not support HTML5 localStorage. Try upgrading.');
    }
    else
    {
        try
        {
            localStorage.setItem('username', username);
            localStorage.setItem('apiKey', apiKey);
            updatePage(ajaxHtml);
            $('#messages').html('Username and api key saved successfully.<a href="" class="close">&times;</a>');
            $('#messages').removeClass('alert');
            $('#messages').addClass('alert-box success');
        }
        catch (e)
        {
            if (e === QUOTA_EXCEEDED_ERR)
            {
                alert('Quota exceeded!');
            }
            updatePage(ajaxHtml);
            $('#messages').html('There was a problem saving the username and api key.<a href="" class="close">&times;</a>');
            $('#messages').removeClass('success');
            $('#messages').addClass('alert-box alert');
        }
    }
});

$(document).on('click', '#sync-button', function(event) {

    event.preventDefault();

    var ajaxHtml = $('#ajax-content').html();
    var username = localStorage.getItem('username');
    var apiKey = localStorage.getItem('apiKey');

    function showBusy()
    {
        $('#ajax-content').html('<div><img id="load-gif" src="images/load.gif" /></div>');
    }

    function updatePage(data) {
        $('#ajax-content').hide().html(data).fadeIn();
        $('#input-username').val(localStorage.getItem('username'));
        $('#input-apikey').val(localStorage.getItem('apiKey'));
    }

    var data = {username:username, apiKey:apiKey};

    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: 'http://9etraining.laughinghost.com/study-rest',
        data: data,
        beforeSend: function()
        {
          showBusy();
        },
        success: function(data)
        {
            if (data.data === 'user') {
                updatePage(ajaxHtml);
                $('#messages').html('Username was not found.<a href="" class="close">&times;</a>');
                $('#messages').removeClass('success');
                $('#messages').addClass('alert-box alert');
            }
            if (data.data === 'key') {
                updatePage(ajaxHtml);
                $('#messages').html('Api key was not found.<a href="" class="close">&times;</a>');
                $('#messages').removeClass('success');
                $('#messages').addClass('alert-box alert');
            }

            localStorage.setItem('domains', JSON.stringify(data.data.domains));
            localStorage.setItem('categories', JSON.stringify(data.data.categories));
            localStorage.setItem('questions', JSON.stringify(data.data.questions));
            try {
                var domains = JSON.parse(localStorage.getItem('domains'));
                var categories = JSON.parse(localStorage.getItem('categories'));
                var questions = JSON.parse(localStorage.getItem('questions'));
            } catch (e) {
                return true
            }

            // Remove menus.
            $('#study-links li').remove();
            $('#study-links').append('<li class="divider"></li>');

            // Set the domain menus.
            for (i = 0; i < domains.length; i++) {
                $('#study-links').append('<li class="has-dropdown domain-link" domainid="' +
                        domains[i].id + '"><a href="#">' + domains[i].name +
                        '</a><ul class="dropdown" id="domain-' + domains[i].id +
                        '"></ul></li><li class="divider"></li>');
            };
            // Set the Category menus.
            for (i = 0; i < categories.length; i++) {
                var UlDomain = $('#domain-' + categories[i].domainId);
                $(UlDomain).append('<li><a href="questions.html" class="question-link" categoryid="' +
                        categories[i].id + '" categoryname="' + categories[i].name + '">' +
                        categories[i].name + '</a></li><li class="divider"></li>');
            }

            updatePage(ajaxHtml);

            if (domains.length > 0 && categories.length > 0 && questions.length > 0) {
                $("#sync-modal").reveal();
            }
        }
    });

});

$(document).on('click', '#sync-refresh-button', function() {
    window.location.reload();
});
