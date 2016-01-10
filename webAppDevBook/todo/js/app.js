var main = function () {
    "use strict";

    $(".tabs a span").toArray().forEach(function (element) {
        // create a click handler for this element
        $(element).on("click", function() {
            $(".tabs a span").removeClass("active");
            $(element).addClass("active");
            $("main .content").empty();
        });
    });

};

$(document).ready(main);
