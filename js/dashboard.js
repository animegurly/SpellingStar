document.addEventListener('DOMContentLoaded', () => {
  const summary = document.getElementById('stats-summary');

  if (summary) {
    summary.textContent = 'You have completed 0 quizzes this week.';
  }
});
