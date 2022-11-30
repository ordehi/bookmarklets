(async () => {
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

// bookmarklet version
const bookmarklet =
  'javascript:void%20function(){(async()=%3E{window.focus(),await%20navigator.clipboard.readText().then(a=%3E{const%20b=document.createElement(%22a%22),c=new%20Blob([a],{type:%22text/plain%22});b.href=URL.createObjectURL(c),b.download=`clipboard${new%20Date().getTime()}.txt`,b.click(),URL.revokeObjectURL(b.href)}).catch(a=%3Econsole.error(a))})()}();';
