// TODO: nice animations?
// TODO: refactor the mess

// This bookmarklet creates a UI that displays elements you clicked along with their CSS selectors
// It is useful when you want to get selectors for elements to use in other bookmarklets
(function () {
  const styles = {
    uiStyle: `position: fixed;top: 0;left: 0;width: 30%;height: 600px;background-color: rgba(0,0,0,0.8);z-index: 999999;border: 1px solid black;padding: 1rem;overflow-y: scroll;color: white;resize: both;`,
    uiSelectors: `display:flex;flex-direction:column;`,
    labelSpan: `font-size:1.2rem;font-weight:bold;display:block;`,
    listStyles: `list-style:none;padding:0;width:100%;`,
    item: `margin-block:1rem;`,
    containerStyle: `margin-top:1rem;border:1px solid white;padding:0.5rem;max-height:100%;`,
    elementStyle: `overflow: hidden;display: flex;justify-content: center;max-height: 300px;`,
    copyButton: `cursor:pointer;border:none;border-radius:4px;background-color:white;color:black;margin-left:0.5rem;`,
    selectorSpan: `display:inline-block;margin-top:0.5rem;`,
  };

  document.body.replaceWith(document.body.cloneNode(true));
  function createUI() {
    const uiContainer = document.createElement('div');
    const uiTitle = document.createElement('h3');
    const uiSelectors = document.createElement('div');
    const uiBottom = document.createElement('div');

    uiContainer.id = 'find-selector-bookmarklet-ui';
    uiContainer.style = styles.uiStyle;
    uiSelectors.style = styles.uiSelectors;
    uiTitle.textContent = 'Selectores CSS';
    uiContainer.append(uiTitle, uiSelectors, uiBottom);
    document.body.appendChild(uiContainer);

    return {
      uiContainer,
      uiSelectors,
      uiBottom,
    };
  }

  const ui = createUI();

  async function copyToClipboard(text) {
    if (text) {
      window.focus();
      await navigator.clipboard.writeText(text);
    }
  }

  function copySelector(event) {
    console.log(this);
    const selector = event.target.parentElement.nextElementSibling.textContent;
    copyToClipboard(selector);
  }

  function createLabelSpan(text) {
    const span = document.createElement('span');
    const button = document.createElement('button');
    button.style = styles.copyButton;
    button.textContent = 'copiar';
    button.onclick = copySelector;
    span.append(text, button);
    span.style = styles.labelSpan;
    return span;
  }

  function createSelectorList(selectors) {
    const list = document.createElement('ul');
    list.style = styles.listStyles;
    Object.keys(selectors).forEach((selector) => {
      const label = createLabelSpan(selector);
      const item = document.createElement('li');
      const selectorSpan = document.createElement('span');
      selectorSpan.textContent = selectors[selector];
      item.style = styles.item;
      selectorSpan.style = styles.selectorSpan;
      item.append(label, selectorSpan);
      list.appendChild(item);
    });
    return list;
  }

  function createSelectedElement({ node, selectors }) {
    const container = document.createElement('div');
    const element = document.createElement('div');
    const hr = document.createElement('hr');
    container.style = styles.containerStyle;
    element.style = styles.elementStyle;
    element.appendChild(node.cloneNode(true));
    const selectorList = createSelectorList(selectors);
    container.append(element, hr, selectorList);
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
      selectorAncestro: pathSelector,
      selectorUnico: uniquePathSelector,
    };
  }

  function createSelectorForAnyElement() {
    let element = null;
    document.body.addEventListener('click', (event) => {
      if (!event.target.closest('#find-selector-bookmarklet-ui')) {
        element = event.target;
        const selector = getSelectorWithTag(element);
        const pathSelectors = getPathSelector(event);
        const { selectorAncestro, selectorUnico } = pathSelectors;
        let selectedElement = createSelectedElement({
          node: element,
          selectors: {
            selector,
            selectorAncestro,
            selectorUnico,
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
