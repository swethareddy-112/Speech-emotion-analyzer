```javascript
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

const statusText = document.getElementById("status");
const transcript = document.getElementById("transcript");

const emotionText = document.getElementById("emotion");
const emoji = document.getElementById("emoji");
const confidence = document.getElementById("confidence");

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

if (!SpeechRecognition) {

    statusText.textContent =
        "Speech recognition is not supported. Please use Google Chrome.";

    startBtn.disabled = true;

} else {

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    let finalText = "";

    /* Start */

    startBtn.addEventListener("click", () => {

        finalText = "";

        transcript.textContent = "Listening...";

        statusText.textContent =
            "🎙️ Listening... Speak clearly.";

        startBtn.disabled = true;

        try {
            recognition.start();
        } catch (error) {
            console.log(error);
        }

    });

    /* Stop */

    stopBtn.addEventListener("click", () => {

        recognition.stop();

        startBtn.disabled = false;

        statusText.textContent =
            "⏹️ Speech analysis stopped.";

    });

    /* Speech Result */

    recognition.onresult = (event) => {

        let currentText = "";

        for (
            let i = event.resultIndex;
            i < event.results.length;
            i++
        ) {

            const text =
                event.results[i][0].transcript;

            currentText += text;

            if (event.results[i].isFinal) {
                finalText += text + " ";
            }
        }

        transcript.textContent =
            finalText + currentText;

        analyzeEmotion(
            (finalText + currentText).toLowerCase()
        );
    };

    /* Error */

    recognition.onerror = (event) => {

        statusText.textContent =
            "❌ Error: " + event.error;

        startBtn.disabled = false;
    };

    /* End */

    recognition.onend = () => {

        startBtn.disabled = false;

        if (transcript.textContent !== "Listening...") {

            statusText.textContent =
                "✅ Analysis completed.";

        }

    };
}


/* Emotion Analyzer */

function analyzeEmotion(text) {

    if (!text.trim()) {
        return;
    }

    const emotions = {

        happy: [
            "happy",
            "great",
            "good",
            "wonderful",
            "amazing",
            "love",
            "fun",
            "excited",
            "joy",
            "awesome",
            "fantastic",
            "beautiful",
            "nice"
        ],

        sad: [
            "sad",
            "unhappy",
            "cry",
            "crying",
            "lonely",
            "bad",
            "hurt",
            "sorry",
            "miss",
            "depressed",
            "disappointed",
            "upset"
        ],

        angry: [
            "angry",
            "hate",
            "annoying",
            "mad",
            "furious",
            "irritated",
            "stupid",
            "terrible",
            "worst",
            "frustrated"
        ],

        excited: [
            "excited",
            "wow",
            "yay",
            "fantastic",
            "amazing",
            "super",
            "excellent",
            "brilliant"
        ]
    };

    let scores = {
        happy: 0,
        sad: 0,
        angry: 0,
        excited: 0
    };

    for (const emotion in emotions) {

        emotions[emotion].forEach(word => {

            const pattern =
                new RegExp("\\b" + word + "\\b", "gi");

            const matches = text.match(pattern);

            if (matches) {
                scores[emotion] += matches.length;
            }

        });
    }

    let detectedEmotion = "neutral";

    let highestScore = 0;

    for (const emotion in scores) {

        if (scores[emotion] > highestScore) {

            highestScore = scores[emotion];

            detectedEmotion = emotion;
        }
    }

    let detectedEmoji = "😐";

    if (detectedEmotion === "happy") {
        detectedEmoji = "😊";
    }

    if (detectedEmotion === "sad") {
        detectedEmoji = "😢";
    }

    if (detectedEmotion === "angry") {
        detectedEmoji = "😠";
    }

    if (detectedEmotion === "excited") {
        detectedEmoji = "🤩";
    }

    let percent = 0;

    if (highestScore > 0) {

        const total =
            Object.values(scores)
                .reduce((a, b) => a + b, 0);

        percent =
            Math.round(
                (highestScore / total) * 100
            );
    }

    emoji.textContent = detectedEmoji;

    emotionText.textContent =
        detectedEmotion.charAt(0).toUpperCase() +
        detectedEmotion.slice(1);

    confidence.textContent =
        "Confidence: " + percent + "%";
}
```
