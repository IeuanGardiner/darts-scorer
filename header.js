function renderHeader() {
  const header = document.createElement('header');
  header.textContent = 'Darts Scorer';
  header.className = 'p-4 text-2xl font-bold';
  document.body.prepend(header);
}

if (typeof module !== 'undefined') {
  module.exports = { renderHeader };
}
