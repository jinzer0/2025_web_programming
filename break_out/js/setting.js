$(document).ready(function() {
    localStorage.removeItem("isSettingMode");
    let profile = profileManager.getCurrentProfile();
    let preferences = profile ? profile["preferences"] : {};
    console.log(`preferences:`, preferences);
    $('.menu-item').on('click', function() {
        let temp = $('.setting-detail');
        temp.each(function() {
            $(this).removeClass('popup').hide();
        })
        let type = $(this).attr('id');
        switch (type) {
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
        preferences["specialItem"] = true;
        profileManager.updateProfile(profile["name"], { preferences: preferences });
        $('#special-status').text("스페셜 아이템이 활성화되었습니다.");
    });

    // Special Item Off
    $('#special-off').on('click', function() {
        preferences["specialItem"] = false;
        profileManager.updateProfile(profile["name"], { preferences: preferences });
        $('#special-status').text("스페셜 아이템이 비활성화되었습니다.");
    });

    // 설정 화면 진입 시 상태 반영
    if (preferences["specialItem"]) $('#special-status').text("스페셜 아이템이 활성화되어 있습니다.");
    else $('#special-status').text("스페셜 아이템이 비활성화되어 있습니다.");


    $('.bg-option').on('click', function() {
        // 모든 선택 해제
        $('.bg-option').removeClass('selected');

        // 현재 선택
        $(this).addClass('selected');

        // 경로 저장
        let selected = $(this).data("id");
        preferences["backgroundImage"] = selected;
        profileManager.updateProfile(profile["name"], { preferences: preferences });

    });

    // 페이지 열릴 때 이미 선택된 배경 있으면 표시
    let savedBackground = preferences["backgroundImage"];
    if (savedBackground) {
        $(`.bg-option[data-id="${savedBackground}"]`).addClass('selected');
    }

    // 불투명도 슬라이더 이벤트
    $('#opacity-slider').on('input', function() {
        const opacity = parseFloat($(this).val()).toFixed(1);
        preferences["backgroundOpacity"] = opacity;
        profileManager.updateProfile(profile["name"], { preferences: preferences });
        $('#opacity-value').text(`현재: ${opacity}`);
    });

    // 페이지 진입 시 저장된 불투명도 값 적용
    const savedOpacity = preferences["backgroundOpacity"];
    if (savedOpacity) {
        $('#opacity-slider').val(savedOpacity);
        $('#opacity-value').text(`현재: ${savedOpacity}`);
    }

    $('.paddle-option').on('click', function() {
        $('.paddle-option').removeClass('selected');
        $(this).addClass('selected');
        let selected = $(this).data('id');
        preferences["selectedPaddle"] = selected;
        profileManager.updateProfile(profile["name"], { preferences: preferences });
        $('#paddle-status').text(`선택한 패들: ${selected}`);
    });

    // Ball 선택
    $('.ball-option').on('click', function() {
        $('.ball-option').removeClass('selected');
        $(this).addClass('selected');
        let selected = $(this).data('id');
        preferences["selectedBall"] = selected;
        profileManager.updateProfile(profile["name"], { preferences: preferences });
        $('#ball-status').text(`선택한 공: ${selected}`);
    });

    // Brick 선택
    $('.brick-option').on('click', function() {
        $('.brick-option').removeClass('selected');
        $(this).addClass('selected');
        let selected = $(this).data('id');
        preferences["selectedBrick"] = selected;
        profileManager.updateProfile(profile["name"], { preferences: preferences });
        $('#brick-status').text(`선택한 벽돌: ${selected}`);
    });

    // 저장된 선택 표시
    let savedPaddle = preferences["selectedPaddle"];
    if (savedPaddle) {
        $(`.paddle-option[data-id="${savedPaddle}"]`).addClass('selected');
        $('#paddle-status').text(`선택한 패들: ${savedPaddle}`);
    }

    let savedBall = preferences["selectedBall"];
    if (savedBall) {
        $(`.ball-option[data-id="${savedBall}"]`).addClass('selected');
        $('#ball-status').text(`선택한 공: ${savedBall}`);
    }

    let savedBrick = preferences["selectedBrick"];
    if (savedBrick) {
        $(`.brick-option[data-id="${savedBrick}"]`).addClass('selected');
        $('#brick-status').text(`선택한 벽돌: ${savedBrick}`);
    }

    // 음악 선택 처리
    $('.music-option').on('click', function() {
        $('.music-option').removeClass('selected');
        $(this).addClass('selected');
        let selectedMusic = $(this).data('id');
        preferences["selectedMusic"] = selectedMusic;
        profileManager.updateProfile(profile["name"], { preferences: preferences });
    });

    // 저장된 음악 표시
    let savedMusic = preferences["selectedMusic"];
    if (savedMusic) {
        $(`.music-option[data-id="${savedMusic}"]`).addClass('selected');

        let musicName = '';
        switch (savedMusic) {
            case 'chill':
                musicName = 'Chill Vibes';
                break;
            case 'action':
                musicName = 'Action Chase';
                break;
            case 'retro':
                musicName = 'Retro Arcade';
                break;
            case 'none':
                musicName = '음악 없음';
                break;
        }

        $('#music-status').text(`선택한 음악: ${musicName}`);
    }

    $('#volume-slider').on('input', function() {
        const volume = parseFloat($(this).val()).toFixed(1);
        preferences["musicVolume"] = volume;
        profileManager.updateProfile(profile["name"], { preferences: preferences });
        $('#volume-value').text(`현재: ${volume}`);
    });

    const savedVolume = preferences["musicVolume"];
    if (savedOpacity) {
        $('#volume-slider').val(savedVolume);
        $('#volume-value').text(`현재: ${savedVolume}`);
    }

    // 컨트롤 방식 선택
    $('.control-option').on('click', function() {
        $('.control-option').removeClass('selected');
        $(this).addClass('selected');

        let selectedControl = $(this).data('id');
        preferences["controlMethod"] = selectedControl;
        profileManager.updateProfile(profile["name"], { preferences: preferences });
        let label = selectedControl === 'mouse' ? '마우스' : '키보드';
        $('#control-status').text(`선택한 조작 방식: ${label}`);
    });

    // 저장된 컨트롤 방식 표시
    let savedControl = preferences["controlMethod"];
    if (savedControl) {
        $(`.control-option[data-id="${savedControl}"]`).addClass('selected');

        let label = savedControl === 'mouse' ? '마우스' : '키보드';
        $('#control-status').text(`선택한 조작 방식: ${label}`);
    }

    $('#reset-button').on('click', function() {
        let confirmed = window.confirm("정말 모든 프로필과 설정을 리셋하시겠습니까?");
        if (confirmed) {
            localStorage.clear();
            alert("게임 데이터가 초기화되었습니다.");
            window.open("home.html", "_self");
        }
    });
});