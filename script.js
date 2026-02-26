document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const loginContainer = document.getElementById('loginContainer');
    const passwordInput = document.getElementById('passwordInput');
    const authenticateButton = document.getElementById('authenticateButton');
    const errorMessage = document.getElementById('errorMessage');
    const mainContent = document.getElementById('mainContent');

    const matrixCanvas = document.getElementById('matrixCanvas');
    const ctxMatrix = matrixCanvas.getContext('2d');

    const animatedMessageOverlay = document.getElementById('animatedMessageOverlay');
    const animatedText = document.getElementById('animatedText');
    const contentOverlay = document.getElementById('contentOverlay');
    const outputElement = document.getElementById('output');
    const revealGiftButton = document.getElementById('revealGiftButton');

    // Mengambil elemen photo-container yang merupakan wadah untuk foto-foto yang jatuh.
    // Pastikan ada div dengan class "photo-container" di HTML Anda.
    const photoContainer = document.querySelector('.photo-container');

    // --- Configuration ---
    const CORRECT_PASSWORD = "18082008"; // *** REMEMBER TO CHANGE THIS! ***

    const sfxTyping = new Audio('sfx/typing.mp3');
    const sfxAccessGranted = new Audio('sfx/access_granted.mp3');
    const sfxAccessDenied = new Audio('sfx/access_denied.mp3');
    const sfxBeep = new Audio('sfx/beep.mp3');
    const sfxGlitch = new Audio('sfx/glitch.mp3');
    const sfxBirthdaySong = new Audio('musik.mp3');

    sfxTyping.volume = 0.3;
    sfxBeep.volume = 0.5;
    sfxAccessGranted.volume = 0.7;
    sfxAccessDenied.volume = 0.7;
    sfxGlitch.volume = 0.6;
    sfxBirthdaySong.volume = 0.5;

    let W, H;
    const fontSize = 16;
    let columns;
    let drops = [];
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[{]}\\|;:\'",<.>/?`~';

    const countdownNumbers = ['3', '2', '1'];
    const birthdayWords = ['HAPPY', 'BIRTHDAY', 'TO', 'YOU'];
    
    const finalMessageLines = [
        "DECRYPTING FINAL DATA PACKET...",
        "SUCCESSFUL. FILE 'BIRTHDAY_GIFT.EXE' FOUND.",
        "ACCESS GRANTED. MEMORY RECALL INITIATED:",
        "Happy birthday for youuu my precious person!!! this is ur special day!! thank you for surviving until now, I'm proud of you! I hope that on this special day you realize that your age and the responsibilities you carry oUt will be more difficult, but that's okay! while yoU are veerry verryy strong you will live it very easily! I know u r the strongest person i ever seen, and i hope yoU are always take your healthy then you can achieve more achievements and you can make your parents proud alwayss! imma also hope you are more cheerful and have a beautiful smile on your face, i will be happy if you can be happier the next day!! l am very grateful because you have been my side when i'am sad or happy, you are really valuable to me and you are very special to me. You've been through a lot problem and you deserve to be happy on your special day! For now, enjoy your special birthday!! My most precious person!",
        "DATA KADO SUDAH SIAP DITAMPILKAN.",
        "KLIK TOMBOL UNTUK MELIHATNYA!"
    ];
    
    let finalMessageLineIndex = 0;
    let finalMessageCharIndex = 0;
    const typingSpeed = 50;

    // --- Matrix Rain Functions ---
    function setupMatrixCanvas() {
        W = window.innerWidth;
        H = window.innerHeight;
        matrixCanvas.width = W;
        matrixCanvas.height = H;
        ctxMatrix.fillStyle = "#000";
        ctxMatrix.fillRect(0, 0, W, H);
    }

    function initMatrixRain() {
        setupMatrixCanvas();
        columns = Math.floor(W / fontSize);
        drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }
    }

    function drawMatrixRain() {
        ctxMatrix.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctxMatrix.fillRect(0, 0, W, H);
        ctxMatrix.fillStyle = "#00F";
        ctxMatrix.font = fontSize + "px monospace";

        for (let i = 0; i < drops.length; i++) {
            const text = characters.charAt(Math.floor(Math.random() * characters.length));
            ctxMatrix.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > H && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    let matrixAnimationInterval;
    function startMatrixRain() {
        initMatrixRain();
        window.addEventListener('resize', () => {
            setupMatrixCanvas();
            initMatrixRain();
        });
        matrixAnimationInterval = setInterval(drawMatrixRain, 33);
    }

    // --- Animated Birthday Sequence Functions (Countdown & Big Words) ---
    async function playAnimatedBirthdaySequence() {
        animatedMessageOverlay.classList.remove('hidden');
        animatedText.classList.remove('hidden');

        // Countdown with beep SFX
        for (let i = 0; i < countdownNumbers.length; i++) {
            animatedText.textContent = countdownNumbers[i];
            animatedText.style.animation = 'textFadeInScaleOut 1s ease-out forwards';
            sfxBeep.play().catch(e => console.warn("SFX BEEP autoplay failed:", e));
            await new Promise(resolve => setTimeout(resolve, 1000));
            animatedText.style.animation = 'none';
        }
        animatedText.classList.add('hidden');

        await new Promise(resolve => setTimeout(resolve, 500));

        // Big Words with beep SFX
        for (let i = 0; i < birthdayWords.length; i++) {
            animatedText.textContent = birthdayWords[i];
            animatedText.classList.remove('hidden');
            animatedText.style.animation = 'wordRevealFlash 1s ease-out forwards';
            sfxBeep.play().catch(e => console.warn("SFX BEEP autoplay failed:", e));
            await new Promise(resolve => setTimeout(resolve, 1200));
            animatedText.style.animation = 'none';
        }
        animatedText.classList.add('hidden');
        animatedMessageOverlay.classList.add('hidden');

        await new Promise(resolve => setTimeout(resolve, 500));

        // Transition to final message and button
        contentOverlay.classList.remove('hidden');
        typeFinalMessage();
    }

    // --- Final Message & Button Functions ---
    function typeFinalMessage() {
        if (finalMessageLineIndex < finalMessageLines.length) {
            if (finalMessageCharIndex < finalMessageLines[finalMessageLineIndex].length) {
                outputElement.textContent += finalMessageLines[finalMessageLineIndex].charAt(finalMessageCharIndex);
                sfxTyping.play().catch(e => {});
                finalMessageCharIndex++;
                setTimeout(typeFinalMessage, typingSpeed);
            } else {
                outputElement.textContent += '\n';
                sfxTyping.pause();
                sfxTyping.currentTime = 0;
                finalMessageLineIndex++;
                finalMessageCharIndex = 0;
                setTimeout(typeFinalMessage, typingSpeed * 2);
            }
        } else {
            outputElement.innerHTML += '<span class="cursor">_</span>';
            revealGiftButton.classList.remove('hidden');
        }
    }

    // --- Falling Photo Animation ---
    const photosToAnimate = [
        "foto1.jpg", 
        "foto2.jpg",
        "foto3.jpg",
        "foto4.jpg",
        "foto5.jpg",
        "foto6.jpg",
        "foto7.jpg",
        "foto8.jpg",
        "foto9.jpg",
        "foto10.jpg",
        "foto11.jpg",
        "foto12.jpg",
        "foto13.jpg",
        "foto14.jpg",
        "foto15.jpg",
        "foto16.jpg",
    ];

    function startPhotoRain() {
        // We use setInterval here to continuously drop new photos
        setInterval(() => {
            const img = document.createElement('img');
            const randomPhotoUrl = photosToAnimate[Math.floor(Math.random() * photosToAnimate.length)];
            img.src = randomPhotoUrl;
            img.classList.add('falling-photo');
            img.style.left = Math.random() * window.innerWidth + 'px';
            photoContainer.appendChild(img);

            // Remove the image after it has fallen to prevent memory leaks
            setTimeout(() => {
                img.remove();
            }, 10000); // This duration must match the CSS animation duration
        }, 300); // Interval to create new photos
    }

    // --- Event Listeners ---
    authenticateButton.addEventListener('click', () => {
        const enteredPassword = passwordInput.value.trim();
        if (enteredPassword === CORRECT_PASSWORD) {
            sfxAccessGranted.play().catch(e => console.warn("SFX Access Granted autoplay failed:", e));
            
            sfxBirthdaySong.play().catch(e => console.warn("Birthday song autoplay failed:", e));

            loginContainer.classList.add('hidden');
            mainContent.classList.remove('hidden');
            startMatrixRain();
            // Start the photo rain at the same time as the matrix rain
            startPhotoRain();
            setTimeout(playAnimatedBirthdaySequence, 1000);
        } else {
            sfxAccessDenied.play().catch(e => console.warn("SFX Access Denied autoplay failed:", e));
            errorMessage.textContent = "AUTHENTICATION FAILED. INCORRECT CREDENTIALS.";
            passwordInput.value = '';
        }
    });

    passwordInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            authenticateButton.click();
        }
    });

    revealGiftButton.addEventListener('click', () => {
        sfxBirthdaySong.pause();
        sfxBirthdaySong.currentTime = 0;
        window.location.href = 'flower_page.html';
    });
});
