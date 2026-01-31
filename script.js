document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const levelOverlay = document.getElementById('level-overlay');
    const levelsGrid = document.getElementById('levels-grid');
    const textDisplay = document.getElementById('text-display');
    const fingerInstruction = document.getElementById('finger-instruction');
    const virtualKeyboard = document.getElementById('virtual-keyboard');
    const completionModal = document.getElementById('completion-modal');


    // Modal Elements
    const modalTitle = completionModal.querySelector('h2');
    const modalMessage = completionModal.querySelector('p');
    const modalActions = completionModal.querySelector('.modal-actions');
    const resetBtn = document.getElementById('reset-btn');

    // --- Game State ---
    let currentLevelIndex = 0;
    let currentText = "";
    let charIndex = 0;
    let errorCount = 0;
    let fingerErrors = 0;
    let startTime = null;
    let endTime = null;
    let isGameActive = false;
    let hintTimeout = null; // For fading hints

    // User Progress
    // Store IDs of levels that have been completed.
    let completedLevels = new Set(JSON.parse(localStorage.getItem('typingTutor_completedLevels') || '[]'));

    // --- Keyboard Map (Windows Standard) ---
    const KEY_MAP = {
        'q': { hand: 'left', finger: 'pinky' }, 'a': { hand: 'left', finger: 'pinky' }, 'z': { hand: 'left', finger: 'pinky' }, '1': { hand: 'left', finger: 'pinky' },
        'w': { hand: 'left', finger: 'ring' }, 's': { hand: 'left', finger: 'ring' }, 'x': { hand: 'left', finger: 'ring' }, '2': { hand: 'left', finger: 'ring' },
        'e': { hand: 'left', finger: 'middle' }, 'd': { hand: 'left', finger: 'middle' }, 'c': { hand: 'left', finger: 'middle' }, '3': { hand: 'left', finger: 'middle' },
        'r': { hand: 'left', finger: 'index' }, 'f': { hand: 'left', finger: 'index' }, 'v': { hand: 'left', finger: 'index' }, '4': { hand: 'left', finger: 'index' }, 'g': { hand: 'left', finger: 'index' }, 't': { hand: 'left', finger: 'index' }, 'b': { hand: 'left', finger: 'index' }, '5': { hand: 'left', finger: 'index' },

        'y': { hand: 'right', finger: 'index' }, 'h': { hand: 'right', finger: 'index' }, 'n': { hand: 'right', finger: 'index' }, '6': { hand: 'right', finger: 'index' }, 'u': { hand: 'right', finger: 'index' }, 'j': { hand: 'right', finger: 'index' }, 'm': { hand: 'right', finger: 'index' }, '7': { hand: 'right', finger: 'index' },
        'i': { hand: 'right', finger: 'middle' }, 'k': { hand: 'right', finger: 'middle' }, ',': { hand: 'right', finger: 'middle' }, '8': { hand: 'right', finger: 'middle' },
        'o': { hand: 'right', finger: 'ring' }, 'l': { hand: 'right', finger: 'ring' }, '.': { hand: 'right', finger: 'ring' }, '9': { hand: 'right', finger: 'ring' },
        'p': { hand: 'right', finger: 'pinky' }, ';': { hand: 'right', finger: 'pinky' }, '/': { hand: 'right', finger: 'pinky' }, '0': { hand: 'right', finger: 'pinky' },
        '[': { hand: 'right', finger: 'pinky' }, ']': { hand: 'right', finger: 'pinky' }, '\'': { hand: 'right', finger: 'pinky' }, '-': { hand: 'right', finger: 'pinky' }, '=': { hand: 'right', finger: 'pinky' },

        ' ': { hand: 'both', finger: 'thumb' }
    };

    function init() {
        renderLevelsGrid();
        renderVirtualKeyboard();

        document.addEventListener('keydown', handleKeyDown);
        resetBtn.addEventListener('click', resetProgress);
    }

    function renderLevelsGrid() {
        levelsGrid.innerHTML = '';

        // Use Global MODULES array
        window.MODULES.forEach((mod) => {
            // Module Header
            const header = document.createElement('div');
            header.className = 'module-header';
            header.innerHTML = `<h3>${mod.title}</h3><p>${mod.description}</p>`;
            levelsGrid.appendChild(header);

            // Level Buttons Container
            const gridRow = document.createElement('div');
            gridRow.className = 'module-levels';

            mod.levels.forEach((lvl, index) => {
                // Find global index in FLAT_LEVELS
                const flatIndex = window.FLAT_LEVELS.findIndex(l => l.id === lvl.id);

                // UNLOCKING LOGIC:
                // 1. First level of ANY module (index === 0) is always unlocked.
                // 2. OR Previous level in same module is completed.
                let isUnlocked = false;
                if (index === 0) {
                    isUnlocked = true;
                } else {
                    const prevLevelId = mod.levels[index - 1].id;
                    if (completedLevels.has(prevLevelId)) {
                        isUnlocked = true;
                    }
                }

                const isCompleted = completedLevels.has(lvl.id);

                const btn = document.createElement('div');
                btn.className = `level-btn ${isUnlocked ? 'unlocked' : 'locked'}`;
                if (isCompleted) btn.classList.add('completed');

                // Show Level Number (relative to module)
                btn.innerHTML = `<span>${index + 1}</span>`;
                btn.title = lvl.title; // Tooltip for title

                if (isUnlocked) {
                    btn.addEventListener('click', () => {
                        startGame(flatIndex);
                    });
                }
                gridRow.appendChild(btn);
            });
            levelsGrid.appendChild(gridRow);
        });

        // Add user-requested spacing at bottom
        const spacer = document.createElement('div');
        spacer.innerHTML = '<br><br><br><br><br><br><br><br><br><br>';
        levelsGrid.appendChild(spacer);
    }

    // ... renderVirtualKeyboard ...


    function renderVirtualKeyboard() {
        // ... (Same as before, simplified for brevity) ...
        const rows = [
            ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
            ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\''],
            ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
            [' ']
        ];

        virtualKeyboard.innerHTML = '';

        rows.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'key-row';

            row.forEach(keyChar => {
                const keyDiv = document.createElement('div');
                keyDiv.className = 'key';
                keyDiv.textContent = keyChar === ' ' ? 'Space' : keyChar;
                keyDiv.dataset.key = keyChar;
                if (keyChar === ' ') keyDiv.classList.add('space');

                const mapping = KEY_MAP[keyChar];
                if (mapping) {
                    if (mapping.hand === 'both') keyDiv.dataset.finger = 'thumb';
                    else keyDiv.dataset.finger = `${mapping.hand}-${mapping.finger}`;
                }

                rowDiv.appendChild(keyDiv);
            });
            virtualKeyboard.appendChild(rowDiv);
        });
    }

    function startGame(index) {
        if (index >= window.FLAT_LEVELS.length) return;

        currentLevelIndex = index;
        const levelData = window.FLAT_LEVELS[index];
        currentText = levelData.content;

        charIndex = 0;
        errorCount = 0;
        fingerErrors = 0;
        startTime = null;
        isGameActive = true;

        levelOverlay.classList.remove('active');
        completionModal.classList.add('hidden');

        renderText();
        updateStats();
        updateInstruction();
    }

    function renderText() {
        const completed = currentText.slice(0, charIndex);
        const current = currentText[charIndex] || '';
        const future = currentText.slice(charIndex + 1);

        textDisplay.innerHTML = `
            <span class="text-completed">${completed}</span><span class="text-current cursor">${current === ' ' ? '&nbsp;' : current}</span><span class="text-future">${future}</span>
        `;
    }

    function updateStats() {
        // Stats tracked internally, shown only on completion
    }

    function calculateAccuracy() {
        if (charIndex === 0) return 100;
        const totalKeystrokes = charIndex + errorCount;
        if (totalKeystrokes === 0) return 100;
        return Math.round((charIndex / totalKeystrokes) * 100);
    }

    function calculateWPM() {
        if (!startTime || !endTime) return 0;
        const durationMin = (endTime - startTime) / 60000;
        if (durationMin === 0) return 0;
        const words = charIndex / 5;
        return Math.round(words / durationMin);
    }

    function updateInstruction() {
        // Clear previous states
        clearTimeout(hintTimeout);
        document.querySelectorAll('.finger.active').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.key.active').forEach(el => el.classList.remove('active'));
        fingerInstruction.innerHTML = '&nbsp;'; // Clear text

        if (charIndex >= currentText.length) return;

        const levelData = window.FLAT_LEVELS[currentLevelIndex];
        const hintMode = levelData.hintMode || 'full';

        // Check if we show hints at all logic
        // Minimal hints: Maybe just Key highlight? Or nothing? 
        // Request: "Minimal hints"

        const char = currentText[charIndex].toLowerCase();
        const mapping = KEY_MAP[char];

        if (mapping) {

            // --- Logic for Modes ---

            // Text Instruction
            if (hintMode !== 'minimal') {
                const handText = mapping.hand === 'both' ? 'Thumb' : (mapping.hand.charAt(0).toUpperCase() + mapping.hand.slice(1));
                const fingerText = mapping.finger.charAt(0).toUpperCase() + mapping.finger.slice(1);
                const keyDisplay = char === ' ' ? 'Space' : char.toUpperCase();
                fingerInstruction.innerHTML = `Press <span class="key-name">${keyDisplay}</span> with <span class="finger-name">${handText} ${fingerText}</span>`;
            } else {
                fingerInstruction.textContent = "Focus...";
            }

            // Visual Highlights (Hands & Keys)
            const showVisuals = () => {
                // Highlight Hand
                if (mapping.hand === 'both') {
                    document.querySelector(`.left-hand .finger.thumb`).classList.add('active');
                    document.querySelector(`.right-hand .finger.thumb`).classList.add('active');
                } else {
                    document.querySelector(`.${mapping.hand}-hand .finger.${mapping.finger}`).classList.add('active');
                }

                // Highlight Key
                const keyEl = document.querySelector(`.key[data-key="${char}"]`);
                if (keyEl) keyEl.classList.add('active');
            };

            // Fading Logic
            if (hintMode === 'fading') {
                showVisuals();
                hintTimeout = setTimeout(() => {
                    document.querySelectorAll('.finger.active').forEach(el => el.classList.remove('active'));
                    document.querySelectorAll('.key.active').forEach(el => el.classList.remove('active'));
                }, 800); // Fade after 800ms
            } else if (hintMode === 'minimal') {
                // No visuals for minimal? Or maybe just very subtle? 
                // "Minimal hints" usually means no instruction text, maybe key highlight only?
                // Let's assume standard Minimal means: No text, No Hand, Key Only or Nothing. 
                // Let's do: Key Only for minimal, no Hand.
                const keyEl = document.querySelector(`.key[data-key="${char}"]`);
                if (keyEl) keyEl.classList.add('active');
            } else {
                // Full
                showVisuals();
            }
        }
    }

    function handleKeyDown(e) {
        if (!isGameActive) return;
        if (["Shift", "Control", "Alt", "Meta", "CapsLock", "Tab"].includes(e.key)) {
            if (e.key === "Tab") e.preventDefault();
            return;
        }

        const keyEl = document.querySelector(`.key[data-key="${e.key.toLowerCase()}"]`);
        if (keyEl) {
            keyEl.classList.add('hit');
            setTimeout(() => keyEl.classList.remove('hit'), 100);
        }

        if (!startTime) startTime = new Date();

        const targetChar = currentText[charIndex];

        if (e.key === targetChar) {
            processCorrectInput();
        } else {
            processIncorrectInput(e.key);
        }
    }

    function processCorrectInput() {
        charIndex++;
        if (charIndex >= currentText.length) {
            finishLevel();
        } else {
            renderText();
            updateInstruction();
        }
    }

    function processIncorrectInput(pressedKey) {
        errorCount++;

        // Finger Error Logic
        const targetChar = currentText[charIndex].toLowerCase();
        const targetMap = KEY_MAP[targetChar];
        const pressedMap = KEY_MAP[pressedKey.toLowerCase()];

        if (targetMap && pressedMap) {
            if (targetMap.hand !== pressedMap.hand || targetMap.finger !== pressedMap.finger) {
                fingerErrors++;
            }
        }

        updateStats();

        // Visual Feedback
        const currentSpan = document.querySelector('.text-current');
        if (currentSpan) {
            currentSpan.classList.add('error');
            setTimeout(() => currentSpan.classList.remove('error'), 200);
        }
    }

    function finishLevel() {
        isGameActive = false;
        endTime = new Date();
        const accuracy = calculateAccuracy();
        const wpm = calculateWPM();
        const levelData = window.FLAT_LEVELS[currentLevelIndex];

        const passed = accuracy >= levelData.minAccuracy;

        showCompletionModal(passed, accuracy, wpm, levelData.minAccuracy);
    }

    function showCompletionModal(passed, accuracy, wpm, reqAccuracy) {
        completionModal.classList.remove('hidden');
        modalActions.innerHTML = '';

        // 1. Handle FAILURE
        if (!passed) {
            modalTitle.textContent = "Level Failed";
            modalTitle.style.color = "var(--error-color)";
            modalMessage.innerHTML = `
                <p>Accuracy too low (${accuracy}%). Required: ${reqAccuracy}%</p>
                <div class="result-grid" style="margin: 15px 0; color: var(--text-secondary);">
                    Errors: ${errorCount} | Finger Faults: ${fingerErrors}
                </div>
                <p>Strict discipline required. Try again.</p>
            `;

            createButton('Try Again', 'btn-primary', () => startGame(currentLevelIndex));
            createButton('Menu', 'btn-secondary', returnToMenu);
            return;
        }

        // 2. Handle SUCCESS
        modalTitle.textContent = "Level Completed!";
        modalTitle.style.color = "var(--success-color)";
        modalMessage.innerHTML = `
            <div class="result-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px 0;">
                <div>WPM: <strong>${wpm}</strong></div>
                <div>Accuracy: <strong>${accuracy}%</strong></div>
                <div>Errors: <strong>${errorCount}</strong></div>
                <div>Finger Faults: <strong>${fingerErrors}</strong></div>
            </div>
        `;

        // 3. Save Progress (Safely)
        const currentLevel = window.FLAT_LEVELS[currentLevelIndex];
        if (currentLevel) {
            try {
                // Remove legacy maxLevel check if present

                // Add to completed set
                completedLevels.add(currentLevel.id);
                localStorage.setItem('typingTutor_completedLevels', JSON.stringify(Array.from(completedLevels)));
            } catch (e) {
                console.error("Save Error:", e);
            }
        } else {
            console.error("Critical: Missing Level Data for Index", currentLevelIndex);
        }

        // 4. Next Level Logic
        const nextIndex = currentLevelIndex + 1;
        const nextLevel = window.FLAT_LEVELS[nextIndex];

        if (nextLevel) {
            // Button: Next Level
            createButton('Next Level', 'btn-primary', () => startGame(nextIndex));

            // Visual Cue for Module Change
            if (currentLevel && nextLevel.moduleTitle !== currentLevel.moduleTitle) {
                modalMessage.innerHTML += `<br><span style="color:var(--accent-color); font-size: 0.9em; display:block; margin-top:10px;">Module Completed! Next: ${nextLevel.moduleTitle}</span>`;
            }
        } else {
            // End of Game
            modalTitle.textContent = "Game Completed!";
            modalMessage.innerHTML += `<br><br><span style="color:var(--accent-color); font-weight:bold;">You have finished all modules!</span>`;
        }

        // 5. Standard Buttons
        createButton('Replay', 'btn-secondary', () => startGame(currentLevelIndex));

        // Final Button: Back to Modules or Menu
        const menuText = !nextLevel ? 'Back to Modules' : 'Menu';
        createButton(menuText, 'btn-secondary', returnToMenu);
    }

    // Helper to keep code clean
    function createButton(text, className, onClick) {
        const btn = document.createElement('button');
        btn.className = className;
        btn.textContent = text;
        btn.onclick = onClick;
        modalActions.appendChild(btn);
    }

    function returnToMenu() {
        renderLevelsGrid();
        completionModal.classList.add('hidden');
        levelOverlay.classList.add('active');
    }

    function resetProgress() {
        if (confirm("Are you sure you want to reset all progress?")) {
            completedLevels.clear();
            localStorage.removeItem('typingTutor_completedLevels');
            // Remove legacy if exists
            localStorage.removeItem('typingTutor_maxLevel');

            renderLevelsGrid();
            levelOverlay.classList.add('active');
        }
    }

    // Init
    init();
});
