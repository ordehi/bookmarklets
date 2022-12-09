// TODO: nice animations?
// TODO: refactor the mess

// This bookmarklet creates a UI that displays elements you clicked along with their CSS selectors
// It is useful when you want to get selectors for elements to use in other bookmarklets
(function () {
  function getDefinedStyles(node) {
    return Object.entries(getComputedStyle(node))
      .slice(342)
      .reduce((acc, curr) => {
        if (!!curr[1]) {
          acc[curr[0]] = curr[1];
        }
        return acc;
      }, {});
  }

  function getDefaultStyles(node) {
    return getDefinedStyles(node);
  }

  const shadow = document.createElement('div');
  const defaultStyles = getDefaultStyles(shadow);
  shadow.id = 'find-selector-bookmarklet-ui';
  shadow.attachShadow({ mode: 'open' });
  const shadowStyles = document.createElement('style');
  shadowStyles.textContent = `
    :host {
      position: fixed;
      top: 0;
      left: 0;
      width: 30%;
      max-width: 300px;
      height: 95vh;
      background-color: rgba(0,0,0,0.8);
      border: 1px solid black;
      padding: 1rem;
      overflow-y: auto;
      resize: both;
    }

    .label-span {
    display: flex;
    justify-content: space-between;
    background-color: rgba(0,0,0,0.4);
    font-size: 1.2rem;
    font-weight: bold;
    padding: 0.5rem;
    }

    .list-styles {
      list-style:none;
      padding:0;
      width:100%;
      overflow-wrap: anywhere;
    }

    .ui-title {
    text-align:center;
    }

    .container-style {
      max-height:100%;
    }

    .element-style {
      overflow: hidden;
      display: flex;
      justify-content: center;
      max-height: 300px;
    }

    .copy-button {
    cursor: pointer;
    border: none;
    border-radius: 4px;
    background-color: rgba(255,255,255,0.6);
    color: black;
    font-weight: bold;
    margin-left: 0.5rem;
    }

    .copy-button:hover {
      background-color:rgba(255,255,255,0.8);
    }

    .selector-span {
      display:inline-block;
      background-color:rgba(255,255,255,0.2);
      padding: 0.5rem;
      display: flex;
    }
  `;
  shadow.shadowRoot.append(shadowStyles);

  [...document.querySelectorAll('a')].map((a) => a.removeAttribute('href'));
  document.body.replaceWith(document.body.cloneNode(true));
  function createUI() {
    const uiContainer = document.createElement('div');
    const uiTitle = document.createElement('h3');
    const uiSelectors = document.createElement('div');
    const uiBottom = document.createElement('div');
    uiContainer.classList.add('ui-style');
    uiSelectors.classList.add('ui-selectors');
    uiTitle.textContent = 'Selectores CSS para elemento';
    uiTitle.classList.add('ui-title');
    uiContainer.append(uiTitle, uiSelectors, uiBottom);

    return {
      uiContainer,
      uiSelectors,
      uiBottom,
    };
  }

  const ui = createUI();
  shadow.shadowRoot.append(ui.uiContainer);
  document.body.append(shadow);

  async function copyToClipboard(text) {
    if (text) {
      window.focus();
      await navigator.clipboard.writeText(text);
    }
  }

  function copySelector(event) {
    const selector = event.target.parentNode.nextSibling.textContent;
    copyToClipboard(selector);
  }

  function createLabelSpan(text) {
    const span = document.createElement('span');
    const button = document.createElement('button');
    button.classList.add('copy-button');
    button.textContent = 'copiar';
    button.onclick = copySelector;
    span.append(text, button);
    span.classList.add('label-span');
    return span;
  }

  function createSelectorList(selectors) {
    const list = document.createElement('ul');
    list.classList.add('list-styles');
    Object.keys(selectors).forEach((selector) => {
      const label = createLabelSpan(selector);
      const item = document.createElement('li');
      const selectorSpan = document.createElement('span');
      selectorSpan.textContent = selectors[selector];
      item.classList.add('item');
      selectorSpan.classList.add('selector-span');
      item.append(label, selectorSpan);
      list.append(item);
    });
    return list;
  }

  function applyStyle(node) {
    const defined = getDefinedStyles(node);
    Object.keys(defined).forEach((key) => {
      if (key == 'color') console.log(defined[key], defaultStyles[key]);
      if (defaultStyles[key] != defined[key]) {
        node.style[key] = defined[key];
      }
    });
  }

  function styleBranch(node) {
    [...node.children].map((child) => styleBranch(child));
    return applyStyle(node);
  }

  function createSelectedElement({ node, selectors }) {
    const container = document.createElement('div');
    const element = document.createElement('div');
    // const hr = document.createElement('hr');
    container.classList.add('container-style');
    element.classList.add('element-style');
    styleBranch(node);
    const clone = node.cloneNode(true);
    element.append(clone);
    const selectorList = createSelectorList(selectors);
    container.append(element, selectorList);
    return container;
  }

  function getSelectorWithTag(element) {
    let selector = '';
    selector = element.tagName.toLowerCase();
    if (element.id) {
      selector = '#' + element.id;
    } else if (!!element.classList.length) {
      selector += '.' + [...element.classList].join('.');
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
          uniqueSelector += ':nth-child(' + (index + 1) + ')';
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

  function createSelectorForAnyElement() {
    let element = null;
    document.body.addEventListener('click', (event) => {
      if (
        !event.target.closest('#find-selector-bookmarklet-ui') &&
        element !== event.target
      ) {
        element = event.target;
        const selector = getSelectorWithTag(element);
        const pathSelectors = getPathSelector(event);
        const { pathSelector, uniquePathSelector } = pathSelectors;
        let selectedElement = createSelectedElement({
          node: element,
          selectors: {
            selector,
            selectorAncestro: pathSelector,
            selectorUnico: uniquePathSelector,
          },
        });

        copyToClipboard(uniquePathSelector);
        if (ui.uiSelectors.children.length > 0) {
          ui.uiSelectors.children[0].remove();
        }
        ui.uiSelectors.append(selectedElement);
        setTimeout(() => {
          selectedElement.scrollIntoView();
        }, 500);
      }
    });
  }
  createSelectorForAnyElement();
})();

// bookmarklet version
const bookmarklet =
  'javascript:(function(){function a(a){return Object.entries(getComputedStyle(a)).slice(342).reduce((a,b)=>(!b[1]||(a[b[0]]=b[1]),a),{})}async function b(a){a%26%26(window.focus(),await navigator.clipboard.writeText(a))}function c(a){const c=a.target.parentNode.nextSibling.textContent;b(c)}function d(a){const b=document.createElement("span"),d=document.createElement("button");return d.classList.add("copy-button"),d.textContent="copiar",d.onclick=c,b.append(a,d),b.classList.add("label-span"),b}function e(a){const b=document.createElement("ul");return b.classList.add("list-styles"),Object.keys(a).forEach(c=>{const e=d(c),f=document.createElement("li"),g=document.createElement("span");g.textContent=a[c],f.classList.add("item"),g.classList.add("selector-span"),f.append(e,g),b.append(f)}),b}function f(b){const c=a(b);Object.keys(c).forEach(a=>{"color"==a%26%26console.log(c[a],m[a]),m[a]!=c[a]%26%26(b.style[a]=c[a])})}function g(a){return[...a.children].map(a=>g(a)),f(a)}function h({node:a,selectors:b}){const c=document.createElement("div"),d=document.createElement("div");c.classList.add("container-style"),d.classList.add("element-style"),g(a);const f=a.cloneNode(!0);d.append(f);const h=e(b);return c.append(d,h),c}function j(a){let b="";return b=a.tagName.toLowerCase(),a.id%3Fb="%23"+a.id:!!a.classList.length%26%26(b+="."+[...a.classList].join(".")),b}function k(a){let b="html",c="html";const d=[...a.path].reverse();for(let e=0;e<d.length;e++)if(d[e].tagName%26%26"HTML"!==d[e].tagName){let a=j(d[e]),f=a;const g=d[e].parentNode,h=g.querySelectorAll(a);if(1<h.length){const a=Array.prototype.indexOf.call(h,d[e]);f+=":nth-child("+(a+1)+")"}c+=" > "+a,b+=" > "+f}return{pathSelector:c,uniquePathSelector:b}}const l=document.createElement("div"),m=function(b){return a(b)}(l);l.id="find-selector-bookmarklet-ui",l.attachShadow({mode:"open"});const n=document.createElement("style");n.textContent=`    :host {      position: fixed;      top: 0;      left: 0;      width: 30%25;      max-width: 300px;      height: 95vh;      background-color: rgba(0,0,0,0.8);      border: 1px solid black;      padding: 1rem;      overflow-y: auto;      resize: both;    }    .label-span {    display: flex;    justify-content: space-between;    background-color: rgba(0,0,0,0.4);    font-size: 1.2rem;    font-weight: bold;    padding: 0.5rem;    }    .list-styles {      list-style:none;      padding:0;      width:100%25;      overflow-wrap: anywhere;    }    .ui-title {    text-align:center;    }    .container-style {      max-height:100%25;    }    .element-style {      overflow: hidden;      display: flex;      justify-content: center;      max-height: 300px;    }    .copy-button {    cursor: pointer;    border: none;    border-radius: 4px;    background-color: rgba(255,255,255,0.6);    color: black;    font-weight: bold;    margin-left: 0.5rem;    }    .copy-button:hover {      background-color:rgba(255,255,255,0.8);    }    .selector-span {      display:inline-block;      background-color:rgba(255,255,255,0.2);      padding: 0.5rem;      display: flex;    }  `,l.shadowRoot.append(n),[...document.querySelectorAll("a")].map(b=>b.removeAttribute("href")),document.body.replaceWith(document.body.cloneNode(!0));const o=function(){const a=document.createElement("div"),b=document.createElement("h3"),c=document.createElement("div"),d=document.createElement("div");return a.classList.add("ui-style"),c.classList.add("ui-selectors"),b.textContent="Selectores CSS para elemento",b.classList.add("ui-title"),a.append(b,c,d),{uiContainer:a,uiSelectors:c,uiBottom:d}}();l.shadowRoot.append(o.uiContainer),document.body.append(l),function(){let a=null;document.body.addEventListener("click",c=>{if(!c.target.closest("%23find-selector-bookmarklet-ui")%26%26a!==c.target){a=c.target;const d=j(a),e=k(c),{pathSelector:f,uniquePathSelector:g}=e;let i=h({node:a,selectors:{selector:d,selectorAncestro:f,selectorUnico:g}});b(g),0<o.uiSelectors.children.length%26%26o.uiSelectors.children[0].remove(),o.uiSelectors.append(i),setTimeout(()=>{i.scrollIntoView()},500)}})}()})();';
