$(() => {
    let story_container = $(".story-detail");
    story_container.addClass("display");
    for (let i = 0; i < 4; i++) $("#story-screen").removeClass("bg" + i);


    let currentLevel = profileManager.getCurrentProfile().current_level;
    console.log(`Current Level: ${currentLevel}`);
    if (currentLevel >= LEVEL.EASY && currentLevel <= LEVEL.IMPOSSIBLE) {
        story_container.eq(currentLevel).removeClass("display");
        $("#story-screen").addClass("bg" + currentLevel);
    }
});