document.addEventListener('DOMContentLoaded', () => {
  // Word Hunt page logic: loads real words from the JSON data file and runs the game.
  const gridEl = document.getElementById('wordhunt-grid');
  const answerInput = document.getElementById('hunt-answer');
  const submitButton = document.getElementById('hunt-submit');
  const feedback = document.getElementById('hunt-feedback');
  const instructions = document.getElementById('hunt-instructions');

  let wordBank = [];
  let queue = [];
  let selectedEntry = null;

  function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function createGrid(word) {
    const size = 6;
    const letters = word.split('');
    const grid = Array.from({ length: size }, () => Array(size).fill(''));
    const startRow = Math.floor(Math.random() * (size - 1));
    const startCol = Math.floor(Math.random() * (size - word.length + 1));

    letters.forEach((letter, index) => {
      grid[startRow][startCol + index] = letter;
    });

    const filler = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const allLetters = shuffle([...letters, ...filler]).slice(0, size * size - letters.length);
    let index = 0;

    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col < size; col += 1) {
        if (!grid[row][col]) {
          grid[row][col] = allLetters[index];
          index += 1;
        }
      }
    }

    return grid;
  }

  function renderGrid(word) {
    const grid = createGrid(word);
    if (!gridEl) return;

    gridEl.innerHTML = '';
    grid.forEach((row) => {
      const rowEl = document.createElement('div');
      rowEl.className = 'wordhunt-row';
      row.forEach((letter) => {
        const cellEl = document.createElement('div');
        cellEl.className = 'wordhunt-cell';
        cellEl.textContent = letter.toUpperCase();
        rowEl.appendChild(cellEl);
      });
      gridEl.appendChild(rowEl);
    });
  }

  function startNewWord() {
    if (!queue.length) {
      queue = shuffle(wordBank);
    }

    selectedEntry = queue.shift();
    const word = selectedEntry?.word || '';

    if (!word) {
      if (instructions) {
        instructions.textContent = 'No words available yet.';
      }
      return;
    }

    const clue = selectedEntry.clue || `Spell this ${selectedEntry.difficulty || 'word'} word!`;
    if (instructions) {
      instructions.textContent = clue;
    }
    renderGrid(word);
    if (answerInput) answerInput.value = '';
    if (feedback) feedback.textContent = '';
  }

  fetch('data/words.json')
    .then((response) => response.json())
    .then((data) => {
      wordBank = Array.isArray(data) ? data : [];
      queue = shuffle(wordBank);
      startNewWord();
    })
    .catch(() => {
      if (instructions) {
        instructions.textContent = 'Unable to load words right now.';
      }
    });

  if (submitButton) {
    submitButton.addEventListener('click', () => {
      const guessed = answerInput.value.trim().toLowerCase();
      if (!selectedEntry) {
        startNewWord();
        return;
      }

      if (feedback) {
        feedback.textContent = guessed === selectedEntry.word.toLowerCase()
          ? 'Great job! You found it!'
          : 'Try again!';
      }

      setTimeout(startNewWord, 1200);
    });
  }
});
