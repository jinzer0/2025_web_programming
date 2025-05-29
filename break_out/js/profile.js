$(document).ready(function () {
    const maxProfiles = 3;
    let isDeleteMode = false;

    function loadProfiles() {
        const profiles = JSON.parse(localStorage.getItem("profiles")) || [];
        const $container = $('#profile-item-container');
        $container.empty();

        for (let i = 0; i < maxProfiles; i++) {
            if (profiles[i]) {
                $container.append(`
                    <button class="profile-item" data-index="${i}">
                        ${profiles[i]}
                    </button>
                `);
            } else {
                $container.append(`
                    <button class="profile-item empty" data-index="${i}">
                        Empty
                    </button>
                `);
            }
        }

        updateDeleteModeStyle();
    }

    function saveProfiles(profiles) {
        localStorage.setItem("profiles", JSON.stringify(profiles));
    }

    function updateDeleteModeStyle() {
        const $deleteButton = $('.menu-item:contains("Delete Profile")');

        if (isDeleteMode) {
            $('.profile-item').not('.empty').addClass('delete-mode');
            $deleteButton.addClass('delete-active');
        } else {
            $('.profile-item').removeClass('delete-mode');
            $deleteButton.removeClass('delete-active');
        }
    }

    // 프로필 생성
    $('.menu-item:contains("Create New Profile")').on('click', function () {
        const profiles = JSON.parse(localStorage.getItem("profiles")) || [];

        if (profiles.length >= maxProfiles) {
            alert("최대 3개의 프로필만 생성할 수 있습니다.");
            return;
        }

        const name = prompt("새 프로필 이름을 입력하세요:");
        if (name && name.trim()) {
            profiles.push(name.trim());
            saveProfiles(profiles);
            loadProfiles();
        }
    });

    // 삭제 모드 토글
    $('.menu-item:contains("Delete Profile")').on('click', function () {
        isDeleteMode = !isDeleteMode;
        updateDeleteModeStyle();
    });

    // 프로필 클릭 시
    $('#profile-item-container').on('click', '.profile-item', function () {
        const index = $(this).data('index');
        const profiles = JSON.parse(localStorage.getItem("profiles")) || [];

        if (isDeleteMode && profiles[index]) {
            if (confirm(`"${profiles[index]}" 프로필을 삭제할까요?`)) {
                profiles.splice(index, 1);
                saveProfiles(profiles);
                loadProfiles();
                isDeleteMode = false;
                updateDeleteModeStyle();
            }
        } else if (!$(this).hasClass('empty')) {
            // 선택한 프로필 이름 저장
            localStorage.setItem("selectedProfile", profiles[index]);
            // level.html로 이동
            window.location.href = "level.html";
        }
    });

    loadProfiles();
});
