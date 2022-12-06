let classSelector = prompt('Introduce una clase CSS, por ejemplo: .btn');
classSelector = '.' + classSelector.replace('.', '');
const buttons = document.querySelectorAll(classSelector);
buttons.forEach((button) => {
  button.click();
});

// bookmarklet version
const bookmarklet = `javascript:void%20function(){let%20a=prompt(%22Introduce%20una%20clase%20CSS,%20por%20ejemplo:%20.btn%22);a=%22.%22+a.replace(%22.%22,%22%22);const%20b=document.querySelectorAll(a);b.forEach(a=%3E{a.click()})}();`;