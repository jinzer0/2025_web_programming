$(() => {
    // TODO: profile에서 level 불러와서 button 활성화 및 비활성화 설정, hover시 비활성화된 level button color: red;
    // .menu-item 클릭 시 이벤트 핸들러, 클릭시 해당 요소의 text let level에 저장

    let name = profileManager.getCurrentProfileName();
    let profile = profileManager.getCurrentProfile();
    console.log(`Current Profile Name: ${name}`);
    console.log(`Current Profile:`, profile);
    $(".menu-item").on("mouseenter", function() {
        $(".level-detail").eq($(this).index()-1).fadeIn(300).show();
    }).on("mouseleave", function() {
        $(".level-detail").eq($(this).index()-1).fadeOut(300, function() { $(this).hide(); });
    });
    
    
    $(".menu-item").on("click", function() {
        let level = $(this).data("level").toUpperCase();
        if (level && name) {
            profileManager.updateProfile(name, {current_level: LEVEL[level]});
            window.open("game.html", "_self");
        }
    });

    Object.values(profile["level_progress"]).forEach((element, idx) => {
        if (!element["unlocked"]) $(".menu-item").eq(idx).addClass("disabled");
    });
    $(".menu-item.disabled").off();
}); 