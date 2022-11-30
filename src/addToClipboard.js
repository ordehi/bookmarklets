(async () => {
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

//bookmarklet version
const bookmarklet =
  'javascript:void%20function(){(async()=%3E{window.focus(),await%20navigator.clipboard.readText().then(a=%3E{navigator.clipboard.writeText(`${a}%20|%20${window.getSelection()}`).then(()=%3E{console.log(window.getSelection()+%22%20added%20to%20clipboard%22)},a=%3E{console.log(a)})}).catch(a=%3Econsole.error(a))})()}();';
