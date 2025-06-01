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
        sound: "/sounds/piano.mp3",
        image: "/images/piano.jpg",
        aliases: ["grand piano", "upright piano", "keyboard", "pian cu coada", "pianina"]
    },
    violin: {
        name: {
            en: "Violin",
            ro: "Vioară"
        },
        sound: "/sounds/piano.mp3",
        image: "https://images.unsplash.com/photo-1465821185615-20b3c2fbf41b?w=600&h=400&fit=crop",
        aliases: ["fiddle", "vioara", "violina"]
    },
    guitar: {
        name: {
            en: "Guitar",
            ro: "Chitară"
        },
        sound: "/sounds/piano.mp3",
        image: "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=600&h=400&fit=crop",
        aliases: ["acoustic guitar", "chitara", "chitara acustica"]
    },
    flute: {
        name: {
            en: "Flute",
            ro: "Flaut"
        },
        sound: "/sounds/piano.mp3",
        image: "https://images.unsplash.com/photo-1593789198777-f29bc259780e?w=600&h=400&fit=crop",
        aliases: ["transverse flute", "concert flute", "flaut", "flaut traversier"]
    },
    drums: {
        name: {
            en: "Drums",
            ro: "Tobe"
        },
        sound: "/sounds/piano.mp3",
        image: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=600&h=400&fit=crop",
        aliases: ["drum kit", "drum set", "percussion", "tobe", "set de tobe", "baterie"]
    },
    trumpet: {
        name: {
            en: "Trumpet",
            ro: "Trompetă"
        },
        sound: "/sounds/piano.mp3",
        image: "https://images.unsplash.com/photo-1573871669414-010dbaf28a6b?w=600&h=400&fit=crop",
        aliases: ["trompeta", "goarna"]
    },
    saxophone: {
        name: {
            en: "Saxophone",
            ro: "Saxofon"
        },
        sound: "/sounds/piano.mp3",
        image: "https://images.unsplash.com/photo-1556806779-dd49e0c35a2f?w=600&h=400&fit=crop",
        aliases: ["sax", "saxofon", "saxofonul"]
    },
    cello: {
        name: {
            en: "Cello",
            ro: "Violoncel"
        },
        sound: "/sounds/piano.mp3",
        image: "https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=600&h=400&fit=crop",
        aliases: ["violoncello", "violoncel", "cello"]
    },
    harp: {
        name: {
            en: "Harp",
            ro: "Harpă"
        },
        sound: "/sounds/piano.mp3",
        image: "https://images.unsplash.com/photo-1563459802257-2a97df940f11?w=600&h=400&fit=crop",
        aliases: ["concert harp", "arpa", "harpa"]
    },
    accordion: {
        name: {
            en: "Accordion",
            ro: "Acordeon"
        },
        sound: "/sounds/piano.mp3",
        image: "https://images.unsplash.com/photo-1575900057347-7f9f97515e42?w=600&h=400&fit=crop",
        aliases: ["squeezebox", "acordeon", "armonică"]
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