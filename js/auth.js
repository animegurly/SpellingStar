document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('auth-form');

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      alert('Authentication flow placeholder. Connect Firebase to enable real login/signup.');
    });
  }
});
