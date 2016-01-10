var main = function() {
    "use strict";

    var addCommentFromInputBox = function () {
        var $new_comment;
        if($(".comment-input input").val() !== "") {
            // create jquery object to hold input text
            $new_comment = $("<p>").text($(".comment-input input").val());
            $new_comment.hide();
            $(".comments").append($new_comment);
            $new_comment.fadeIn();
            $(".comment-input input").val("");
        }
    };

    // makes clicking button work
    $(".comment-input button").on("click", function(event) {
        addCommentFromInputBox();
    });

    // making enter work
    $(".comment-input input").on("keypress", function(event) {
        if(event.keyCode === 13) {
            addCommentFromInputBox();
        }
    });

};

$(document).ready(main);
