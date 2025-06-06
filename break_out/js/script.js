$(() => {
    $(".to-menu-button").click(function() {
        if ($(this).text().toLowerCase() === "back to menu") open("home.html", "_self");
    });

    $(".skip-button").click(() => {
        window.open("game.html", "_self");
    });
});

function stringTime(unix_time) { // return string "HH:MM:SS"
    const elapsedTime = Math.floor(unix_time / 1000);
    const hours = String(Math.floor(elapsedTime / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((elapsedTime % 3600) / 60)).padStart(2, '0');
    const seconds = String(elapsedTime % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

function parseTime(string_time) { // return number of milliseconds
    const [hours, minutes, seconds] = string_time.split(':').map(Number);
    return (hours * 3600 + minutes * 60 + seconds) * 1000;
}

const LEVEL = {
    EASY: 0,
    NORMAL: 1,
    HARD: 2,
    IMPOSSIBLE: 3,
};



class ProfileManager {
    constructor() {
        this.storageKey = "profiles";
        this.currentProfileKey = "current_profile";
    }
    getAllProfiles() {
        const profiles = localStorage.getItem(this.storageKey);
        return profiles ? JSON.parse(profiles) : [];
    }

    saveProfiles(profiles) {
        localStorage.setItem(this.storageKey, JSON.stringify(profiles));
        return true;
    }

    createProfile(name) {
        let profiles = this.getAllProfiles();

        if (profiles.some(p => p.name === name)) {
            // 이름 중복 체크, 아이디가 없어 이름 중복 허용 안됨
            return null;
        }

        const newProfile = {
            name: name,
            level_progress: {
                0: { unlocked: true, completed: false },
                1: { unlocked: false, completed: false },
                2: { unlocked: false, completed: false },
                3: { unlocked: false, completed: false }
            },
            preferences: {
                special_item: true,
                background_image: "img/background1.jpg",
                background_opacity: 0.8,
                paddle_image: "../img/bat.jpg",
                ball_image: "../img/ball.jpg",
                brick_image: "../img/gold.jpg",
                music: "../audio/1.mp3",
                control: "mouse",
            },
            highest_score: 0,
            longest_survived_time: 0,
            average_survived_time: 0,
            current_level: 0,
            total_play_count: 0,
        };

        profiles.push(newProfile);
        this.saveProfiles(profiles);
        return newProfile;
    }

    getProfile(name) {
        const profiles = this.getAllProfiles();
        return profiles.find(p => p.name === name) || null;
    }

    updateProfile(name, updates) {
        const profiles = this.getAllProfiles();
        const profileIndex = profiles.findIndex(p => p.name === name);

        if (profileIndex === -1) {
            return null;
        }

        profiles[profileIndex] = { ...profiles[profileIndex], ...updates };
        this.saveProfiles(profiles);
        return profiles[profileIndex];
    }

    deleteProfile(name) {
        const profiles = this.getAllProfiles();
        const filteredProfiles = profiles.filter(p => p.name !== name);

        if (profiles.length === filteredProfiles.length) {
            return false;
        }

        this.saveProfiles(filteredProfiles);

        if (this.getCurrentProfileName() === name) {
            this.setCurrentProfile(null);
        }

        return true;
    }

    setCurrentProfile(name) {
        if (name && !this.getProfile(name)) {
            console.log("current profile does not exist");
            return;
        }
        localStorage.setItem(this.currentProfileKey, name || '');
    }

    getCurrentProfileName() {
        return localStorage.getItem(this.currentProfileKey) || null;
    }

    getCurrentProfile() {
        const name = this.getCurrentProfileName();
        return name ? this.getProfile(name) : null;
    }
}

const profileManager = new ProfileManager();