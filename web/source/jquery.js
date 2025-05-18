// /*jquery.html의 main-menu 스타일 변경*/
// /*mouseover :  font-size 20px*/
// /*background-color: green*/
// /*mouseout 글씨크기 원래대로 배경 지우기*/

let i = 0;
let img_order = 0;


$(document).ready(function() {
    // 실습 1
    $("div.out").mouseover(() => {
        $("div.out > p:first").text("mouse over");
        $("div.out > p:last").text(++i);
    })

    $("div.out").mouseout(() => {
        $("div.out > p:first").text("mouse out");
    })

    // 실습 2
    $("#b1").on("click", {
        url: "https://www.google.com",
        winattributes: "resize=1, scrollbars=1, status=1"
    }, max_open);

    // 실습 3
    $("#bind").click(() => {
        $("body")
            .on("click", "#theone", flash)
            .find("#theone")
            .text("Can Click!");
    });

    $("#unbind").click(() => {
        $("body")
            .off("click", "#theone", flash)
            .find("#theone")
            .text("Does nothing...");
    });

    // 실습 4
    $("#trigger_test>button:first").click(() => {
        update($("span:first"));
    })

    $("#trigger_test>button:last").click(() => {
        $("#trigger_test>button:first").trigger("click");
        update($("span:last"));
    });

    // 실습 5
    $("#image").click(() => {
        let img = $("#image").attr("src");
        img = img === "img1.jpg" ? "img2.jpg" : "img1.jpg";
        $("#image").attr("src", img);
    });

    // 실습 6
    $("#imgAlbum").click(() => {
        if (img_order >= 4) img_order = -1;
        let imgArray = ["img1.jpg", "img2.jpg", "img3.jpg", "img4.jpg", "img5.jpg"];
        $("#imgAlbum").attr("src", imgArray[++img_order]);
    });

    // 실습 7
    $(".main-menu").mouseover(function() {
        $(this).css("font-size", "20px");
        $(this).css("background-color", "green");
    });

    $(".main-menu").mouseout(function() {
        $(this).css("font-size", "1em");
        $(this).css("background", "none");
    });

    function change_position(obj) {
        let l = ($(window).width() - obj.width()) / 2;
        let h = ($(window).height() - obj.height()) / 2;
        obj.css({
            top: h,
            "left": l
        });
    }

    // 실습 8
    // img 버튼 클릭시 id=note_form 영역 보이기
    $("div#add_img>img").click(function() {
        // $("#note_form").attr("class", "popup");
        $("#note_form").addClass("popup").fadeIn("slow");
        change_position($(".popup"));
        // $("#note_form").show();
    });
    // 노트 입력 양식에서 확인 버튼 클릭시 사용자 입력 내용을 id=note 영역에 추가하되 제목, 날짜, 내용 순서
    $("#add_note").click(function() {
        let title = $("#note_title").val();
        let date = $("#note_date").val();
        let content = $("#note_content").val();
        $("#note").append("<p>" + title + "<br>" + date + "<br>" + content + "<br>" + "<br>" + "</p>");
        $("#note_form").fadeOut();
        // $("#note_form").hide();

    });

    // 실습 8
    $(window).resize(function() {
        change_position($(".popup")); // window resize시 popup 위치 변경
    });

    // 실습 9
    $("#moving_button").click(function() {
        if ($("#moving_box").width() <= $("#animation_test").width() - 50) {
            $("#moving_box").animate({
                right:"0px",
                height: "+=50px",
                width: "+=50px"
            });
            $("#animation_test").animate({height: "+=50px"});
        }
    })

    // 실습 10
    // #note_form 보여주고 지우기에 effect 추가
    // show() and hide()
    // fadeIn() and fadeOut()
    // slideDown() and slideUp()


});


// 실습 2
function max_open(event) {
    let max_window = window.open(event.data.url, "", event.data.winattributes);
    max_window.moveTo(0, 0);
    max_window.resizeTo(screen.availWidth, screen.availHeight);
}


// 실습 3
function flash() {
    $("#off_test").show().fadeOut("slow");
}

// 실습 4
function update(j) {
    let n = parseInt(j.text(), 10);
    j.text(n + 1);
}

// jquery 실습 13주차
$(function() {
    $(".accordion").each(function() {
        let dl = $(this);
        let alldd = dl.find("dd");
        let alldt = dl.find("dt");
        alldd.hide();
        alldt.css("cursor", "pointer");

        alldt.click(function() {
            alldt.css("cursor", "pointer");
            alldd.slideUp("slow");
            $(this).next().slideDown("slow");
            $(this).css("cursor", "default");
        });


    })
})