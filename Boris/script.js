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
    const authModal = document.getElementById("authModal");
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

    const summaryContainer = document.querySelector('.summary');
    const chatSectionsContainer = document.querySelector('.chat-sections');

    function formatAspectTitle(aspectKey) {
        return aspectKey
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    function createChatSection(aspectKey) {
        if (!chatSectionsContainer) return null;
        const key = aspectKey.trim().toUpperCase();

        if (chatSectionsContainer.querySelector(`.chat-section[data-aspect="${key}"]`)) {
            return null;
        }

        const section = document.createElement('div');
        section.className = 'chat-section';
        section.dataset.aspect = key;

        const titleWrapper = document.createElement('div');
        titleWrapper.className = 'title-wrapper';
        const title = document.createElement('h2');
        title.className = 'chat-title';
        title.textContent = formatAspectTitle(key);
        titleWrapper.appendChild(title);

        const messages = document.createElement('div');
        messages.className = 'messages';

        const inputContainer = document.createElement('div');
        inputContainer.className = 'input-container';
        inputContainer.innerHTML = `
            <div class="input-row">
                <input type="text" class="chat-input" placeholder="Enter a message...">
                <button type="button" class="reason-toggle-btn">Add reason</button>
                <button type="button" class="chat-send">Send</button>
            </div>
            <div class="reason-container">
                <input type="text" class="reason-input" placeholder="Reason for disagreeing...">
            </div>
        `;

        section.append(titleWrapper, messages, inputContainer);
        chatSectionsContainer.appendChild(section);
        addChatSubmitHandlersToSection(section);

        return section;
    }

    function addChatSubmitHandlersToSection(section) {
        if (section.dataset.handled === 'true') return;

        const input = section.querySelector('.chat-input');
        const button = section.querySelector('.chat-send');
        const reasonToggle = section.querySelector('.reason-toggle-btn');
        const reasonContainer = section.querySelector('.reason-container');
        const reasonInput = section.querySelector('.reason-input');
        const inputContainer = section.querySelector('.input-container');

        if (!input || !button || !reasonToggle || !reasonContainer || !reasonInput || !inputContainer) return;

        inputContainer.classList.remove("visible");
        reasonContainer.style.display = 'none';
        reasonToggle.textContent = 'Add reason';

        function toggleReason() {
            const isHidden = reasonContainer.style.display === 'none' || reasonContainer.style.display === '';
            if (isHidden) {
                reasonContainer.style.display = 'block';
                reasonToggle.textContent = 'Remove reason';
                reasonInput.focus();
            } else {
                reasonContainer.style.display = 'none';
                reasonToggle.textContent = 'Add reason';
                reasonInput.value = '';
            }
        }

        function escapeHtml(str) {
            return str.replace(/[&<>"]+/g, function (match) {
                const escape = {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;'
                };
                return escape[match];
            });
        }

        function sendMessage() {
            const text = input.value.trim();
            const reason = reasonInput.value.trim();

            if (!text) {
                alert('Please fill out the message input as well.');
                return;
            }

            const message = document.createElement('div');
            message.classList.add('message', 'message-sent');

            const safeText = escapeHtml(text);
            const safeReason = escapeHtml(reason);
            message.innerHTML = `<p class="message-text">Suggestion: <b>${safeText}</b></p>` +
                (safeReason ? `<div class="reason-block"><span class="reason-arrow">→</span><p class="reason-text">Reason: <b>${safeReason}</b></p></div>` : '');

            section.insertBefore(message, inputContainer);
            input.value = '';
            reasonInput.value = '';
            reasonContainer.style.display = 'none';
            reasonToggle.textContent = 'Add reason';
            inputContainer.classList.remove('visible');
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        button.addEventListener('click', sendMessage);
        input.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                event.preventDefault();
                sendMessage();
            }
        });
        reasonToggle.addEventListener('click', toggleReason);

        section.dataset.handled = 'true';
    }

    function addChatSubmitHandlers() {
        const chatSections = document.querySelectorAll(".chat-section:not([data-handled])");
        chatSections.forEach(addChatSubmitHandlersToSection);
    }

    function initializeChatSections() {
        if (!chatSectionsContainer || !summaryContainer) return;
        chatSectionsContainer.innerHTML = "";
        Array.from(summaryContainer.querySelectorAll('.aspect')).forEach(aspect => {
            const aspectKey = aspect.querySelector('.aspect-key')?.textContent.trim() || '';
            if (aspectKey) {
                createChatSection(aspectKey);
            }
        });
    }

    function showChatInputForAspect(aspectKey) {
        const normalizedKey = aspectKey.trim().toUpperCase();
        let section = Array.from(document.querySelectorAll('.chat-section')).find(sec => sec.dataset.aspect === normalizedKey);
        if (!section) {
            section = createChatSection(normalizedKey);
        }
        if (!section) return null;

        const inputContainer = section.querySelector('.input-container');
        const input = section.querySelector('.chat-input');
        const reasonContainer = section.querySelector('.reason-container');
        const reasonToggle = section.querySelector('.reason-toggle-btn');
        const reasonInput = section.querySelector('.reason-input');

        if (inputContainer && input) {
            inputContainer.classList.add('visible');
            if (reasonContainer) {
                reasonContainer.style.display = 'none';
            }
            if (reasonToggle) {
                reasonToggle.textContent = 'Add reason';
            }
            if (reasonInput) {
                reasonInput.value = '';
            }
            input.focus({ preventScroll: true });
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        return { section, inputContainer, input };
    }

    function decrementAspectScore(scoreSpan) {
        const [numText, denom] = scoreSpan.textContent.split('/');
        let num = parseInt(numText) || 0;
        if (num > 0) {
            num -= 1;
        }
        scoreSpan.textContent = `${num}/${denom || '4'}`;
    }

    initializeChatSections();
    addChatSubmitHandlers();

    const ALL_ASPECTS = {
        "PLACE": "📍",
        "DATE": "📅",
        "BUDGET": "💵",
        "ACTIVITY": "🎲",
        "TRANSPORT": "🚂",
        "FOOD": "🍔",
        "TIME": "⏰",
        "DRESS CODE": "👗"
    };

    const addAspectBtn = document.querySelector('.add-aspect');
    const aspectModal = document.getElementById('aspectModal');
    const cancelBtn = document.getElementById('cancelAspectBtn');
    const submitBtn = document.getElementById('submitAspectBtn');
    const aspectSelect = document.getElementById('aspectSelect');
    const customAspectField = document.getElementById('customAspectField');
    const customAspectNameInput = document.getElementById('customAspectName');
    const aspectValueInput = document.getElementById('aspectValue');

    addAspectBtn.addEventListener('click', () => {
        populateDropdown();
        aspectValueInput.value = '';
        customAspectNameInput.value = '';
        customAspectField.style.display = 'none';
        aspectModal.classList.add('active');
    });

    cancelBtn.addEventListener('click', () => {
        aspectModal.classList.remove('active');
    });

    function populateDropdown() {
        aspectSelect.innerHTML = '';
        
        const existingKeys = Array.from(document.querySelectorAll('.aspect-key'))
                                  .map(el => el.textContent.trim().toUpperCase());
        for (const [key, emoji] of Object.entries(ALL_ASPECTS )) {
            if (!existingKeys.includes(key)) {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = `${emoji} ${key.charAt(0) + key.slice(1).toLowerCase()}`;
                aspectSelect.appendChild(option);
            }
        }

        const customOption = document.createElement('option');
        customOption.value = "CUSTOM";
        customOption.textContent = "⭐ Custom";
        aspectSelect.appendChild(customOption);
        aspectSelect.dispatchEvent(new Event('change'));
    }

    aspectSelect.addEventListener('change', (e) => {
        if (e.target.value === "CUSTOM") {
            customAspectField.style.display = 'flex';
        } else {
            customAspectField.style.display = 'none';
        }
    });

    submitBtn.addEventListener('click', () => {
        let aspectKey = aspectSelect.value;
        let aspectEmoji = ALL_ASPECTS[aspectKey] || "⭐"; 
        
        if (aspectKey === "CUSTOM") {
            aspectKey = customAspectNameInput.value.trim().toUpperCase();
            if (!aspectKey) {
                alert("Please enter a name for the custom aspect.");
                return;
            }
            aspectEmoji = "⭐";
        }

        const aspectValue = aspectValueInput.value.trim();
        if (!aspectValue) {
            alert("Please enter a value for the aspect.");
            return;
        }

        const newAspectHTML = `
            <div class="aspect">
                <div class="aspect-icon">${aspectEmoji}</div>
                <div class="aspect-content">
                    <p class="aspect-key">${aspectKey}</p>
                    <p class="aspect-value">${aspectValue}</p>
                </div>
                <div class="aspect-actions">
                    <span class="aspect-score">0/4</span>
                    <button class="aspect-btn agree-btn">✓</button>
                    <button class="aspect-btn disagree-btn">✕</button>
                </div>
            </div>
        `;

        summaryContainer.insertAdjacentHTML('beforeend', newAspectHTML);
        createChatSection(aspectKey);
        aspectModal.classList.remove('active');
    });


    const summaryBadge = document.querySelector('.summary-badge');
    const agreeAllBtn = document.querySelector('.agree-all-btn');
    let userIsAllIn = false;

    function incrementFraction(text) {
        let [num, denom] = text.split('/');
        num = parseInt(num) + 1;
        return `${num}/${denom}`;
    }


    function decrementAspectScore(scoreSpan) {
        const [numText, denom] = scoreSpan.textContent.split('/');
        let num = parseInt(numText) || 0;
        if (num > 0) {
            num -= 1;
        }
        scoreSpan.textContent = `${num}/${denom || '4'}`;
    }

    summaryContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('agree-btn') && !e.target.classList.contains('voted')) {
            agreeWithAspect(e.target);
            return;
        }

        if (e.target.classList.contains('disagree-btn')) {
            const aspectRow = e.target.closest('.aspect');
            if (!aspectRow) return;

            const aspectKey = aspectRow.querySelector('.aspect-key')?.textContent.trim().toUpperCase();
            const scoreSpan = aspectRow.querySelector('.aspect-score');
            const agreeBtn = aspectRow.querySelector('.agree-btn');

            if (agreeBtn && agreeBtn.classList.contains('voted')) {
                agreeBtn.classList.remove('voted');
                if (scoreSpan) decrementAspectScore(scoreSpan);
            }

            showChatInputForAspect(aspectKey);
        }
    });

    function agreeWithAspect(btn) {
        btn.classList.add('voted');
        const scoreSpan = btn.parentElement.querySelector('.aspect-score');
        scoreSpan.textContent = incrementFraction(scoreSpan.textContent);
        checkAllInStatus();
    }

    agreeAllBtn.addEventListener('click', () => {
        const unvotedBtns = document.querySelectorAll('.agree-btn:not(.voted)');
        unvotedBtns.forEach(btn => {
            agreeWithAspect(btn);
        });
    });

    function checkAllInStatus() {
        if (userIsAllIn) return;
        const allAspects = document.querySelectorAll('.aspect');
        const votedAspects = document.querySelectorAll('.agree-btn.voted');
        if (allAspects.length > 0 && allAspects.length === votedAspects.length) {
            userIsAllIn = true;
            let badgeText = summaryBadge.textContent;
            let parts = badgeText.split(' ');
            parts[0] = incrementFraction(parts[0]); 
            summaryBadge.textContent = parts.join(' ');
        }
    }
});
