$(document).ready(function() {
    $('.menu-item').on('click', function() {
        let temp = $('.setting-detail');
        temp.each(function () {
            $(this).removeClass('popup').hide();
        })
        let type = $(this).attr('id');
        switch(type) {
            case 'special-item':
                $('#special-item-setting').addClass('popup').fadeIn(300);
                break;
            case 'background-image':
                $('#background-image-setting').addClass('popup').fadeIn(300);
                break;
            case 'paddle':
                $('#paddle-setting').addClass('popup').fadeIn(300);
                break;
            case 'music':
                $('#music-setting').addClass('popup').fadeIn(300);
                break;
            case 'control':
                $('#control-setting').addClass('popup').fadeIn(300);
                break;
            case 'reset':
                $('#reset-confirm').addClass('popup').fadeIn(300);
                break;
        }
    });
    $('#special-on').on('click', function() {
        localStorage.setItem("usespecialitem", "true");
        $('#special-status').text("스페셜 아이템이 활성화되었습니다.");
    });

    // Special Item Off
    $('#special-off').on('click', function() {
        localStorage.setItem("usespecialitem", "false");
        $('#special-status').text("스페셜 아이템이 비활성화되었습니다.");
    });

    // 설정 화면 진입 시 상태 반영
    if (localStorage.getItem("usespecialitem") === "true") {
        $('#special-status').text("스페셜 아이템이 활성화되어 있습니다.");
    } else if (localStorage.getItem("usespecialitem") === "false") {
        $('#special-status').text("스페셜 아이템이 비활성화되어 있습니다.");
    } else {
        $('#special-status').text("스페셜 아이템이 비활성화되어 있습니다.");
    }

    $('.bg-option').on('click', function () {
        // 모든 선택 해제
        $('.bg-option').removeClass('selected');

        // 현재 선택
        $(this).addClass('selected');

        // 경로 저장
        let selected = $(this).data("id");
        localStorage.setItem('backgroundImage', selected);
    });

    // 페이지 열릴 때 이미 선택된 배경 있으면 표시
    let savedBackground = localStorage.getItem('backgroundImage');
    if (savedBackground) {
        $(`.bg-option[src="${savedBackground}"]`).addClass('selected');
    }

    // 불투명도 슬라이더 이벤트
    $('#opacity-slider').on('input', function () {
        const opacity = parseFloat($(this).val()).toFixed(1);
        localStorage.setItem('backgroundOpacity', opacity);
        $('#opacity-value').text(`현재: ${opacity}`);
    });

    // 페이지 진입 시 저장된 불투명도 값 적용
    const savedOpacity = localStorage.getItem('backgroundOpacity');
    if (savedOpacity) {
        $('#opacity-slider').val(savedOpacity);
        $('#opacity-value').text(`현재: ${savedOpacity}`);
    }

    $('.paddle-option').on('click', function () {
        $('.paddle-option').removeClass('selected');
        $(this).addClass('selected');
        let selected = $(this).data('id');
        localStorage.setItem('selectedPaddle', selected);
        $('#paddle-status').text(`선택한 패들: ${selected}`);
    });

    // Ball 선택
    $('.ball-option').on('click', function () {
        $('.ball-option').removeClass('selected');
        $(this).addClass('selected');
        let selected = $(this).data('id');
        localStorage.setItem('selectedBall', selected);
        $('#ball-status').text(`선택한 공: ${selected}`);
    });

    // Brick 선택
    $('.brick-option').on('click', function () {
        $('.brick-option').removeClass('selected');
        $(this).addClass('selected');
        let selected = $(this).data('id');
        localStorage.setItem('selectedBrick', selected);
        $('#brick-status').text(`선택한 벽돌: ${selected}`);
    });

    // 저장된 선택 표시
    let savedPaddle = localStorage.getItem('selectedPaddle');
    if (savedPaddle) {
        $(`.paddle-option[data-id="${savedPaddle}"]`).addClass('selected');
        $('#paddle-status').text(`선택한 패들: ${savedPaddle}`);
    }

    let savedBall = localStorage.getItem('selectedBall');
    if (savedBall) {
        $(`.ball-option[data-id="${savedBall}"]`).addClass('selected');
        $('#ball-status').text(`선택한 공: ${savedBall}`);
    }

    let savedBrick = localStorage.getItem('selectedBrick');
    if (savedBrick) {
        $(`.brick-option[data-id="${savedBrick}"]`).addClass('selected');
        $('#brick-status').text(`선택한 벽돌: ${savedBrick}`);
    }

    // 음악 선택 처리
    $('.music-option').on('click', function () {
        $('.music-option').removeClass('selected');
        $(this).addClass('selected');
        let selectedMusic = $(this).data('id');
        localStorage.setItem('selectedMusic', selectedMusic);
    });

    // 저장된 음악 표시
    let savedMusic = localStorage.getItem('selectedMusic');
    if (savedMusic) {
        $(`.music-option[data-id="${savedMusic}"]`).addClass('selected');

        let musicName = '';
        switch (savedMusic) {
            case 'chill': musicName = 'Chill Vibes'; break;
            case 'action': musicName = 'Action Chase'; break;
            case 'retro': musicName = 'Retro Arcade'; break;
            case 'none': musicName = '음악 없음'; break;
        }

        $('#music-status').text(`선택한 음악: ${musicName}`);
    }

    $('#volume-slider').on('input', function () {
        const volume = parseFloat($(this).val()).toFixed(1);
        localStorage.setItem('musicVolume', volume);
        $('#volume-value').text(`현재: ${volume}`);
    });

    const savedVolume = localStorage.getItem('musicVolume');
    if (savedOpacity) {
        $('#volume-slider').val(savedVolume);
        $('#volume-value').text(`현재: ${savedVolume}`);
    }

    // 컨트롤 방식 선택
    $('.control-option').on('click', function () {
        $('.control-option').removeClass('selected');
        $(this).addClass('selected');

        let selectedControl = $(this).data('id');
        localStorage.setItem('controlMethod', selectedControl);

        let label = selectedControl === 'mouse' ? '마우스' : '키보드';
        $('#control-status').text(`선택한 조작 방식: ${label}`);
    });

    // 저장된 컨트롤 방식 표시
    let savedControl = localStorage.getItem('controlMethod');
    if (savedControl) {
        $(`.control-option[data-id="${savedControl}"]`).addClass('selected');

        let label = savedControl === 'mouse' ? '마우스' : '키보드';
        $('#control-status').text(`선택한 조작 방식: ${label}`);
    }

    $('#reset-button').on('click', function () {
        let confirmed = window.confirm("정말 리셋하시겠습니까?");
        if (confirmed) {
            localStorage.clear();
            alert("게임 데이터가 초기화되었습니다.");
            location.reload();  // 필요시 페이지 새로고침
        }
    });
});