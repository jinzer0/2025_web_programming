$(document).ready(function () {
    const maxProfiles = 3;
    let isDeleteMode = false;

    function loadProfiles() {
        const profiles = profileManager.getAllProfiles();
        const $container = $('#profile-item-container');
        $container.empty();

        for (let i = 0; i < maxProfiles; i++) {
            if (profiles[i]) {
                $container.append(`
                    <button class="profile-item" data-index="${i}">
                        ${profiles[i].name}
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
        const profiles = profileManager.getAllProfiles();

        if (profiles.length >= maxProfiles) {
            alert("최대 3개의 프로필만 생성할 수 있습니다.");
            return;
        }

        const name = prompt("새 프로필 이름을 입력하세요:");
        if (name && name.trim()) {
            const created = profileManager.createProfile(name.trim());
            if (!created) {
                alert("이미 존재하는 이름입니다.");
            }
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
        const profiles = profileManager.getAllProfiles();
        const selected = profiles[index];

        if (!selected) return;

        if (isDeleteMode) {
            if (confirm(`"${selected.name}" 프로필을 삭제할까요?`)) {
                profileManager.deleteProfile(selected.name);
                loadProfiles();
                isDeleteMode = false;
                updateDeleteModeStyle();
            }
        } else if (!$(this).hasClass('empty')) {
            profileManager.setCurrentProfile(selected.name);
            window.location.href = "level.html";
        }
    });

    loadProfiles();
});