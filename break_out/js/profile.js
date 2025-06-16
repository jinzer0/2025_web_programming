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
        const $createButton = $('.menu-item:contains("Create New Profile")');
        const $allProfiles = $('.profile-item');
        const $nonEmpty = $allProfiles.not('.empty');
        const $empty = $allProfiles.filter('.empty');

        if (isDeleteMode) {
            $nonEmpty.removeClass('delete-mode');
            $nonEmpty.addClass('delete-mode');
            $deleteButton.addClass('delete-active');

            $empty.hide(); // 빈 프로필 숨김
            $createButton.addClass('disabled'); // 새 프로필 버튼 비활성화
        } else {
            $nonEmpty.removeClass('delete-mode');
            $deleteButton.removeClass('delete-active');

            $empty.show(); // 빈 프로필 다시 표시
            $createButton.removeClass('disabled'); // 새 프로필 버튼 활성화
        }
    }

    // 프로필 생성
    function promptCreateProfile() {
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
    }

    $('.menu-item:contains("Create New Profile")').on('click', promptCreateProfile);

    // 삭제 모드 토글
    $('.menu-item:contains("Delete Profile")').on('click', function () {
        const hasProfiles = profileManager.getAllProfiles().length > 0;

        if (!hasProfiles) {
            alert("삭제할 프로필이 없습니다.");
            return;
        }

        isDeleteMode = !isDeleteMode;
        updateDeleteModeStyle();
    });

    // 프로필 클릭 시
    $('#profile-item-container').on('click', '.profile-item', function () {
        const index = $(this).data('index');
        const profiles = profileManager.getAllProfiles();
        const selected = profiles[index];

        // 삭제 모드일 때
        if (isDeleteMode) {
            if (profiles[index] && confirm(`"${profiles[index].name}" 프로필을 삭제할까요?`)) {
                profileManager.deleteProfile(profiles[index].name);
                loadProfiles();
                isDeleteMode = false;
                updateDeleteModeStyle();
            }
            return;
        }

        // 빈 슬롯 클릭 시 새 프로필 생성 제안
        if ($(this).hasClass('empty')) {
            promptCreateProfile();
            return;
        }

        // 프로필 선택
        const profileName = profiles[index].name;
        profileManager.setCurrentProfile(profileName);
        let isSettingMode = JSON.parse(localStorage.getItem("isSettingMode"));
        if (isSettingMode) window.location.href = "setting.html";
        else window.location.href = "level.html";
    });

    loadProfiles();
});