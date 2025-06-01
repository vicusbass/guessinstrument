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
        sound: "/sounds/instruments/violin.mp3",
        image: "/images/instruments/violin.jpg",
        aliases: ["fiddle", "vioara", "violina"]
    },
    guitar: {
        name: {
            en: "Guitar",
            ro: "Chitară"
        },
        sound: "/sounds/instruments/guitar.mp3",
        image: "/images/instruments/guitar.jpg",
        aliases: ["acoustic guitar", "chitara", "chitara acustica"]
    },
    flute: {
        name: {
            en: "Flute",
            ro: "Flaut"
        },
        sound: "/sounds/instruments/flute.mp3",
        image: "/images/instruments/flute.jpg",
        aliases: ["transverse flute", "concert flute", "flaut", "flaut traversier"]
    },
    drums: {
        name: {
            en: "Drums",
            ro: "Tobe"
        },
        sound: "/sounds/instruments/drums.mp3",
        image: "/images/instruments/drums.jpg",
        aliases: ["drum kit", "drum set", "percussion", "tobe", "set de tobe", "baterie"]
    },
    trumpet: {
        name: {
            en: "Trumpet",
            ro: "Trompetă"
        },
        sound: "/sounds/instruments/trumpet.mp3",
        image: "/images/instruments/trumpet.jpg",
        aliases: ["trompeta", "goarna"]
    },
    saxophone: {
        name: {
            en: "Saxophone",
            ro: "Saxofon"
        },
        sound: "/sounds/instruments/saxophone.mp3",
        image: "/images/instruments/saxophone.jpg",
        aliases: ["sax", "saxofon", "saxofonul"]
    },
    cello: {
        name: {
            en: "Cello",
            ro: "Violoncel"
        },
        sound: "/sounds/instruments/cello.mp3",
        image: "/images/instruments/cello.jpg",
        aliases: ["violoncello", "violoncel", "cello"]
    },
    harp: {
        name: {
            en: "Harp",
            ro: "Harpă"
        },
        sound: "/sounds/instruments/harp.mp3",
        image: "/images/instruments/harp.jpg",
        aliases: ["concert harp", "arpa", "harpa"]
    },
    accordion: {
        name: {
            en: "Accordion",
            ro: "Acordeon"
        },
        sound: "/sounds/instruments/accordion.mp3",
        image: "/images/instruments/accordion.jpg",
        aliases: ["squeezebox", "acordeon", "armonică"]
    },
    // New Instruments Start Here
    xylophone: {
        name: {
            en: "Xylophone",
            ro: "Xilofon"
        },
        sound: "/sounds/instruments/xylophone.mp3",
        image: "/images/instruments/xylophone.jpg",
        aliases: ["xylo", "xilofon"]
    },
    recorder: {
        name: {
            en: "Recorder",
            ro: "Flaut dulce"
        },
        sound: "/sounds/instruments/recorder.mp3",
        image: "/images/instruments/recorder.jpg",
        aliases: ["blockflote", "flaut dulce", "recorder"]
    },
    tambourine: {
        name: {
            en: "Tambourine",
            ro: "Tamburină"
        },
        sound: "/sounds/instruments/tambourine.mp3",
        image: "/images/instruments/tambourine.jpg",
        aliases: ["tamburina", "dairea"]
    },
    cymbals: {
        name: {
            en: "Cymbals",
            ro: "Cinele"
        },
        sound: "/sounds/instruments/cymbals.mp3",
        image: "/images/instruments/cymbals.jpg",
        aliases: ["cimbal", "cinele", "talgere"]
    },
    clarinet: {
        name: {
            en: "Clarinet",
            ro: "Clarinet"
        },
        sound: "/sounds/instruments/clarinet.mp3",
        image: "/images/instruments/clarinet.jpg",
        aliases: ["clarinet"]
    },
    triangle: {
        name: {
            en: "Triangle",
            ro: "Trianglu"
        },
        sound: "/sounds/instruments/triangle.mp3",
        image: "/images/instruments/triangle.jpg",
        aliases: ["trianglu", "muzical triangle"]
    },
    bongos: {
        name: {
            en: "Bongos",
            ro: "Bongosuri"
        },
        sound: "/sounds/instruments/bongos.mp3",
        image: "/images/instruments/bongos.jpg",
        aliases: ["bongo drums", "bongosuri"]
    },
    harmonica: {
        name: {
            en: "Harmonica",
            ro: "Muzicuță"
        },
        sound: "/sounds/instruments/harmonica.mp3",
        image: "/images/instruments/harmonica.jpg",
        aliases: ["muzicuță", "mouth organ"]
    },
    banjo: {
        name: {
            en: "Banjo",
            ro: "Banjo"
        },
        sound: "/sounds/instruments/banjo.mp3",
        image: "/images/instruments/banjo.jpg",
        aliases: ["banjo"]
    },
    ukulele: {
        name: {
            en: "Ukulele",
            ro: "Ukulele"
        },
        sound: "/sounds/instruments/ukulele.mp3",
        image: "/images/instruments/ukulele.jpg",
        aliases: ["ukulele", "uke"]
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