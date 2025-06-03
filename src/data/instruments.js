/**
 * @typedef {Object} Instrument
 * @property {Object} name - The display name of the instrument in different languages
 * @property {string} name.en - English name
 * @property {string} name.ro - Romanian name
 * @property {string} sound - URL to the sound file
 * @property {string} image - URL to the image file
 * @property {string[]} aliases - Alternative names that should be accepted
 */

/**
 * @type {Record<string, Instrument>}
 */
export const instruments = {
    piano: {
        name: {
            en: "Piano",
            ro: "Pian"
        },
        sound: "/sounds/piano.mp3", // Stays the same
        image: "/images/piano.jpg", // Stays the same
        aliases: ["grand piano", "upright piano", "keyboard", "pian cu coada", "pianina"]
    },
    violin: {
        name: {
            en: "Violin",
            ro: "Vioară"
        },
        sound: "/sounds/violin.mp3",
        image: "/images/violin.jpg",
        aliases: ["fiddle", "vioara", "violina"]
    },
    guitar: {
        name: {
            en: "Guitar",
            ro: "Chitară"
        },
        sound: "/sounds/guitar.mp3",
        image: "/images/guitar.jpg",
        aliases: ["acoustic guitar", "chitara", "chitara acustica"]
    },
    electricguitar: {
        name: {
            en: "Electric Guitar",
            ro: "Chitara"
        },
        sound: "/sounds/eguitar.mp3",
        image: "/images/eguitar.png",
        aliases: ["electric guitar", "chitara", "chitara electrică"]
    },
    bassguitar: {
        name: {
            en: "Bass Guitar",
            ro: "Bass"
        },
        sound: "/sounds/bass.mp3",
        image: "/images/bass.jpg",
        aliases: ["bass guitar", "bass", "chitara bass"]
    },
    flute: {
        name: {
            en: "Flute",
            ro: "Flaut"
        },
        sound: "/sounds/flute.wav",
        image: "/images/flute.jpg",
        aliases: ["transverse flute", "concert flute", "flaut", "flaut traversier"]
    },
    drums: {
        name: {
            en: "Drums",
            ro: "Tobe"
        },
        sound: "/sounds/drums.mp3",
        image: "/images/drums.jpg",
        aliases: ["drum kit", "drum set", "percussion", "tobe", "set de tobe", "baterie"]
    },
    trumpet: {
        name: {
            en: "Trumpet",
            ro: "Trompetă"
        },
        sound: "/sounds/trumpet.mp3",
        image: "/images/trumpet.jpg",
        aliases: ["trompeta", "goarna"]
    },
    saxophone: {
        name: {
            en: "Saxophone",
            ro: "Saxofon"
        },
        sound: "/sounds/saxophone.mp3",
        image: "/images/saxophone.jpg",
        aliases: ["sax", "saxofon", "saxofonul"]
    },
    cello: {
        name: {
            en: "Cello",
            ro: "Violoncel"
        },
        sound: "/sounds/cello.mp3",
        image: "/images/cello.jpg",
        aliases: ["violoncello", "violoncel", "cello"]
    },
    harp: {
        name: {
            en: "Harp",
            ro: "Harpă"
        },
        sound: "/sounds/harp.mp3",
        image: "/images/harp.jpg",
        aliases: ["concert harp", "arpa", "harpa"]
    },
    accordion: {
        name: {
            en: "Accordion",
            ro: "Acordeon"
        },
        sound: "/sounds/accordion.mp3", // Swapped with tambourine sound
        image: "/images/accordion.jpg",
        aliases: ["squeezebox", "acordeon", "armonică"]
    },
    // New Instruments Start Here
    xylophone: {
        name: {
            en: "Xylophone",
            ro: "Xilofon"
        },
        sound: "/sounds/xylophone.mp3",
        image: "/images/xylophone.jpg",
        aliases: ["xylo", "xilofon"]
    },
    triangle: {
        name: {
            en: "Triangle",
            ro: "Triunghi"
        },
        sound: "/sounds/triangle.mp3",
        image: "/images/triangle.jpg",
        aliases: ["trianglu", "muzical triangle", "triunghi"]
    },
    tambourine: {
        name: {
            en: "Tambourine",
            ro: "Tamburina"
        },
        sound: "/sounds/tambourine.mp3", // Swapped with accordion sound
        image: "/images/tambourine.jpg",
        aliases: ["tambourin", "tambourin", "tamburina"]
    }
};

/**
 * Get a random instrument from the instruments collection
 * @returns {Instrument & { id: string }} A random instrument with its ID
 */
export function getRandomInstrument() {
    const keys = Object.keys(instruments);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return {
        id: randomKey,
        ...instruments[randomKey]
    };
}

/**
 * Check if the user's guess matches the instrument
 * @param {string} guess - The user's guess
 * @param {string} instrumentId - The ID of the correct instrument
 * @returns {boolean} Whether the guess is correct
 */
export function checkAnswer(guess, instrumentId) {
    if (!guess || !instrumentId) return false;
    
    guess = guess.toLowerCase().trim();
    const instrument = instruments[instrumentId];
    
    if (!instrument) return false;
    
    // Check against the instrument name in both languages
    if (guess === instrument.name.en.toLowerCase() || 
        guess === instrument.name.ro.toLowerCase()) {
        return true;
    }
    
    // Check against aliases if they exist
    if (instrument.aliases && instrument.aliases.length > 0) {
        return instrument.aliases.some(alias => 
            guess === alias.toLowerCase()
        );
    }
    
    return false;
}