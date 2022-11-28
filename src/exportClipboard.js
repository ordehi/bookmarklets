javascript: (async () => {
  window.focus();
  await navigator.clipboard
    .readText()
    .then((clipBoard) => {
      const link = document.createElement('a');
      const file = new Blob([clipBoard], { type: 'text/plain' });
      link.href = URL.createObjectURL(file);
      link.download = `clipboard${new Date().getTime()}.txt`;
      link.click();
      URL.revokeObjectURL(link.href);
    })
    .catch((error) => console.error(error));
})();
