// Game logic script for the instrument guessing game
import { instruments, getRandomInstrument, checkAnswer } from '../data/instruments.js';
import confetti from 'canvas-confetti';

// Flag to prevent multiple rapid clicks
let isPlayingSound = false;

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get the current language from HTML
    const currentLang = document.documentElement.lang || 'en';
    
    // DOM elements
    const playButton = document.getElementById('play-sound-button');
    const guessInput = document.getElementById('guess-input');
    const submitButton = document.getElementById('submit-guess');
    const resetButton = document.getElementById('reset-button');
    const messageArea = document.getElementById('message-area');
    const instrumentImage = document.getElementById('instrument-image');
    const scoreDisplay = document.getElementById('score');
    
    // Game state variables
    let currentInstrument = null;
    let currentlyPlayingInstrument = null; // Track which instrument is currently playing
    let hasPlayedSound = false;
    let score = 0;
    let wrongGuessCount = 0;
    
    // Track progress through all instruments
    let instrumentIds = Object.keys(instruments);
    let currentInstrumentIndex = 0;
    let completedInstruments = new Set();
    
    // Get the next instrument in sequence
    function getNextInstrument() {
        // Check if we've completed all instruments
        if (completedInstruments.size >= instrumentIds.length) {
            return null; // All instruments completed
        }
        
        // Get the next instrument that hasn't been completed yet
        let nextIndex = currentInstrumentIndex;
        let attempts = 0;
        
        // Find the next uncompleted instrument
        while (attempts < instrumentIds.length) {
            const instrumentId = instrumentIds[nextIndex];
            if (!completedInstruments.has(instrumentId)) {
                // Update the index for next time
                currentInstrumentIndex = (nextIndex + 1) % instrumentIds.length;
                
                // Return the instrument with its ID
                const instrument = instruments[instrumentId];
                return { ...instrument, id: instrumentId };
            }
            
            // Move to the next instrument
            nextIndex = (nextIndex + 1) % instrumentIds.length;
            attempts++;
        }
        
        return null; // All instruments completed (fallback)
    }
    
    // Initialize the game state
    function initGame() {
        // Only get a new instrument if we don't already have one
        // or if we're explicitly resetting the game
        if (!currentInstrument) {
            currentInstrument = getNextInstrument();
            console.log('New instrument initialized:', currentInstrument?.id, currentInstrument?.name?.en);
            console.log('Instrument details:', {
                id: currentInstrument?.id,
                name: currentInstrument?.name,
                sound: currentInstrument?.sound,
                image: currentInstrument?.image
            });
        }
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
    
    // Function to stop any currently playing sound
    function stopSound() {
        // Find any audio elements that might be playing
        const audioElements = document.querySelectorAll('audio');
        audioElements.forEach(audio => {
            console.log('Stopping audio element');
            try {
                audio.pause();
                audio.remove(); // Remove the element completely
            } catch (e) {
                console.error('Error stopping audio:', e);
            }
        });
        
        // Reset the playing flag when stopping sound
        isPlayingSound = false;
    }
    
    // Function to ensure all audio is stopped before proceeding
    function ensureAudioStopped() {
        return new Promise(resolve => {
            stopSound();
            // Add a small delay to ensure audio operations don't conflict
            setTimeout(() => {
                resolve();
            }, 100); // 100ms delay should be enough
        });
    }
    
    // Play the instrument sound
    function playSound() {
        // Prevent multiple rapid clicks
        if (isPlayingSound) {
            console.log('Already playing a sound, ignoring click');
            return;
        }
        
        // Set the flag to prevent multiple clicks
        isPlayingSound = true;
        
        // Make sure we have a current instrument
        if (!currentInstrument) {
            initGame();
        }

        // If we've already guessed correctly, don't change the instrument
        // This ensures we're always playing the sound for the current instrument
        
        if (!currentInstrument) {
            console.error('No current instrument');
            isPlayingSound = false; // Reset the flag
            return;
        }
        
        // Stop any currently playing sound first with a delay to prevent conflicts
        ensureAudioStopped().then(() => {
            // Store the currently playing instrument to ensure consistency
            currentlyPlayingInstrument = currentInstrument;
            
            console.log('Playing instrument:', currentlyPlayingInstrument.id, currentlyPlayingInstrument.name.en);
            console.log('Sound file path:', currentlyPlayingInstrument.sound);
        
            try {
                // Create a completely new audio element each time
                const audioPlayer = document.createElement('audio');
                audioPlayer.id = 'instrument-audio-player';
                document.body.appendChild(audioPlayer); // Add to DOM for proper cleanup later
                
                // Set up event listeners
                audioPlayer.oncanplaythrough = function() {
                    console.log('Audio can play through');
                };
                
                audioPlayer.onplay = function() {
                    console.log('Audio started playing');
                    hasPlayedSound = true;
                    if (playButton) {
                        playButton.textContent = '🔄 Play Again';
                    }
                };
                
                audioPlayer.onended = function() {
                    console.log('Audio playback ended');
                    isPlayingSound = false; // Reset the flag when audio ends
                    // Remove the audio element when done
                    setTimeout(() => {
                        audioPlayer.remove();
                    }, 100);
                };
                
                audioPlayer.onerror = function(e) {
                    console.error('Error playing audio:', e);
                    isPlayingSound = false; // Reset the flag on error
                    if (messageArea) {
                        messageArea.textContent = 'Error playing sound. Please try again.';
                        messageArea.className = 'mt-6 text-center font-medium text-lg text-red-500';
                    }
                    // Remove the audio element on error
                    audioPlayer.remove();
                };
                
                // Set the source and load the audio
                audioPlayer.src = currentlyPlayingInstrument.sound;
                
                // Play the audio (this returns a promise)
                const playPromise = audioPlayer.play();
                
                // Handle the play promise
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log('Play promise resolved successfully');
                    }).catch(error => {
                        console.error('Playback failed:', error);
                        isPlayingSound = false; // Reset the flag on play error
                        if (messageArea) {
                            messageArea.textContent = 'Error playing sound. Please try again.';
                            messageArea.className = 'mt-6 text-center font-medium text-lg text-red-500';
                        }
                        // Remove the audio element on error
                        audioPlayer.remove();
                    });
                }
            } catch (error) {
                console.error('Error setting up audio:', error);
                isPlayingSound = false; // Reset the flag on error
                if (messageArea) {
                    messageArea.textContent = 'Error playing sound. Please try again.';
                    messageArea.className = 'mt-6 text-center font-medium text-lg text-red-500';
                }
            }
        }).catch(error => {
            console.error('Error in ensureAudioStopped:', error);
            isPlayingSound = false; // Reset the flag on error
        });
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
        
        // Use the currently playing instrument for consistency
        if (!currentlyPlayingInstrument) {
            console.error('No currently playing instrument found');
            if (messageArea) {
                messageArea.textContent = 'Please play the sound first!';
                messageArea.className = 'mt-6 text-center font-medium text-lg text-amber-500';
            }
            return;
        }
        
        // Debug the current instrument before checking
        console.log('Current instrument when checking guess:', currentInstrument.id, currentInstrument.name.en);
        console.log('Currently playing instrument:', currentlyPlayingInstrument.id, currentlyPlayingInstrument.name.en);
        console.log('Currently playing instrument image path:', currentlyPlayingInstrument.image);
        
        // Check if the guess is correct using the currently playing instrument
        const isCorrect = checkAnswer(userGuess, currentlyPlayingInstrument.id);
        
        if (isCorrect) {
            // Mark this instrument as completed
            completedInstruments.add(currentlyPlayingInstrument.id);
            console.log(`Marked ${currentlyPlayingInstrument.id} as completed. Total completed: ${completedInstruments.size}/${instrumentIds.length}`);
            
            // Check if all instruments have been completed
            const allCompleted = completedInstruments.size >= instrumentIds.length;
            
            // Success! Show the correct answer and confetti
            if (messageArea) {
                if (allCompleted) {
                    messageArea.textContent = `Congratulations! You've completed all ${instrumentIds.length} instruments!`;
                    messageArea.className = 'mt-6 text-center font-bold text-xl text-green-500';
                } else {
                    messageArea.textContent = `Correct! It's a ${currentlyPlayingInstrument.name[currentLang]}!`;
                    messageArea.className = 'mt-6 text-center font-medium text-lg text-green-500';
                }
            }
            
            // Reset wrong guess counter on correct answer
            wrongGuessCount = 0;
            if (instrumentImage) {
                console.log('Setting image for correct guess:', currentlyPlayingInstrument.id, currentlyPlayingInstrument.name.en);
                console.log('Image path being set:', currentlyPlayingInstrument.image);
                instrumentImage.src = currentlyPlayingInstrument.image;
                instrumentImage.alt = currentlyPlayingInstrument.name[currentLang];
                instrumentImage.style.display = 'block'; // Make sure the image is visible
            }
            
            // Make sure the instrument display is visible and contains the image
            const instrumentDisplay = document.getElementById('instrument-display');
            if (instrumentDisplay) {
                instrumentDisplay.style.display = 'block';
                // Clear any existing content (like sad face)
                instrumentDisplay.innerHTML = '';
                // Add the image back if it's not already there
                if (!instrumentDisplay.contains(instrumentImage) && instrumentImage) {
                    instrumentDisplay.appendChild(instrumentImage);
                }
            }
            
            // Add confetti effect for success
            if (completedInstruments.size >= instrumentIds.length) {
                // More spectacular confetti for completing all instruments
                const duration = 3000;
                const end = Date.now() + duration;
                
                // Create a confetti interval for a more spectacular effect
                const confettiInterval = setInterval(function() {
                    if (Date.now() > end) {
                        return clearInterval(confettiInterval);
                    }
                    
                    confetti({
                        particleCount: 50,
                        spread: 80,
                        origin: { x: Math.random(), y: Math.random() - 0.2 },
                        colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF9F1C', '#2EC4B6', '#E71D36']
                    });
                }, 200);
            } else {
                // Regular confetti for individual success
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#FF6B6B', '#4ECDC4', '#FFE66D']
                });
            }
            
            // Disable input until next round
            if (guessInput) {
                guessInput.disabled = true;
            }
            if (submitButton) {
                submitButton.disabled = true;
            }
            
            // Highlight the reset button to make it more visible
            if (resetButton) {
                resetButton.classList.remove('bg-gray-300', 'hover:bg-gray-400', 'text-gray-700');
                resetButton.classList.add('bg-green-500', 'hover:bg-green-600', 'text-white', 'animate-pulse');
            }
            
            // Add a slight delay before allowing a new game
            setTimeout(() => {
                // Check if all instruments have been completed
                const allCompleted = completedInstruments.size >= instrumentIds.length;
                
                if (playButton) {
                    if (allCompleted) {
                        // All instruments completed - change button text
                        playButton.textContent = 'Start New Game 🎮';
                        playButton.onclick = () => {
                            // Reset the completed instruments tracking
                            completedInstruments.clear();
                            currentInstrumentIndex = 0;
                            
                            // Reset the game
                            initGame();
                            if (guessInput) guessInput.disabled = false;
                            if (submitButton) submitButton.disabled = false;
                            if (playButton) {
                                playButton.textContent = 'Play Sound 🔊';
                                playButton.onclick = playSound;
                            }
                            // Reset the button styling
                            if (resetButton) {
                                resetButton.classList.remove('bg-green-500', 'hover:bg-green-600', 'text-white', 'animate-pulse');
                                resetButton.classList.add('bg-gray-300', 'hover:bg-gray-400', 'text-gray-700');
                            }
                        };
                    } else {
                        // Normal flow - just move to next instrument
                        playButton.textContent = 'Play New Sound 🎵';
                        playButton.onclick = () => {
                            initGame();
                            if (guessInput) guessInput.disabled = false;
                            if (submitButton) submitButton.disabled = false;
                            if (playButton) playButton.onclick = playSound;
                            // Reset the button styling when starting a new game via play button
                            if (resetButton) {
                                resetButton.classList.remove('bg-green-500', 'hover:bg-green-600', 'text-white', 'animate-pulse');
                                resetButton.classList.add('bg-gray-300', 'hover:bg-gray-400', 'text-gray-700');
                            }
                        };
                    }
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
                instrumentImage.style.display = 'block'; // Make sure the image is visible
            }
            
            // Make sure the instrument display is visible and contains the image
            const instrumentDisplay = document.getElementById('instrument-display');
            if (instrumentDisplay) {
                instrumentDisplay.style.display = 'block';
                // Add the image back if it's not already there
                if (!instrumentDisplay.contains(instrumentImage) && instrumentImage) {
                    instrumentDisplay.innerHTML = ''; // Clear any existing content
                    instrumentDisplay.appendChild(instrumentImage);
                }
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
    
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            // Stop any currently playing sound with a delay to prevent conflicts
            ensureAudioStopped().then(() => {
                // Check if all instruments have been completed
                const allCompleted = completedInstruments.size >= instrumentIds.length;
                
                if (allCompleted) {
                    // Reset the completed instruments tracking for a new game
                    completedInstruments.clear();
                    currentInstrumentIndex = 0;
                    if (messageArea) {
                        messageArea.textContent = 'Starting a new game! Listen and guess the instruments.';
                        messageArea.className = 'mt-6 text-center font-medium text-lg text-sky-500';
                    }
                }
                
                // Reset the currently playing instrument
                currentlyPlayingInstrument = null;
                
                // Reset hasPlayedSound flag
                hasPlayedSound = false;
                
                // Force a new instrument by setting currentInstrument to null first
                currentInstrument = null;
                
                // Then get a new instrument in sequence
                currentInstrument = getNextInstrument();
                console.log('Reset: New instrument initialized:', currentInstrument?.id, currentInstrument?.name?.en);
                
                // Make sure all elements are reset and enabled
                if (submitButton) submitButton.disabled = false;
                if (resetButton) resetButton.disabled = false;
                if (guessInput) {
                    guessInput.disabled = false;
                    guessInput.value = '';
                    guessInput.focus();
                }
                if (messageArea) {
                    messageArea.textContent = '';
                    messageArea.className = 'mt-6 text-center font-medium text-lg hidden';
                }
            
                // Reset the instrument display and hide the image
                const instrumentDisplay = document.getElementById('instrument-display');
                if (instrumentDisplay) {
                    // Clear any content (like sad face)
                    instrumentDisplay.innerHTML = '';
                    
                    // Reset and hide the instrument image
                    if (instrumentImage) {
                        instrumentImage.src = '';
                        instrumentImage.alt = '';
                        instrumentImage.style.display = 'none';
                        
                        // Add back the empty instrument image element if needed
                        if (!instrumentDisplay.contains(instrumentImage)) {
                            instrumentDisplay.appendChild(instrumentImage);
                        }
                    }
                }
                
                // Reset the play button text
                if (playButton) {
                    playButton.textContent = playButton.textContent.includes('Again') 
                        ? 'Play Sound 🔊' 
                        : playButton.textContent;
                    playButton.onclick = playSound;
                }
                
                // Reset the button styling
                if (resetButton) {
                    resetButton.classList.remove('bg-green-500', 'hover:bg-green-600', 'text-white', 'animate-pulse');
                    resetButton.classList.add('bg-gray-300', 'hover:bg-gray-400', 'text-gray-700');
                }
            }).catch(error => {
                console.error('Error in reset button handler:', error);
                // Make sure to reset the playing flag even if there's an error
                isPlayingSound = false;
            });
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
