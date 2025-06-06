$(() => {
    let isWin = showResult();
    $("#result-title").animate({opacity: 1}, 1500, () => {
        $("#result-screen-middle-container").animate({opacity: 1}, 750, () => {
            $(".footer").animate({opacity: 1}, 750);
        });
    });
    
    $("#play-again-button").on("click", function() {
        let profile = profileManager.getCurrentProfile();
        if (profile && isWin) {
            profile["current_level"]--;
            profileManager.updateProfile(profile["name"], profile);
        }
        window.open("game.html", "_self");
    });
    
    $("#next-button").on("click", function() {
        window.open("story.html", "_self");
    });
});

function showResult() {
    let result = JSON.parse(localStorage.getItem("gameResult"));
    localStorage.removeItem("gameResult");
    
    if (result["is_win"]) $("#result-title").text("Level Completed...");
    else $("#result-title").text("Level Failed...");
    
    $("#final-score").append(result["score"]);
    $("#final-time").append(result["time"]);
    $("#lives-left").append(result["live"]);
    
    return result["is_win"];
}