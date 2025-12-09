// Init AudioContext (lazy initialization)
let audioContext = null;

function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Resume context if suspended (required by some browsers)
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    return audioContext;
}

const baseFreq = 196; // G3 as base frequency
const letters = 'abcdefghijklmnopqrstuvwxyz';
const durationPerLetter = 0.2; // seconds
const durationPerSpace = 1.0; // seconds

function playTone(frequency, duration = durationPerLetter) {
    const ctx = initAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'square'; // square wave
    oscillator.frequency.value = frequency;

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
}

function playSilence(duration = durationPerSpace) {
    // Wait without playing sound
    return new Promise(resolve => setTimeout(resolve, duration * 1000));
}

async function playText() {
    const text = document.getElementById("textInput").value;
    console.log("Playing text as sound:", text);

    const durationPerLetter = parseFloat(document.getElementById("duration").value);
    const durationPerSpace = parseFloat(document.getElementById("spaceSilence").value);
    const baseFreq = parseFloat(document.getElementById("baseFreq").value);

    for (const ch of text) {
        if (ch === ' ') {
            await playSilence(durationPerSpace);
        } else if (letters.includes(ch.toLowerCase())) {
            const idx = letters.indexOf(ch.toLowerCase());
            const freq = baseFreq * Math.pow(2, idx / 12);
            playTone(freq, durationPerLetter);
            await playSilence(0.05);
        }
    }
}
