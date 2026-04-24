document.addEventListener("DOMContentLoaded", function () {
    // 1. ЕЛЕМЕНТИ ЗА НАВИГАЦИЯ
    const navLinks = document.querySelectorAll(".nav a");
    const sections = {
        Home: document.getElementById("Home"),
        Search: document.getElementById("Search"),
        Profile: document.getElementById("Profile"),
        Ideas: document.getElementById("Ideas")
    };

    // 2. ЕЛЕМЕНТИ ЗА МОДАЛ (SIGN UP)
    const modal = document.getElementById("authModal");
    const signUpBtn = document.getElementById("SignUp");
    const closeBtn = document.querySelector(".close-btn");

    // --- ЛОГИКА ЗА СЕКЦИИТЕ (Home, Search, Profile, Ideas) ---
    function setActive(link) {
        navLinks.forEach(a => a.classList.remove("active"));
        if (link) link.classList.add("active");
    }

    function showSection(sectionName) {
        Object.values(sections).forEach(sec => {
            if (sec) sec.classList.add("hidden");
        });

        if (sections[sectionName]) {
            sections[sectionName].classList.remove("hidden");
        }
    }

    function getSectionFromHash() {
        const hash = window.location.hash.toLowerCase();
        if (hash === "#search") return "Search";
        if (hash === "#profile") return "Profile";
        if (hash === "#ideas") return "Ideas";
        return "Home";
    }

    function goToSection(sectionName) {
        showSection(sectionName);
        const link = document.querySelector(`.nav a[data-page="${sectionName}"]`);
        setActive(link);

        if (sectionName === "Home") {
            history.pushState(null, "", "index.html");
        } else {
            history.pushState(null, "", `#${sectionName.toLowerCase()}`);
        }
    }

    // Слушатели за навигацията
    navLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            const pageName = this.dataset.page;
            if (sections[pageName]) {
                event.preventDefault();
                goToSection(pageName);
            }
        });
    });
});
