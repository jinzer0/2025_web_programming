$(() => {
    $(".menu-item:nth-of-type(2)").on("click", function() {
        localStorage.setItem("isSettingMode", JSON.stringify(true));
    });
});