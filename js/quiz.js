document.addEventListener('DOMContentLoaded', () => {
  const questionText = document.getElementById('question-text');
  const answerInput = document.getElementById('answer-input');
  const submitButton = document.getElementById('submit-answer');
  const speakButton = document.getElementById('speak-word');
  const feedback = document.getElementById('feedback');
  const modeButtons = document.querySelectorAll('.mode-button');
  const correctCount = document.getElementById('correct-count');
  const wrongCount = document.getElementById('wrong-count');
  const correctFaces = document.getElementById('correct-faces');
  const wrongFaces = document.getElementById('wrong-faces');
  const hangmanDisplay = document.getElementById('hangman');

  const fallbackWords = [];

  let words = [];
  let currentWord = null;
  let selectedMode = 'easy';
  let correct = 0;
  let wrong = 0;
  const maxMistakes = 6;
  const hangmanParts = ['🪵', '🪵', '🪵', '🪵', '🪵', '💀'];

  function updateScoreDisplay() {
    if (correctCount) {
      correctCount.textContent = correct;
    }
    if (wrongCount) {
      wrongCount.textContent = wrong;
    }
    if (correctFaces) {
      correctFaces.textContent = '😊'.repeat(correct);
    }
    if (wrongFaces) {
      wrongFaces.textContent = '☹️'.repeat(wrong);
    }
    if (hangmanDisplay) {
      hangmanDisplay.textContent = hangmanParts[Math.min(wrong, hangmanParts.length - 1)];
    }
  }

  function speakWord(text) {
    if (!('speechSynthesis' in window)) {
      if (feedback) {
        feedback.textContent = 'Speech is not supported in this browser.';
      }
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  }

  function getFilteredWords() {
    if (selectedMode === 'surprise') {
      return words;
    }

    return words.filter((entry) => entry.difficulty === selectedMode);
  }

  function showQuestion() {
    const filteredWords = getFilteredWords();

    if (!filteredWords.length) {
      if (questionText) {
        questionText.textContent = `No ${selectedMode} words available yet.`;
      }
      return;
    }

    currentWord = filteredWords[Math.floor(Math.random() * filteredWords.length)];
    if (questionText) {
      questionText.textContent = 'Listen to the word and type it below.';
    }
    if (answerInput) {
      answerInput.value = '';
    }
    if (feedback) {
      feedback.textContent = '';
    }
    speakWord(currentWord.word);
  }

  function loadWords() {
    fetch('data/words.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        words = Array.isArray(data) && data.length ? data : fallbackWords;
        if (!words.length) {
          if (questionText) {
            questionText.textContent = 'No words available in words.json.';
          }
          return;
        }
        showQuestion();
      })
      .catch(() => {
        words = fallbackWords;
        if (questionText) {
          questionText.textContent = 'Unable to load words.json.';
        }
      });
  }

  loadWords();

  function resetQuiz() {
    correct = 0;
    wrong = 0;
    updateScoreDisplay();
    setTimeout(showQuestion, 100);
  }

  function submitAnswer() {
    const answer = answerInput.value.trim().toLowerCase();
    if (!currentWord) {
      showQuestion();
      return;
    }

    if (answer === currentWord.word.toLowerCase()) {
      correct += 1;
    } else {
      wrong += 1;
    }

    if (feedback) {
      feedback.textContent = answer === currentWord.word.toLowerCase()
        ? 'Correct!'
        : `Not quite. The correct spelling is ${currentWord.word}.`;
    }

    updateScoreDisplay();

    if (wrong >= maxMistakes) {
      const alertBox = document.createElement('div');
      alertBox.textContent = 'You made too many mistakes, try the quiz again';
      alertBox.className = 'flash-alert';
      document.body.appendChild(alertBox);
      setTimeout(() => alertBox.remove(), 1800);
      setTimeout(resetQuiz, 1200);
      return;
    }

    setTimeout(showQuestion, 1200);
  }

  modeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      selectedMode = button.dataset.mode;
      modeButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      showQuestion();
    });
  });

  if (submitButton) {
    submitButton.addEventListener('click', submitAnswer);
  }

  if (answerInput) {
    answerInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        submitAnswer();
      }
    });
  }

  if (speakButton) {
    speakButton.addEventListener('click', () => {
      if (currentWord) {
        speakWord(currentWord.word);
      }
    });
  }
});
