//
// General Ajax Call
//

var chatterbotUrl = '/api/chatterbot/';
var csrftoken = Cookies.get('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$.ajaxSetup({
    beforeSend: function (xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

var $chatlog = $('#DIV_CHAT');
var $input = $('#txtmsg');
var $sayButton = $('#Submit2');

function createRowUser(text) {

    var currentdate = new Date();
    var datetime = "" + currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
    var $row = "<div class='direct-chat-msg right'>"
        + "<div class='direct-chat-info clearfix'>"
        + "<span class='direct-chat-name pull-right'>User</span>"
        + "<span class='direct-chat-timestamp pull-left'>" + datetime + "</span>"
        + "</div><img class='direct-chat-img' src='static/app/img/iconuserd.png' alt='message user image' />"
        + "<div class='direct-chat-text'>" + text + "</div></div>";
    $chatlog.append($row);
}

function createRowBot(text) {
    var currentdate = new Date();
    var datetime = "" + currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
    var $row = "<div class='direct-chat-msg left'>"
        + "<div class='direct-chat-info clearfix'>"
        + "<span class='direct-chat-name pull-left'>Bot</span>"
        + "<span class='direct-chat-timestamp pull-right'>" + datetime + "</span>"
        + "</div><img class='direct-chat-img' src='static/app/img/bot.png' alt='message user image' />"
        + "<div class='direct-chat-text'>" + text + "</div></div>";
    $chatlog.append($row);
}

function submitInput() {
    var inputData = {
        'text': $input.val()
    }

    // Display the user's input on the web page
    createRowUser(inputData.text);

    var $submit = $.ajax({
        type: 'POST',
        url: chatterbotUrl,
        data: JSON.stringify(inputData),
        contentType: 'application/json'
    });

    $submit.done(function (statement) {
        createRowBot(statement.text);

        // Clear the input field
        $input.val('');

        // Scroll to the bottom of the chat interface
        $chatlog[0].scrollTop = $chatlog[0].scrollHeight;
    });

    $submit.fail(function (d) {
        alert(d.status);
    });
}

$sayButton.click(function () {
    submitInput();
});

$input.keydown(function (event) {
    // Submit the input when the enter button is pressed
    if (event.keyCode == 13) {
        submitInput();
    }
});