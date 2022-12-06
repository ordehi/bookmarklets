let selector = prompt('Introduce un selector CSS para el contenedor, por ejemplo: div.usuario') || 'div.usuario';
let targetButtonSelector = prompt('Introduce un selector CSS para el botón, por ejemplo: .add_btn') || '.add_btn';
let targetCompanySelector = prompt('Introduce un selector CSS para el elemento hijo que deseas leer, por ejemplo: .empresa') || '.empresa';
let includeText = prompt('Introduce el texto que debe contener el contenedor, por ejemplo: Yahoo') || 'Yahoo';
const elements = document.querySelectorAll(selector);
elements.forEach((element) => {
  const targetCompany = element.querySelector(targetCompanySelector);
  if (targetCompany && targetCompany.innerText.toLowerCase().includes(includeText.toLowerCase())) {
    const targetButton = element.querySelector(targetButtonSelector);
    targetButton.click();
  }
});
// bookmarklet version
const bookmarklet = `javascript:void%20function(){let%20a=prompt(%22Introduce%20un%20selector%20CSS%20para%20el%20contenedor,%20por%20ejemplo:%20div.usuario%22)||%22div.usuario%22,b=prompt(%22Introduce%20un%20selector%20CSS%20para%20el%20bot\xF3n,%20por%20ejemplo:%20.add_btn%22)||%22.add_btn%22,c=prompt(%22Introduce%20un%20selector%20CSS%20para%20el%20elemento%20hijo%20que%20deseas%20leer,%20por%20ejemplo:%20.empresa%22)||%22.empresa%22,d=prompt(%22Introduce%20el%20texto%20que%20debe%20contener%20el%20contenedor,%20por%20ejemplo:%20Yahoo%22)||%22Yahoo%22;const%20e=document.querySelectorAll(a);e.forEach(a=%3E{const%20e=a.querySelector(c);if(e%26%26e.innerText.toLowerCase().includes(d.toLowerCase())){const%20c=a.querySelector(b);c.click()}})}();`;