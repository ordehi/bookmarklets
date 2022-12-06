// TODO: capture node before event handlers are executed
// TODO: nice animations?
// TODO: refactor the mess

(function () {
  function createUI() {
    const uiStyle = `position: fixed;top: 0;left: 0;width: 40%;height: 30%;background-color: rgba(0,0,0,0.8);z-index: 999999;border: 1px solid black;padding: 1rem;overflow-y: scroll;color: white;resize: both;`;
    const uiContainer = document.createElement('div');
    uiContainer.id = 'find-selector-bookmarklet-ui';
    uiContainer.style = uiStyle;
    const uiTitle = document.createElement('h3');
    uiTitle.innerText = 'Selectores CSS';
    uiContainer.appendChild(uiTitle);
    const uiSelectors = document.createElement('div');
    uiSelectors.style.display = 'flex';
    uiSelectors.style.flexDirection = 'column';
    uiContainer.appendChild(uiSelectors);
    const uiBottom = document.createElement('div');
    uiContainer.appendChild(uiBottom);
    document.body.appendChild(uiContainer);
    return {
      uiContainer,
      uiSelectors,
      uiBottom,
    };
  }

  const ui = createUI();

  function createLabelSpan(text) {
    const span = document.createElement('span');
    span.innerText = text;
    span.style.fontWeight = 'bold';
    span.style.display = 'block';
    return span;
  }

  function createSelectorList(selectors) {
    const list = document.createElement('ul');
    list.style.listStyle = 'none';
    list.style.padding = '0';
    Object.keys(selectors).forEach((selector) => {
      const label = createLabelSpan(selector);
      const item = document.createElement('li');
      item.style.marginBottom = '0.5rem';
      item.append(label, selectors[selector]);
      list.appendChild(item);
    });
    return list;
  }

  function createSelectedElement({ node, selectors }) {
    const container = document.createElement('div');
    container.style.border = '1px solid white';
    container.style.padding = '0.5rem';
    const element = document.createElement('div');
    element.style.maxWidth = '200px';
    element.appendChild(node.cloneNode(true));
    container.appendChild(element);
    const selectorList = createSelectorList(selectors);
    container.appendChild(selectorList);
    return container;
  }

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
    let uniquePathSelector = 'html';
    let pathSelector = 'html';
    const path = [...event.path].reverse();
    for (let i = 0; i < path.length; i++) {
      if (path[i].tagName && path[i].tagName !== 'HTML') {
        let selector = getSelectorWithTag(path[i]);
        let uniqueSelector = selector;
        const parent = path[i].parentNode;
        const children = parent.querySelectorAll(selector);
        if (children.length > 1) {
          const index = Array.prototype.indexOf.call(children, path[i]);
          uniqueSelector += `:nth-child(${index + 1})`;
        }
        pathSelector += ' > ' + selector;
        uniquePathSelector += ' > ' + uniqueSelector;
      }
    }
    return {
      pathSelector,
      uniquePathSelector,
    };
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
      if (!event.target.closest('#find-selector-bookmarklet-ui')) {
        element = event.target;
        const selector = getSelectorWithTag(element);
        const pathSelectors = getPathSelector(event);
        console.log(pathSelectors);
        addToClipboard(selector);
        let selectedElement = createSelectedElement({
          node: element,
          selectors: {
            selector,
            pathSelector: pathSelectors.pathSelector,
            uniquePathSelector: pathSelectors.uniquePathSelector,
          },
        });
        ui.uiSelectors.appendChild(selectedElement);
        setTimeout(() => {
          ui.uiBottom.scrollIntoView();
        }, 500);
      }
    });
  }
  createSelectorForAnyElement();
})();
