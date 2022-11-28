javascript: (async () => {
  window.focus();
  await navigator.clipboard
    .readText()
    .then((clipBoard) => {
      navigator.clipboard
        .writeText(`${clipBoard} | ${window.getSelection()}`)
        .then(
          (data) => {
            console.log(window.getSelection() + ' added to clipboard');
          },
          (error) => {
            console.log(error);
          }
        );
    })
    .catch((error) => console.error(error));
})();
