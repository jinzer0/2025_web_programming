$(() => {
    $(".menu-item:nth-of-type(2)").on("click", function() {
        console.log("Settings clicked");
        localStorage.setItem("isSettingMode", JSON.stringify(true));
        let set = localStorage.getItem("isSettingMode");
        console.log("Setting mode:", set);
    });
});