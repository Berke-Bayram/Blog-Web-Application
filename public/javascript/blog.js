$(document).ready(function() {
    $(".custom-navbar a").hover(
        function() {
            // Mouse enters: Apply styles for hovered state
            $(this).css({
                "color": "#800020",
                "background-color": "azure",
            });
        },
        function() {
            // Mouse leaves: Revert back to default styles
            $(this).css({
                "color": "",
                "background-color": "",
            });
        }
    );
});
