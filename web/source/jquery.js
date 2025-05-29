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



    // ajax 실습 1
    $("#getText2").on("click", function() {
        $("#textbox").text("글자 입력 테스트");
        /*
        let req = $.ajax("data.json");
        
        or

        let req = $.ajax("data.txt");
        let data_json = JSON.parse(data);

        or

        let req = $.ajax({url: "data.txt", dataType: "json"});
        */
        let req = $.ajax({
            url: "data.txt",
            dataType: "json"
        });
        req.done(function(data, status) {
            let table = $("<table/>");
            let head = $("<tr/>").append($("<th/>").text("이름")).append($("<th/>").text("아이디")).append($("<th/>").text("학과")).append($("<th/>").text("수강과목"));
            table.append(head);
            for (let i = 0; i < data.length; i++) {
                let name = $("<td/>").text(data[i]["name"]);
                let id = $("<td/>").text(data[i]["id"]);
                let department = $("<td/>").text(data[i]["department"]);
                let cl = $("<td/>").text(data[i]["class"].join(", "));
                let tr = $("<tr/>").append(name).append(id).append(department).append(cl);
                table.append(tr);
            }
            $("#textbox").append(table);
        });
    });

    $("#getText1").on("click", function() {
        $("#textbox").text("글자 입력 테스트");
        /*
        let req = $.ajax("data.json");
        
        or

        let req = $.ajax("data.txt");
        let data_json = JSON.parse(data);

        or

        let req = $.ajax({url: "data.txt", dataType: "json"});
        */
        $("#textbox").append("<br>");
        let req = $.ajax({
            url: "data.txt",
            dataType: "json"
        });
        req.done(function(data, status) {
            for(let i = 0; i < data.length; i++) {
                $("#textbox").append(data[i]["name"] + "<br>");
            }
        });
    });

    // ajax 실습 2
    let res = $.ajax({
        url: "/rss",
        dataType: "xml"
    })
    .done(function(data) {
        let items = $(data).find("entry");
        if (items.length > 0) {
            items = items.slice(0, 5);
            let uTag = $("<ul/>");
            items.each(function() {
                let lTag = $("<li/>");
                let aTag = $("<a/>");
                let item = $(this);
                aTag.attr({
                    "href": item.find("link").attr("href"),
                    "target": "_blank"
                }).text(item.find("title").text());
                lTag.append(aTag);
                uTag.append(lTag);
            }
            );
            $("#news").html(uTag);
        }
    })
    .fail(function(jqXHR, textStatus) { alert("failed: " + textStatus); });


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

// 실습 슬라이드쇼
let interval = 3000;
let timer_1;
let timer_2;
let timer_3;
$(function() {
    $(".accordion").each(function() {
        let dl = $(this);
        let alldd = dl.find("dd");
        let alldt = dl.find("dt");

        function closeAll() {
            alldd.addClass("closed");
            alldt.addClass("closed");
        }

        function open(dt, dd) {
            dt.removeClass("closed");
            dd.removeClass("closed");
        }
        closeAll();
        alldt.click(function() {
            let dt = $(this);
            let dd = dt.next();
            closeAll();
            open(dt, dd);
        })


    });

    // 실습 슬라이드 쇼
    $(".slideshow:nth-of-type(1)").each(function() {
        let container = $(this);
        function switchImg() {
            let imgs = container.find("img");
            let first = imgs.eq(0);
            let second = imgs.eq(1);
            first.appendTo(container).fadeOut(2000);
            second.fadeIn();
        }
        function startTimer() {timer_1 = setInterval(switchImg, interval);}
        function stopTimer() {clearInterval(timer_1);}
        container.mouseenter(stopTimer);
        container.mouseleave(startTimer);
        startTimer();
    });

    $(".slideshow:nth-of-type(2)").each(function() {
        let container = $(this);
        function switchImg() {
            let imgs = container.find("img");
            let first = imgs.eq(0);
            let second = imgs.eq(1);
            first.appendTo(container).fadeOut(2000);
            second.fadeIn();
        }
        function startTimer() {timer_2 = setInterval(switchImg, interval);}
        function stopTimer() {clearInterval(timer_2);}
        container.mouseenter(stopTimer);
        container.mouseleave(startTimer);
        startTimer();
    });

    $(".slideshow:nth-of-type(3)").each(function() {
        let container = $(this);
        function switchImg() {
            let imgs = container.find("img");
            let first = imgs.eq(0);
            let second = imgs.eq(1);
            first.appendTo(container).fadeOut(2000);
            second.fadeIn();
        }
        function startTimer() {timer_3 = setInterval(switchImg, interval);}
        function stopTimer() {clearInterval(timer_3);}
        container.mouseenter(stopTimer);
        container.mouseleave(startTimer);
        startTimer();
    });
});


