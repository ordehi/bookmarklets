let selector = 'div.usuario';
let buttonSelector = '.add_btn';
let targetCompanySelector = '.empresa';
let includeText =
  prompt(
    'Introduce el texto que debe contener el contenedor, por ejemplo: Yahoo'
  ) || 'Yahoo';
const elements = document.querySelectorAll(selector);
elements.forEach((element) => {
  const targetCompany = element.querySelector(targetCompanySelector);
  if (
    targetCompany &&
    targetCompany.textContent.toLowerCase().includes(includeText.toLowerCase())
  ) {
    const targetButton = element.querySelector(buttonSelector);
    targetButton.click();
  }
});
// bookmarklet version
const bookmarklet = `javascript:void%20function(){let%20a=prompt(%22Introduce%20el%20texto%20que%20debe%20contener%20el%20contenedor,%20por%20ejemplo:%20Yahoo%22)||%22Yahoo%22;const%20b=document.querySelectorAll(%22div.usuario.add_btn%22);b.forEach(b=%3E{const%20c=b.querySelector(%22.empresa%22);if(c%26%26c.textContent.toLowerCase().includes(a.toLowerCase())){const%20a=b.querySelector(targetButtonSelector);a.click()}})}();`;
