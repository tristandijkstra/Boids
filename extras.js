$(document).ready(function () {
    $("#openAbout").animate({background: "none", color: "white"}, "slow", function () {
        $(this).removeClass("itemHighlight");
    })

    $("#closeAbout").click(function () {
        $(".about").animate({right: "-600px"}, "slow", function () {
            $(this).hide();
        });
    });
    $("#openAbout").click(function () {
        $(".about").show(function () {
            $(this).animate({ right: "0px" });
        });
    });
});