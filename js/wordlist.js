document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('word-list');
  const searchInput = document.getElementById('search-input');

  if (!list) return;

  const fallbackWords = [
    { word: 'about', difficulty: 'easy', category: 'grade-3-4' },
    { word: 'above', difficulty: 'easy', category: 'grade-3-4' },
    { word: 'banana', difficulty: 'easy', category: 'grade-3-4' },
    { word: 'beautiful', difficulty: 'easy', category: 'grade-3-4' }
  ];

  function speakWord(text) {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  }

  function loadWords() {
    if (window.location.protocol === 'file:') {
      renderWords(fallbackWords);
      return;
    }

    fetch('data/words.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((words) => {
        renderWords(words);
      })
      .catch(() => {
        renderWords(fallbackWords);
      });
  }

  function renderWords(words) {
    list.innerHTML = '';

    const filtered = words.filter((entry) => {
      const values = `${entry.word} ${entry.difficulty} ${entry.category}`.toLowerCase();
      return values.includes(searchInput?.value?.toLowerCase() || '');
    });

    filtered.forEach((entry) => {
      const item = document.createElement('li');
      item.className = 'word-item';

      const textWrap = document.createElement('div');
      textWrap.innerHTML = `<strong>${entry.word}</strong><div class="word-meta">${entry.difficulty} • ${entry.category}</div>`;

      const button = document.createElement('button');
      button.className = 'speak-word-btn';
      button.textContent = '🔊';
      button.addEventListener('click', () => speakWord(entry.word));

      item.appendChild(textWrap);
      item.appendChild(button);
      list.appendChild(item);
    });
  }

  loadWords();

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      loadWords();
    });
  }
});
