document.addEventListener('DOMContentLoaded', () => {
    // --- 1. THEME TOGGLE LOGIC ---
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    // Define paths - Ensure these match your static folder structure
    const darkIcon = "/static/images/darkmode.png";  
    const lightIcon = "/static/images/lightmode.png"; 

    // Sync icon with the theme already set by the <head> script
    if (document.documentElement.classList.contains('light-mode')) {
        if (themeIcon) themeIcon.src = lightIcon;
    } else {
        if (themeIcon) themeIcon.src = darkIcon;
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            // Toggle class on documentElement (<html>) for faster response
            const isLight = document.documentElement.classList.toggle('light-mode');
            
            if (isLight) {
                if (themeIcon) themeIcon.src = lightIcon;
                localStorage.setItem('theme', 'light');
            } else {
                if (themeIcon) themeIcon.src = darkIcon;
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // --- 2. KEYPAD & INPUT LOGIC ---
    const fxInput = document.getElementById('f_x');
    const faInput = document.querySelector('input[name="f_a"]');
    const fbInput = document.querySelector('input[name="f_b"]');
    const GxInput = document.getElementById('g_of_x');
    
    let currentInput = fxInput;

    // Track which input is focused
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

            // Handle AC and Backspace
            if (isAction) {
                if (val === 'AC') {
                    currentInput.value = '';
                } else if (val === '⌫') {
                    currentInput.value = currentInput.value.slice(0, -1);
                }
                return;
            }

            // Handle numeric inputs for f(a) and f(b)
            if (currentInput === faInput || currentInput === fbInput) {
                if (isNumber || val === '(-)') {
                    currentInput.value += (val === '(-)') ? '-' : val;
                }
                return;
            }

            // Handle math mapping for f(x) and g(x)
            if (currentInput === fxInput || currentInput === GxInput) {
                const mathMap = {
                    '×': '*',
                    '÷': '/',
                    '−': '-',
                    'x²': '**2',
                    '^': '**',
                    'π': 'pi',
                    '√': 'sqrt(',
                    'sin': 'sin(',
                    'cos': 'cos(',
                    'tan': 'tan(',
                    'log': 'log10(',
                    'ln': 'log(',
                    'abs': 'abs(',
                    '(-)': '-'
                };

                let toAdd = mathMap[val] || val;

                // Smart Multiplication Logic
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
});