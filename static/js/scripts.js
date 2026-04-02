document.addEventListener('DOMContentLoaded', () => {
    // --- 1. THEME TOGGLE LOGIC ---
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    const darkIcon = "/static/images/darkmode.png";  
    const lightIcon = "/static/images/lightmode.png"; 

    if (document.documentElement.classList.contains('light-mode')) {
        if (themeIcon) themeIcon.src = lightIcon;
    } else {
        if (themeIcon) themeIcon.src = darkIcon;
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isLight = document.documentElement.classList.toggle('light-mode');
            if (themeIcon) themeIcon.src = isLight ? lightIcon : darkIcon;
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });
    }

    // --- 2. KEYPAD & INPUT LOGIC ---
    const fxInput = document.getElementById('f_x');
    const faInput = document.querySelector('input[name="f_a"]');
    const fbInput = document.querySelector('input[name="f_b"]');
    const GxInput = document.getElementById('g_of_x');
    
    let currentInput = fxInput;

    [fxInput, faInput, fbInput, GxInput].forEach(input => {
        if(input) {
            input.addEventListener('focus', () => {
                currentInput = input;
            });
        }
    });

    const keypad = document.querySelector('.keypad-grid');
    if (keypad) {
        keypad.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;

            const val = btn.innerText.trim();
            const isNumber = btn.classList.contains('key-num') || val === '.' || val === ',';
            const isAction = btn.classList.contains('key-alt');

            if (isAction) {
                if (val === 'AC') {
                    currentInput.value = '';
                } else if (val === '⌫') {
                    currentInput.value = currentInput.value.slice(0, -1);
                }
                return;
            }

            if (currentInput === faInput || currentInput === fbInput) {
                if (isNumber || val === '(-)') {
                    currentInput.value += (val === '(-)') ? '-' : val;
                }
                return;
            }

            if (currentInput === fxInput || currentInput === GxInput) {
                const mathMap = {
                    '×': '*', '÷': '/', '−': '-', 'x²': '**2', '^': '**',
                    'π': 'pi', '√': 'sqrt(', 'sin': 'sin(', 'cos': 'cos(',
                    'tan': 'tan(', 'log': 'log10(', 'ln': 'log(', 'abs': 'abs(', '(-)': '-'
                };

                let toAdd = mathMap[val] || val;
                const needsMultiplication = ['x', 'y', 'pi', 'e', 'sqrt(', 'sin(', 'cos(', 'tan(', 'log(', 'log10(', 'abs('];
                
                if (needsMultiplication.includes(toAdd)) {
                    const lastChar = currentInput.value.slice(-1);
                    if (/[0-9)]/.test(lastChar)) {
                        toAdd = '*' + toAdd;
                    }
                }
                currentInput.value += toAdd;
            }
        });
    }

    // --- 3. PANEL TOGGLE LOGIC ---
    const resultPanel = document.getElementById('result-panel');
    const closeBtn = document.getElementById('close-panel-btn');
    const reopenBtn = document.getElementById('reopen-panel-btn');
    const reopenWrapper = document.getElementById('reopen-panel-wrapper');

    if (resultPanel && closeBtn && reopenBtn) {
        closeBtn.onclick = () => {
            resultPanel.style.display = 'none';
            if (reopenWrapper) {
                reopenWrapper.style.display = 'flex';
            } else {
                reopenBtn.style.display = 'block';
            }
        };
        reopenBtn.onclick = () => {
            // We use 'flex' because that is the default for your .panel class
            resultPanel.style.display = 'flex'; 
            if (reopenWrapper) {
                reopenWrapper.style.display = 'none';
            } else {
                reopenBtn.style.display = 'none';
            }
        };
    }
// Make sure this is the LAST line of the file to close the DOMContentLoaded block
});