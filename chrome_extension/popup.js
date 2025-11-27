document.addEventListener('DOMContentLoaded', () => {
  const ids = ['init', 'estimate', 'search', 'navigate', 'missing'];
  ids.forEach(id => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('click', () => {
      console.log(`popup button "${id}" clicked`, { id, time: new Date().toISOString() });
    });
  });
});