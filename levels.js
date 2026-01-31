const DATA = [
    {
        id: "m1",
        title: "MODULE 1 – Core Learning",
        description: "Build correct typing habits from zero.",
        minAccuracy: 85,
        hintMode: "full", // full, fading, minimal
        levels: [
            // Levels 1-5: Home Row Letters
            { id: "1-1", title: "Level 1: F & J", content: "f j f j ff jj fff jjj fj jf fjf jfj" },
            { id: "1-2", title: "Level 2: D & K", content: "d k d k dd kk ddd kkk dk kd dkd kdk f d j k" },
            { id: "1-3", title: "Level 3: S & L", content: "s l s l ss ll sss lll sl ls sls lsl d s k l" },
            { id: "1-4", title: "Level 4: A & ;", content: "a ; a ; aa ;; aaa ;;; a; ;a a;a ;a; s a l ;" },
            { id: "1-5", title: "Level 5: Mixed Home", content: "asdf jkl; fdsa ;lkj a s d f j k l ; dad sad lad fall" },

            // Levels 6-10: Short Words
            { id: "1-6", title: "Level 6: 2-3 Letters", content: "as ad fa da ja la al all dad lad fad sad ask add" },
            { id: "1-7", title: "Level 7: 3 Letters", content: "all ask dad fad fall gal had hall has jag lad lag sad sag" },
            { id: "1-8", title: "Level 8: 4 Letters", content: "flask dask asks dads lads fads falls gals halls jags lags" },
            { id: "1-9", title: "Level 9: Top Row Intro", content: "pot top lot rot tot dot hot got not pot for did" },
            { id: "1-10", title: "Level 10: Transitions", content: "the and for are but not you all any can her was one" },

            // Levels 11-15: Sentences
            { id: "1-11", title: "Level 11: Simple", content: "a sad lad a dad asks a lad falls a dad had a salad" },
            { id: "1-12", title: "Level 12: Basic", content: "the dog ran far the cat sat still the sun is hot" },
            { id: "1-13", title: "Level 13: Syntax", content: "let x be one var y is two if true then do this" },
            { id: "1-14", title: "Level 14: Practice", content: "practice make perfect coding is fun type every day" },
            { id: "1-15", title: "Level 15: Complex", content: "She sells sea shells by the sea shore. The quick brown fox." },

            // Levels 16-20: Passages
            { id: "1-16", title: "Level 16: Journey", content: "The journey of a thousand miles begins with a single step. Do not rush the process. Accuracy ensures speed later on." },
            { id: "1-17", title: "Level 17: Tech", content: "Computers are incredibly fast, accurate, and stupid. Human beings are incredibly slow, inaccurate, and brilliant. Together they are powerful." },
            { id: "1-18", title: "Level 18: Motive", content: "Failure is simply the opportunity to begin again, this time more intelligently. Keep typing and keep learning." },
            { id: "1-19", title: "Level 19: Pangram", content: "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. Sphinx of black quartz, judge my vow." },
            { id: "1-20", title: "Level 20: Mastery", content: "You have reached the end of Module 1. Your fingers now know the way. Trust your muscle memory. Speed is a byproduct of precision." }
        ]
    },
    {
        id: "m2",
        title: "MODULE 2 – Hard Module A",
        description: "Push control and accuracy. Hints fade.",
        minAccuracy: 90,
        hintMode: "fading",
        levels: [
            { id: "2-1", title: "Level 21: Discipline", content: "discipline foundation concentration attention repetition perfection" },
            { id: "2-2", title: "Level 22: Keyboard", content: "keyboard hardware software interface algorithm variable function" },
            { id: "2-3", title: "Level 23: Jumps", content: "jump plaza blaze quiet crazy verify mumble bumble fumble jumble" },
            { id: "2-4", title: "Level 24: Length", content: "unconstitutionally characteristically indistinguishable revolutionary" },
            { id: "2-5", title: "Level 25: Speed", content: "The quick motion of the flying bird distracted the silent hunter." }
        ]
    },
    {
        id: "m3",
        title: "MODULE 3 – Hard Module B",
        description: "Precision under pressure. Minimal hints.",
        minAccuracy: 90,
        hintMode: "minimal",
        levels: [
            { id: "3-1", title: "Level 26: Strict", content: "strict practice builds flawless habits accuracy beats speed every time" },
            { id: "3-2", title: "Level 27: Awkward", content: "minimum pumpkin union opinion million onion opinion union minimum" },
            { id: "3-3", title: "Level 28: Numbers", content: "password123 secure456 system789 login000 admin111 user222" },
            { id: "3-4", title: "Level 29: Symbols", content: "print('hello'); if(a > b) { return c; } else { return null; }" },
            { id: "3-5", title: "Level 30: Final", content: "You have mastered the art. The keyboard is now an extension of your mind. Go forth and create." }
        ]
    },
    {
        id: "m4",
        title: "MODULE 4 – Expert Code",
        description: "Complex syntax and symbols. Developer focus.",
        minAccuracy: 92,
        hintMode: "minimal",
        levels: [
            { id: "4-1", title: "Level 31: Brackets", content: "[] {} () [] {} () [()] {()} {{}} [[]] ({})" },
            { id: "4-2", title: "Level 32: Logic", content: "if (x && y) || (z > 0) { return true; } else { return false; }" },
            { id: "4-3", title: "Level 33: Arrays", content: "const arr = [1, 2, 3].map(x => x * 2).filter(x => x > 2);" },
            { id: "4-4", title: "Level 34: CSS", content: ".class { display: flex; justify-content: center; margin: 0; }" },
            { id: "4-5", title: "Level 35: Import", content: "import { useState, useEffect } from 'react'; export default App;" }
        ]
    },
    {
        id: "m5",
        title: "MODULE 5 – Speed Master",
        description: "Final endurance test. Speed and accuracy combined.",
        minAccuracy: 95,
        hintMode: "minimal",
        levels: [
            { id: "5-1", title: "Level 36: Sprint", content: "The quick brown fox jumps over the lazy dog repeatedly." },
            { id: "5-2", title: "Level 37: Flow", content: "River flows into the sea without hesitation or doubt." },
            { id: "5-3", title: "Level 38: Rhythm", content: "Type with rhythm and flow. Do not stop. Keep moving forward." },
            { id: "5-4", title: "Level 39: Focus", content: "Absolute focus is required. Distractions are the enemy of speed." },
            { id: "5-5", title: "Level 40: Legend", content: "You have conquered all challenges. You are now a Typing Master." }
        ]
    }
];

// Flatten for internal use but keep module metadata
const FLAT_LEVELS = [];
DATA.forEach(mod => {
    mod.levels.forEach(lvl => {
        FLAT_LEVELS.push({
            ...lvl,
            moduleTitle: mod.title,
            moduleDesc: mod.description,
            minAccuracy: mod.minAccuracy,
            hintMode: mod.hintMode
        });
    });
});

if (typeof module !== 'undefined') {
    module.exports = { MODULES: DATA, FLAT_LEVELS };
} else {
    // For browser
    window.MODULES = DATA;
    window.FLAT_LEVELS = FLAT_LEVELS;
}
