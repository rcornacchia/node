var main = function() {
    "use strict";
    $(".comment-input button").on("click", function(event) {
        if($(".comment-input input").val() !== "") {
            // create jquery object to hold input text
            var $new_comment = $("<p>").text($(".comment-input input").val());
            $(".comments").append($new_comment);
        }
    });
};

$(document).ready(main);
