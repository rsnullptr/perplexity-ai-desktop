const clipboardy = require('clipboardy');

function pasteFromClipboard() {
  const inputField = document.getElementById('query-input');
  clipboardy.read().then(text => {
    inputField.value = text;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const pasteButton = document.getElementById('paste-button');
  pasteButton.addEventListener('click', pasteFromClipboard);

  const queryInput = document.getElementById('query-input');
  const webview = document.querySelector('webview');

  queryInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const query = queryInput.value;
      webview.loadURL(`https://www.perplexity.ai/search?q=${encodeURIComponent(query)}`);
    }
  });
});

