document.addEventListener('DOMContentLoaded', () => {
    // --- 1. THEME TOGGLE LOGIC ---
    // This section manages the UI appearance (Light vs Dark mode) and persists the user's preference.
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const homeIcon = document.getElementById('home-icon');
    
    // Define paths for the different icon states
    const darkIcon = "/static/images/darkmode.png";  
    const lightIcon = "/static/images/lightmode.png"; 
    const homedarkIcon = "/static/images/home_button_light.svg";
    const homelightIcon = "/static/images/home_button_dark.svg";

    // Initial check: If the 'light-mode' class exists (set by the inline script in base.html), sync the icons.
    if (document.documentElement.classList.contains('light-mode')) {
        if (themeIcon) themeIcon.src = lightIcon;
        if (homeIcon) homeIcon.src = homelightIcon;
    } else {
        if (themeIcon) themeIcon.src = darkIcon;
        if (homeIcon) homeIcon.src = homedarkIcon;
    }

    // Listener for the theme toggle button
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isLight = document.documentElement.classList.toggle('light-mode');
            if (themeIcon) themeIcon.src = isLight ? lightIcon : darkIcon;
            if (homeIcon) homeIcon.src = isLight ? homelightIcon : homedarkIcon;
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });
    }

    // --- 2. KEYPAD & INPUT LOGIC ---
    // This section handles how the virtual keypad interacts with various input fields.
    const fxInput = document.getElementById('f_x');
    const faInput = document.querySelector('input[name="f_a"]');
    const fbInput = document.querySelector('input[name="f_b"]');
    const GxInput = document.getElementById('g_of_x');
    const x0Input = document.querySelector('input[name="x0"]');
    const StoppingPointInput = document.querySelector('input[name="stopping_point"]');
    const RoundOffInput = document.querySelector('input[name="roundoff"]');
    
    // Keep track of which input field was last focused so the keypad knows where to insert text
    let currentInput = fxInput;

    const allInputs = [fxInput, faInput, fbInput, GxInput, x0Input, StoppingPointInput, RoundOffInput];

    // Update 'currentInput' whenever a user clicks or tabs into a specific field
    allInputs.forEach(input => {
        if(input) {
            input.addEventListener('focus', () => {
                currentInput = input;
            });
        }
    });

    const keypad = document.querySelector('.keypad-grid');
    // Use Event Delegation: attach one listener to the parent keypad container
    if (keypad) {
        keypad.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;

            const val = btn.innerText.trim();
            const isNumber = btn.classList.contains('key-num') || val === '.' || val === ',';
            const isAction = btn.classList.contains('key-alt');

            // ACTION HANDLER: Clear (AC) or Backspace (⌫)
            if (isAction) {
                if (val === 'AC') {
                    currentInput.value = '';
                } else if (val === '⌫') {
                    currentInput.value = currentInput.value.slice(0, -1);
                }
                return;
            }

            // NUMERIC INPUT HANDLER: For fields that only accept numbers/decimals (e.g., intervals, roundoff)
            const numericInputs = [faInput, fbInput, x0Input, RoundOffInput, StoppingPointInput];
            
            if (numericInputs.includes(currentInput)) {
                if (isNumber) {
                    // Normalization: Convert comma to dot for internal processing
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

            // EQUATION INPUT HANDLER: For f(x) and g(x) fields that allow variables and functions
            if (currentInput === fxInput || currentInput === GxInput) {
                // Map UI display symbols to Python/SymPy compatible syntax
                const mathMap = {
                    '×': '*', '÷': '/', '−': '-', 'x²': '**2', '^': '**',
                    'π': 'pi', '√': 'sqrt(', 'sin': 'sin(', 'cos': 'cos(',
                    'tan': 'tan(', 'log': 'log10(', 'ln': 'log(', 'abs': 'abs(', '(-)': '-'
                };

                let toAdd = mathMap[val] || val;
                // Define tokens that usually require a multiplication symbol if they follow a number (e.g., 2x -> 2*x)
                const needsMultiplication = ['x', 'y', 'pi', 'E', 'sqrt(', 'sin(', 'cos(', 'tan(', 'log(', 'log10(', 'abs('];
                
                // AUTO-MULTIPLICATION: Check the last character of the input
                const lastChar = currentInput.value.slice(-1);
                if (needsMultiplication.includes(toAdd) && /[0-9)]/.test(lastChar)) {
                    toAdd = '*' + toAdd;
                }
                
                currentInput.value += toAdd;
            }
        });
    }

    // --- 3. PANEL TOGGLE LOGIC ---
    // Handles hiding/showing the output/results sidebar.
    const resultPanel = document.getElementById('result-panel');
    const reopenWrapper = document.getElementById('reopen-panel-wrapper');
    const closeBtn = document.getElementById('close-panel-btn');
    const reopenBtn = document.getElementById('reopen-panel-btn');

    // Only attach listeners if the elements exist (Calculator pages only)
    if (closeBtn && resultPanel && reopenWrapper) {
        // Hide the result panel and show the "reopen" tab
        closeBtn.addEventListener('click', () => {
            resultPanel.style.display = 'none';
            reopenWrapper.style.display = 'flex';
        });
    }

    if (reopenBtn && resultPanel && reopenWrapper) {
        // Show the result panel and hide the "reopen" tab
        reopenBtn.addEventListener('click', () => {
            resultPanel.style.display = 'flex';
            reopenWrapper.style.display = 'none';
        });
    }

    // --- 4. SMOOTH SCROLL ENHANCEMENT ---
    // Smooth scroll for internal navigation links (e.g., #method, #guide, #logic)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || !href.startsWith('#')) return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                
                // Account for sticky navbar height so content isn't hidden behind it
                const navbar = document.querySelector('.navbar');
                const offset = navbar ? navbar.offsetHeight : 0;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                
                window.scrollTo({
                    top: elementPosition - offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 5. HERO VIDEO HOVER PLAY LOGIC ---
    const heroVideos = document.querySelectorAll('.hero-video');
    heroVideos.forEach(heroDiv => {
        let timer;
        const videoTag = heroDiv.querySelector('video');

        if (videoTag) {
            heroDiv.addEventListener('mouseenter', () => {
                // Re-verify muted for browser policy compliance
                videoTag.muted = true;
                timer = setTimeout(() => {
                    videoTag.play().catch(err => {
                        if (err.name !== 'AbortError') {
                            console.warn("Autoplay blocked:", err);
                        }
                    });
                }, 1000); 
            });

            heroDiv.addEventListener('mouseleave', () => {
                clearTimeout(timer);
                if (!videoTag.paused) videoTag.pause();
            });
        }
    });

    // --- 6. SCROLL REVEAL ANIMATION ---
    // Detects when sections enter the viewport to trigger smooth entrance animations
    const revealOptions = {
        threshold: 0.2 // Trigger when 20% of the section is visible
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
            }
        });
    }, revealOptions);

    // Target the main content wrappers in each section
    const revealElements = document.querySelectorAll('.hero-content, .guide-container, .logic h2, .logic .hero-video, .logic .logic-text');
    revealElements.forEach(el => {
        el.classList.add('reveal-on-scroll');
        revealObserver.observe(el);
    });

// Make sure this is the LAST line of the file to close the DOMContentLoaded block
});
