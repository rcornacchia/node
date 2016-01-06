var main = function() {
    "use strict";

    // makes clicking button work
    $(".comment-input button").on("click", function(event) {
        var $new_comment;
        if($(".comment-input input").val() !== "") {
            // create jquery object to hold input text
            $new_comment = $("<p>").text($(".comment-input input").val());
            $(".comments").append($new_comment);
            $(".comment-input input").val("");
        }
    });

    // making enter work
    $(".comment-input input").on("keypress", function(event) {
        var $new_comment;

        if(event.keyCode === 13) {
            if ($(".comment-input input").val() !== "") {
                $new_comment = $("<p>").text($(".comment-input input").val());
                $(".comments").append($new_comment);
                $(".comment-input input").val("");
            }
        }
    });

};

$(document).ready(main);
