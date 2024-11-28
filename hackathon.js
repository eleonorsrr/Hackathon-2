document.addEventListener("DOMContentLoaded", () => {
    
    // 1 Effetti
    // 1.1 Gain
    const kickGain = new Tone.Gain(1).toDestination(); // Volume al 100%
    const clapGain = new Tone.Gain(0.08).toDestination(); // Volume al 100%
    const arpGain = new Tone.Gain(0.20).toDestination(); // Volume al 100%
    const bassGain = new Tone.Gain(0.6).toDestination(); // Volume al 100%
    const chordGain = new Tone.Gain(0.5).toDestination(); // Volume al 100%
    // 1.2 Reverb
    const reverb = new Tone.Reverb({
        decay: 2, // Durata del riverbero
        preDelay: 0.01, // Ritardo iniziale
        wet: 0.6, // Quantità di effetto
    }).toDestination();

    // 2 Strumenti
    // 2.1 Synth1 (arpeggio)
    const synth = new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.1, decay: 0.2, sustain: 0.5, release: 1.2 }
    }).connect(arpGain);
    // 2.2 Synth 2 (basso)
    const bassSynth = new Tone.MonoSynth({
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0.5, release: 1 },
    }).connect(bassGain);;
    // 2.3 Synth 3 (chords)
    const chordSynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.05, decay: 0.3, sustain: 0.6, release: 1 },
    }).connect(chordGain);;

    // 3 Percussioni
    // 3.1 Kick 
    const kick = new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 4,
        oscillator: { type: "sine" },
        envelope: {
            attack: 0.001,
            decay: 0.4,
            sustain: 0.01,
            release: 1.4,
        },
    }).connect(kickGain);
    // 3.2 Clap
    const clap = new Tone.NoiseSynth({
        noise: { type: "white" },
        envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.1 },
    }).connect(clapGain).connect(reverb);

    // 4 Note
    // 4.1 arpeggio
    const notes = [
        "G5", "F5", "D5", "F5",
        "D5", "F5", "G5",
        "D5", "F5", "G5",
        "G5", "F5", "D5", "F5",
        "D5", "F5", "G5",
        "D5", "F5", "G5",
        "G5", "F5", "D5", "F5",
        "D5", "F5", "G5",
        "Bb5", "D5", "F5",
    ];
    // 4.2 basso
    const bassNotes = [
        "Bb2", "A2", "G2", null,
        "Eb2", "F2", "C2", null,
        "C2", "D2", "Eb2", null, 
        "F2", null, "G2", null,
        ];
    // 4.3 chords
    const chords = [
        ["G4", "Bb4"], // Accordo di G minore
        ["G4", "Bb4"], // Accordo di G minore
        ["F4", "A4"], // Accordo di F maggiore
        ["F4", "A4"], // Accordo di F maggiore
        ["G4", "D4"], // Accordo di D minore
        ["G4", "D4"], // Accordo di D minore
        ["G4", "D4"], // Accordo di D minore
        ["G4", "D4"], // Accordo di D minore
    ];

    // 5 Sequenze melodiche 
    // 5.1 arpeggio
    const arpeggio = new Tone.Sequence(
        (time, note) => {
            synth.triggerAttackRelease(note, "16n", time);
        },
        notes,
        "16n" // Durata delle note
    );
    // 5.2 bass
    const bass = new Tone.Sequence((time, note) => {
        if (note) bassSynth.triggerAttackRelease(note, "4n", time);
    }, bassNotes, "4n");
    // 5.3 chords
    const chordSequence = new Tone.Sequence((time, chord) => {
        if (chord) chordSynth.triggerAttackRelease(chord, "8n", time); // Suona l'accordo per mezza battuta
    }, chords, "8n");

    // 6 Sequenze ritmiche
    // 6.1 Kick
    const kickLoop = new Tone.Loop((time) => {
        kick.triggerAttackRelease("C1", "8n", time);
    }, "4n");
    // 6.2 Clap
    const clapLoop = new Tone.Loop((time) => {
        clap.triggerAttackRelease("16n", time);
    }, "2n");

    // 7. Struttura della traccia 
    const songStructure = new Tone.Part((time, event) => {
        switch (event.type) {
            case "startKickClap":
                kickLoop.start(time);
                clapLoop.start(time);
                break;
            case "startArpeggio":
                arpeggio.start(time);
                break;
            case "startChords":
                chordSequence.start(time);
                break;
            case "startBass":
                bass.start(time);
                break;
        }
    }, [
        { time: 0, type: "startKickClap" }, // Batteria all'inizio
        { time: "7.5s", type: "startArpeggio" }, // Dopo 4 battute aggiungi arpeggio
        { time: "15.5s", type: "startChords" }, // Dopo 8 battute aggiungi accordi
        { time: "31.5s", type: "startBass" }, // Dopo 8 battute aggiungi accordi
    ]);

    // 8 Controlli
    // 8.1 Start
    document.querySelector("#start-button").addEventListener("click", async () => {
        await Tone.start();
        Tone.Transport.bpm.value = 126; // Imposta il BPM
        songStructure.start(0); // Avvia la struttura
        Tone.Transport.start();
    });
    // 8.2 Stop
    document.querySelector("#stop-button").addEventListener("click", () => {
        songStructure.stop(); // Avvia la struttura
        Tone.Transport.stop();
    });
});

// visualssss


// Aggiungi l'effetto di sfondo quando premi "Start"
document.getElementById('start-button').addEventListener('click', () => {
    // Aggiungi la classe che mostra lo sfondo
    document.body.classList.add('background-active');
    
  });
  
  // Rimuovi l'effetto di sfondo quando premi "Stop"
  document.getElementById('stop-button').addEventListener('click', () => {
    // Rimuovi la classe che nasconde lo sfondo
    document.body.classList.remove('background-active');
    
  });

