let storage = window.localStorage;
let result = [];
// 프로필 정렬 -

$(() => {
    sortData();
});

function sortData() {
    let profile = profileManager.getAllProfiles();
    let table=$("<table/>");
    let thead=$("<thead/>");
    let first_row=$("<tr/>").append(
        $("<th/>").text("User name"),
        $("<th/>").text("Highest score"),
        $("<th/>").text("Longest survived time"),
        $("<th/>").text("Average survived time")
    );
    thead.append(first_row);
    let tbody=$("<tbody/>");
    let second_row_tr=$("<tr/>");
    let second_row_td=$("<td/>").attr({
        "colspan":"4",
        "style":"color:lightgrey"
    });
    second_row_td.text("최고 기록만 표시 됩니다.");
    second_row_tr.append(second_row_td);
    tbody.append(second_row_tr);

    for(let i=0;i<profile.length;i++){
        let user_name=profile[i].name;
        let user_Highest_score=profile[i].highest_score;
        let user_Longest_time=profile[i].longest_survived_time;
        let user_average_time=profile[i].average_survived_time;
        var row=$("<tr/>").append(
            $("<td/>").text(user_name),
            $("<td/>").text(user_Highest_score),
            $("<td/>").text(user_Longest_time),
            $("<td/>").text(user_average_time)
        );
        tbody.append(row);
    }
    table.append(thead);
    table.append(tbody);

    $("#score-screen-middle-container").append(table);


}