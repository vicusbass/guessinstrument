// Game logic script for the instrument guessing game
import { instruments, getRandomInstrument, checkAnswer } from '../data/instruments.js';
import * as Tone from 'tone';
import confetti from 'canvas-confetti';

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get the current language from HTML
    const currentLang = document.documentElement.lang || 'en';
    console.log('Current language:', currentLang);
    
    // Game state variables
    let currentInstrument = null;
    let hasPlayedSound = false;
    let score = 0;
    let wrongGuessCount = 0;
    
    // DOM elements
    const playButton = document.getElementById('play-sound-button');
    const guessInput = document.getElementById('guess-input');
    const submitButton = document.getElementById('submit-guess');
    const skipButton = document.getElementById('skip-button');
    const messageArea = document.getElementById('message-area');
    const instrumentImage = document.getElementById('instrument-image');

    // Initialize the game state
    function initGame() {
        currentInstrument = getRandomInstrument();
        hasPlayedSound = false;
        wrongGuessCount = 0; // Reset wrong guess counter for new instrument
        
        if (guessInput) {
            guessInput.value = '';
            guessInput.disabled = false;
        }
        
        if (submitButton) {
            submitButton.disabled = false;
        }
        
        if (messageArea) {
            messageArea.textContent = '';
            messageArea.className = 'mt-6 text-center font-medium text-lg hidden';
        }
        
        if (instrumentImage) {
            instrumentImage.src = 'https://placehold.co/400x300/E0E0E0/999999?text=Get+Ready!';
            instrumentImage.alt = 'Instrument Image';
        }
        
        if (playButton) {
            playButton.textContent = playButton.textContent.includes('Again') 
                ? playButton.textContent 
                : playButton.textContent + ' 🎵';
        }
    }
    
    // Variable to keep track of the current audio player
    let currentPlayer = null;
    
    // Function to stop any currently playing sound
    function stopSound() {
        if (currentPlayer) {
            console.log('Stopping current sound');
            currentPlayer.stop();
            currentPlayer.dispose();
            currentPlayer = null;
        }
    }
    
    // Play the instrument sound
    async function playSound() {
        if (!currentInstrument) {
            console.error('No current instrument');
            return;
        }
        
        // Stop any currently playing sound first
        stopSound();
        
        console.log('Playing sound:', currentInstrument.sound);
        
        // Initialize Tone.js
        try {
            await Tone.start();
            console.log('Tone.js started');
            
            // Create a new player for the sound
            currentPlayer = new Tone.Player().toDestination();
            
            // Load and play the sound
            await currentPlayer.load(currentInstrument.sound);
            console.log('Sound loaded');
            currentPlayer.start();
            console.log('Sound started playing');
            
            hasPlayedSound = true;
            if (playButton) {
                playButton.textContent = '🔄 Play Again';
            }
        } catch (error) {
            console.error('Error playing sound:', error);
            if (messageArea) {
                messageArea.textContent = 'Error playing sound. Please try again.';
                messageArea.className = 'mt-6 text-center font-medium text-lg text-red-500';
            }
        }
    }
    
    // Check the user's guess
    function checkGuess() {
        if (!hasPlayedSound) {
            if (messageArea) {
                messageArea.textContent = 'Please play the sound first!';
                messageArea.className = 'mt-6 text-center font-medium text-lg text-amber-500';
            }
            return;
        }
        
        const userGuess = guessInput ? guessInput.value.trim().toLowerCase() : '';
        if (userGuess === '') {
            if (messageArea) {
                messageArea.textContent = 'Please enter a guess!';
                messageArea.className = 'mt-6 text-center font-medium text-lg text-amber-500';
            }
            return;
        }
        
        // Check if the guess is correct
        const isCorrect = checkAnswer(userGuess, currentInstrument.id);
        
        if (isCorrect) {
            // Success! Show the correct answer and confetti
            if (messageArea) {
                messageArea.textContent = `Correct! It's a ${currentInstrument.name[currentLang]}!`;
                messageArea.className = 'mt-6 text-center font-medium text-lg text-green-500';
            }
            
            // Reset wrong guess counter on correct answer
            wrongGuessCount = 0;
            if (instrumentImage) {
                instrumentImage.src = currentInstrument.image;
                instrumentImage.alt = currentInstrument.name[currentLang];
            }
            
            // Add confetti effect for success
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#FF6B6B', '#4ECDC4', '#FFE66D']
            });
            
            // Disable input until next round
            if (guessInput) {
                guessInput.disabled = true;
            }
            if (submitButton) {
                submitButton.disabled = true;
            }
            
            // Add a slight delay before allowing a new game
            setTimeout(() => {
                if (playButton) {
                    playButton.textContent = 'Play New Sound 🎵';
                    playButton.onclick = () => {
                        initGame();
                        if (guessInput) guessInput.disabled = false;
                        if (submitButton) submitButton.disabled = false;
                        if (playButton) playButton.onclick = playSound;
                    };
                }
            }, 1500);
            
            score++;
        } else {
            // Wrong answer
            if (messageArea) {
                // Check if the image is already shown (meaning this is a second attempt)
                const isImageAlreadyShown = instrumentImage && instrumentImage.src.includes(currentInstrument.image);
                
                if (isImageAlreadyShown) {
                    // Image is already shown, display sad face SVG
                    const sadFaceSVG = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 512 512.01" class="mx-auto mb-4"><path fill="currentColor" d="M189.76 8.78c68.25-18.29 137.48-7.17 194.22 25.59l.76.47c56.37 32.82 100.29 87.02 118.48 154.93 18.29 68.25 7.17 137.47-25.59 194.21l-.47.76c-32.82 56.37-87.02 100.29-154.93 118.49-58.69 15.73-118.1 9.7-169.67-13.12-20.14-8.91-39.15-20.48-56.36-34.21-41.26-32.92-72.73-78.82-87.43-133.66-18.27-68.22-7.16-137.43 25.6-194.16C67.13 71.32 121.53 27.06 189.76 8.78zm-58.14 369.67a3.096 3.096 0 0 1-4.38.01l-9.64-9.58a3.118 3.118 0 0 1-.39-4.1c10.84-14.75 23.3-27.16 36.86-37.26 30.2-22.47 65.91-33.48 101.6-33.32 35.67.17 71.34 11.49 101.48 33.63 13.86 10.19 26.56 22.69 37.56 37.44.97 1.22.88 3-.25 4.12l-9.26 9.23a3.12 3.12 0 0 1-4.4 0c-2.03-1.99-4.04-3.91-6.19-5.77-30.22-26.27-74.7-39.8-119.05-40.02-44.18-.22-88.15 12.77-117.65 39.49-2.21 2-4.22 4.02-6.29 6.13zm210.37-231.89c12.47 18.04 12.47 46.92 0 64.97-12.89 18.67-34.64 18.66-47.54 0-12.46-18.05-12.46-46.93 0-64.97 12.9-18.67 34.65-18.67 47.54 0zm-120.72 0c12.46 18.04 12.46 46.92 0 64.97-12.9 18.66-34.65 18.67-47.54 0-12.46-18.05-12.46-46.93 0-64.97 12.89-18.67 34.64-18.67 47.54 0zm149.1-88.69c-50.68-29.26-112.55-39.18-173.59-22.83C135.74 51.4 87.11 90.92 57.87 141.58 28.6 192.27 18.68 254.16 35.04 315.22c13.7 51.13 43.66 93.55 82.8 123.17a230.483 230.483 0 0 0 48.48 28.09c45.43 19.39 97.46 24.27 148.89 10.49 60.8-16.29 109.27-55.55 138.55-105.92l.37-.68c29.26-50.67 39.18-112.55 22.83-173.58C460.67 136 421.41 87.53 371.05 58.24l-.68-.37z"/></svg>
                    `;
                    
                    // Show sad face instead of instrument photo
                    if (instrumentImage) {
                        instrumentImage.style.display = 'none';
                    }
                    
                    // Create a div to hold the sad face
                    const sadFaceContainer = document.createElement('div');
                    sadFaceContainer.id = 'sad-face-container';
                    sadFaceContainer.className = 'w-full h-auto max-h-96 flex items-center justify-center';
                    sadFaceContainer.innerHTML = sadFaceSVG;
                    
                    // Replace the instrument image with the sad face
                    const instrumentDisplay = document.getElementById('instrument-display');
                    if (instrumentDisplay) {
                        instrumentDisplay.innerHTML = '';
                        instrumentDisplay.appendChild(sadFaceContainer);
                    }
                    
                    messageArea.innerHTML = `Sorry, that's not correct. The answer was: ${currentInstrument.name[currentLang]}.`;
                    messageArea.className = 'mt-6 text-center font-medium text-lg text-red-600';
                    
                    // Disable input until next round
                    if (guessInput) {
                        guessInput.disabled = true;
                    }
                    if (submitButton) {
                        submitButton.disabled = true;
                    }
                    
                    // Add a slight delay before allowing a new game
                    setTimeout(() => {
                        if (playButton) {
                            playButton.textContent = 'Play New Sound 🎵';
                            playButton.onclick = () => {
                                initGame();
                                if (guessInput) guessInput.disabled = false;
                                if (submitButton) submitButton.disabled = false;
                                if (playButton) playButton.onclick = playSound;
                            };
                        }
                    }, 1500);
                } else {
                    // First attempt, show hint and reveal image
                    messageArea.textContent = `Not quite! Try again. Hint: It's a ${currentInstrument.name[currentLang].charAt(0)}...`;
                    messageArea.className = 'mt-6 text-center font-medium text-lg text-red-500';
                }
            }
            
            // Show a hint by revealing the image
            if (instrumentImage) {
                instrumentImage.src = currentInstrument.image;
                instrumentImage.alt = currentInstrument.name[currentLang];
            }
            
            // Clear the input for another try
            if (guessInput) {
                guessInput.value = '';
                guessInput.focus();
            }
        }
    }
    
    // Event listeners
    if (playButton) {
        playButton.addEventListener('click', playSound);
    }
    
    if (submitButton) {
        submitButton.addEventListener('click', checkGuess);
    }
    
    if (skipButton) {
        skipButton.addEventListener('click', () => {
            // Stop any currently playing sound
            stopSound();
            
            // Start a new game immediately without showing the answer
            initGame();
            
            // Make sure all elements are reset and enabled
            if (submitButton) submitButton.disabled = false;
            if (skipButton) skipButton.disabled = false;
            if (guessInput) {
                guessInput.disabled = false;
                guessInput.value = '';
                guessInput.focus();
            }
            if (messageArea) {
                messageArea.textContent = '';
                messageArea.className = 'mt-6 text-center font-medium text-lg hidden';
            }
            
            // Reset the instrument display in case it was showing a sad face
            const instrumentDisplay = document.getElementById('instrument-display');
            if (instrumentDisplay && instrumentImage) {
                instrumentDisplay.innerHTML = '';
                instrumentDisplay.appendChild(instrumentImage);
                instrumentImage.style.display = 'block';
            }
        });
    }
    
    // Add enter key support for the input field
    if (guessInput) {
        guessInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                checkGuess();
            }
        });
    }
    
    // Initialize the game
    initGame();
});
