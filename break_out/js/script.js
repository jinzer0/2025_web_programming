$(() => {
    $(".to-menu-button").click(() => {
        open("home.html", "_self");
    });
});

function stringTime(unix_time) {
    const elapsedTime = Math.floor(unix_time / 1000);
    const hours = String(Math.floor(elapsedTime / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((elapsedTime % 3600) / 60)).padStart(2, '0');
    const seconds = String(elapsedTime % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

function parseTime(string_time) {
    const [hours, minutes, seconds] = string_time.split(':').map(Number);
    return (hours * 3600 + minutes * 60 + seconds) * 1000;
}