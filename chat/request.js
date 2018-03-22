$(document).ready(function() {

    var texts = ['Xin chào!','Hi 🙋🏻','Chatbot sẵn sàng trả lời bạn!'];
    //  setResponse("............");

    var text = texts[Math.floor(Math.random() * texts.length)];
    document.getElementById('bot').innerHTML = "<div class='calloutbig'><img src='chatbot.png' width='50px' height='50px' class='circular--square' style='float: left;' /><div class='calloutright'>" + text + "</div><div class='message-from message-from-bot'>"+ new Date().toLocaleTimeString() +"</div></div>";
    $("#input").keypress(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            send();
        }
    });
    $('.send_message').click(function (e) {
            send();
    });

});

function mybutton() {
    var mytext = document.getElementById('button').value;
//    alert(mytext)
    send(mytext)
}

function send(mytext) {
    if (typeof mytext !='undefined'){
        var text = mytext
    } else {
        var text = $("#input").val();
    }
    var doc = document.getElementById('bot').innerHTML;
    document.getElementById('bot').innerHTML = doc + "<div class='calloutbig'> <img src='user.png' width='32px' height='32px' class='circular--square' style='float: right;' /><div class='calloutleft'>" + text + "</div><div class='message-from message-from-me'>"+ new Date().toLocaleTimeString() +"</div></div>";
    var objDiv = document.getElementById("bot");
    objDiv.scrollTop = objDiv.scrollHeight;
//    var accessToken = 'a22f09b1185540c28d42d379bdbbcc4d';
    var baseUrl = "https://api.api.ai/v1/query?v=20150910";

    var fun1 = $.ajax({
        type: "POST",
        url: baseUrl,
        headers: {"Authorization": "Bearer a22f09b1185540c28d42d379bdbbcc4d"},
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ query: text, lang: "en", sessionId: "somerandomthing" }),
        success: function(data) {
            speech = $.parseJSON(JSON.stringify(data));
            var replies = speech.result.fulfillment.messages;
            nb_reply = replies.length
            for (i = 0; i < nb_reply; i++) {

                var html = replies[i]["speech"];
                var div = document.createElement("div");
                div.innerHTML = html;

                var fun2 = $.ajax({
                    type: "POST",
                    url: "http://api.openfpt.vn/text2speech/v4",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    headers: {
                            "api_key": "b7891e7b46764220b73911ed479f3c7f",
                            "speed": 2,
                            "voice": "female",
                            "prosody": 1,
                            },
                    data: div.innerText,
                    success: function(data) {
                        sound = $.parseJSON(JSON.stringify(data));
                        var url = sound.async;
                        //alert(url)
                        var audio = new Audio(url);
                        audio.play();
                        },
                });

                var doc = document.getElementById('bot').innerHTML;
                document.getElementById('bot').innerHTML = doc + "<div class='calloutbig' id='callout'><img src='chatbot.png' width='50px' height='50px' class='circular--square' style='float: left;' /><div class='calloutright'>" + replies[i]["speech"] + "</div><div class='message-from message-from-bot'>"+ new Date().toLocaleTimeString() +"</div></div>";
                var doc = document.getElementById('bot').lastElementChild.innerHTML;
                var objDiv = document.getElementById("bot");
                objDiv.scrollTop = objDiv.scrollHeight;
                }
        },
    });

    $('#input').val("");
}
