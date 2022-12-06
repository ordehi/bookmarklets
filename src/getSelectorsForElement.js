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

// get unique selector using path
function getSelectorFromPath(path) {
  let selector = '';
  path.forEach((element) => {
    selector += getSelectorWithTag(element);
  });
  return selector;
}

function getPathSelector(event) {
  let pathSelector = '';
  // get path from event
  const path = [...event.path].reverse();
  // traverse path from event target to body
  for (let i = 0; i < path.length; i++) {
    // for each element in path that is not body, get selector
    if (path[i].tagName && path[i].tagName !== 'BODY') {
      const selector = getSelectorWithTag(path[i]);
      // check if selector is unique in parent
      const parent = path[i].parentNode;
      const children = parent.querySelectorAll(selector);
      // if not unique, add nth-child to selector
      if (children.length > 1) {
        const index = Array.prototype.indexOf.call(children, path[i]);
        selector += `:nth-child(${index + 1})`;
      }
      // if unique, add selector to path
      pathSelector += selector;
    }
  }
}
