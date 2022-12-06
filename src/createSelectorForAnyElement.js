// TODO: add ui
// TODO: capture node before event handlers are executed

(function () {
  const ui = document.createElement('div');
  ui.style.position = 'fixed';
  ui.style.top = '0';
  ui.style.left = '0';
  ui.style.width = '20%';
  ui.style.height = '20%';
  ui.style.zIndex = '999';
  ui.style.backgroundColor = 'white';
  ui.style.border = '1px solid black';
  ui.style.padding = '1rem';
  ui.style.overflow = 'auto';
  ui.style.fontSize = '1.5rem';
  ui.style.fontFamily = 'monospace';
  const uiTitle = document.createElement('h3');
  uiTitle.innerText = 'Selectores CSS';
  ui.appendChild(uiTitle);
  const uiSelectors = document.createElement('div');
  uiSelectors.style.display = 'flex';
  uiSelectors.style.flexDirection = 'column';
  ui.appendChild(uiSelectors);

  // get selector with tag
  function getSelectorWithTag(element) {
    let selector = '';
    selector = element.tagName.toLowerCase();
    if (element.id) {
      selector = '#' + element.id;
    } else if (element.className) {
      selector += '.' + element.className.replace(/\s+/g, '.');
    }
    return selector;
  }

  function getPathSelector(event) {
    let pathSelector = 'html';
    // get path from event
    const path = [...event.path].reverse();
    // traverse path from event target to body
    for (let i = 0; i < path.length; i++) {
      // for each element in path that is not body, get selector
      if (path[i].tagName && path[i].tagName !== 'HTML') {
        let selector = getSelectorWithTag(path[i]);
        // check if selector is unique in parent
        const parent = path[i].parentNode;
        const children = parent.querySelectorAll(selector);
        // if not unique, add nth-child to selector
        if (children.length > 1) {
          const index = Array.prototype.indexOf.call(children, path[i]);
          selector += `:nth-child(${index + 1})`;
        }
        // if unique, add selector to path
        pathSelector += '>' + selector;
      }
    }
    return pathSelector;
  }

  const lifecycleMessages = {
    start: 'Haz click en el elemento que deseas seleccionar',
    clearingClipboard:
      'Limpiando el portapapeles. Los selectores se copiarán en el portapapeles con este formato: #id | .class | tag',
    elementClicked: 'El selector del elemento es: ',
    selectorCopied: 'El selector ha sido copiado al portapapeles',
  };

  function alertMessage(stage, message = '') {
    alert(lifecycleMessages[stage] + message);
  }

  async function addToClipboard(text) {
    window.focus();
    if (text) {
      await navigator.clipboard
        .readText()
        .then((clipBoard) => {
          if (clipBoard.length > 0) {
            clipBoard = clipBoard + ' | ';
          }
          navigator.clipboard.writeText(clipBoard + text).then(
            (data) => {
              console.log(text + ' agregado al portapapeles');
            },
            (error) => {
              console.log(error);
            }
          );
        })
        .catch((error) => console.error(error));
    }
  }

  async function clearClipboard() {
    window.focus();
    await navigator.clipboard.writeText('');
  }

  function createSelectorForAnyElement() {
    clearClipboard();
    let element = null;
    document.addEventListener('click', (event) => {
      element = event.target;
      const selector = getSelectorWithTag(element);
      const uniqueSelector = getPathSelector(event);
      console.log(lifecycleMessages['elementClicked'] + selector);
      alertMessage('elementClicked', selector);
      console.log(uniqueSelector);
      addToClipboard(selector);
      alertMessage('selectorCopied');
    });
    alertMessage('start');
  }
  createSelectorForAnyElement();
})();

// bookmarklet version
const bookmarklet = `javascript:void%20function(){(function(){function%20a(a){return%20a.id%3F%22%23%22+a.id:a.classList.length%3F%22.%22+a.classList[0]:a.tagName}function%20b(a,b=%22%22){alert(e[a]+b)}async%20function%20c(a){window.focus(),a%26%26(await%20navigator.clipboard.readText().then(b=%3E{0%3Cb.length%26%26(b+=%22%20|%20%22),navigator.clipboard.writeText(b+a).then(()=%3E{console.log(a+%22%20agregado%20al%20portapapeles%22)},a=%3E{console.log(a)})}).catch(a=%3Econsole.error(a)))}async%20function%20d(){window.focus(),await%20navigator.clipboard.writeText(%22%22)}const%20e={start:%22Haz%20click%20en%20el%20elemento%20que%20deseas%20seleccionar%22,clearingClipboard:%22Limpiando%20el%20portapapeles.%20Los%20selectores%20se%20copiar\xE1n%20en%20el%20portapapeles%20con%20este%20formato:%20%23id%20|%20.class%20|%20tag%22,elementClicked:%22El%20selector%20del%20elemento%20es:%20%22,selectorCopied:%22El%20selector%20ha%20sido%20copiado%20al%20portapapeles%22};(function(){d();let%20f=null;document.addEventListener(%22click%22,d=%3E{f%26%26f.classList.remove(%22elementSelected%22),f=d.target,f.classList.add(%22elementSelected%22);const%20g=a(f);console.log(e.elementClicked+g),b(%22elementClicked%22,g),c(g),b(%22selectorCopied%22)}),b(%22start%22)})()})()}();`;
