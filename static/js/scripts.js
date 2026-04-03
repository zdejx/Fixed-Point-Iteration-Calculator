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
    const x0Input = document.querySelector('input[name="x0"]');
    const StoppingPointInput = document.querySelector('input[name="stopping_point"]');
    const RoundOffInput = document.querySelector('input[name="roundoff"]');
    
    let currentInput = fxInput;

    const allInputs = [fxInput, faInput, fbInput, GxInput, x0Input, StoppingPointInput, RoundOffInput];

    allInputs.forEach(input => {
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

            // 1. Handle Global Actions (Clear/Delete)
            if (isAction) {
                if (val === 'AC') {
                    currentInput.value = '';
                } else if (val === '⌫') {
                    currentInput.value = currentInput.value.slice(0, -1);
                }
                return;
            }

            // 2. Handle Numeric-Only Inputs (fa, fb, x0, RoundOff, StoppingPoint)
            const numericInputs = [faInput, fbInput, x0Input, RoundOffInput, StoppingPointInput];
            
            if (numericInputs.includes(currentInput)) {
                if (isNumber) {
                    // Convert comma to dot for valid mathematical processing
                    const cleanVal = (val === ',') ? '.' : val;
                    
                    // Prevent multiple decimals in one input
                    if (cleanVal === '.' && currentInput && currentInput.value.includes('.')) return;
                    
                    currentInput.value += cleanVal;
                } else if (val === '(-)') {
                    // Only allow minus sign if it's not already there (or allow toggle)
                    if (!currentInput.value.includes('-')) {
                        currentInput.value = '-' + currentInput.value;
                    }
                }
                return; 
            }

            // 3. Handle Equation Inputs (f(x) and g(x))
            if (currentInput === fxInput || currentInput === GxInput) {
                const mathMap = {
                    '×': '*', '÷': '/', '−': '-', 'x²': '**2', '^': '**',
                    'π': 'pi', '√': 'sqrt(', 'sin': 'sin(', 'cos': 'cos(',
                    'tan': 'tan(', 'log': 'log10(', 'ln': 'log(', 'abs': 'abs(', '(-)': '-'
                };

                let toAdd = mathMap[val] || val;
                const needsMultiplication = ['x', 'y', 'pi', 'e', 'sqrt(', 'sin(', 'cos(', 'tan(', 'log(', 'log10(', 'abs('];
                
                const lastChar = currentInput.value.slice(-1);
                if (needsMultiplication.includes(toAdd) && /[0-9)]/.test(lastChar)) {
                    toAdd = '*' + toAdd;
                }
                
                currentInput.value += toAdd;
            }
        });
    }

    // --- 3. PANEL TOGGLE LOGIC ---
    const resultPanel = document.getElementById('result-panel');
    const reopenWrapper = document.getElementById('reopen-panel-wrapper');
    const closeBtn = document.getElementById('close-panel-btn');
    const reopenBtn = document.getElementById('reopen-panel-btn');

    closeBtn.addEventListener('click', () => {
        resultPanel.style.display = 'none';
        reopenWrapper.style.display = 'flex';
    });

    reopenBtn.addEventListener('click', () => {
        resultPanel.style.display = 'flex';
        reopenWrapper.style.display = 'none';
    });
// Make sure this is the LAST line of the file to close the DOMContentLoaded block
});