/* 
Test here:
https://fauxid.com/tools/fake-email-list?number=100
*/

(async () => {
  const emailRE =
    /(?<user>(?:(?:[^ \t\(\)\<\>@,;\:\\\"\.\[\]\r\n]+)|(?:\"(?:(?:[^\"\\\r\n])|(?:\\.))*\"))(?:\.(?:(?:[^ \t\(\)\<\>@,;\:\\\"\.\[\]\r\n]+)|(?:\"(?:(?:[^\"\\\r\n])|(?:\\.))*\")))*)@(?<domain>(?:(?:[^ \t\(\)\<\>@,;\:\\\"\.\[\]\r\n]+)|(?:\[(?:(?:[^\[\]\\\r\n])|(?:\\.))*\]))(?:\.(?:(?:[^ \t\(\)\<\>@,;\:\\\"\.\[\]\r\n]+)|(?:\[(?:(?:[^\[\]\\\r\n])|(?:\\.))*\])))*)/g;
  window.focus();
  const emails = document.body.innerHTML.match(emailRE);
  if (emails) {
    await navigator.clipboard.writeText(emails.join('\n'));
  }
})();

// bookmarklet version
const bookmarklet = `javascript:void%20function(){(async()=%3E{const%20a=/(%3F%3Cuser%3E(%3F:(%3F:[^%20\t\(\)\%3C\%3E%40,;\:\\\%22\.\[\]\r\n]+)|(%3F:\%22(%3F:(%3F:[^\%22\\\r\n])|(%3F:\\.))*\%22))(%3F:\.(%3F:(%3F:[^%20\t\(\)\%3C\%3E%40,;\:\\\%22\.\[\]\r\n]+)|(%3F:\%22(%3F:(%3F:[^\%22\\\r\n])|(%3F:\\.))*\%22)))*)%40(%3F%3Cdomain%3E(%3F:(%3F:[^%20\t\(\)\%3C\%3E%40,;\:\\\%22\.\[\]\r\n]+)|(%3F:\[(%3F:(%3F:[^\[\]\\\r\n])|(%3F:\\.))*\]))(%3F:\.(%3F:(%3F:[^%20\t\(\)\%3C\%3E%40,;\:\\\%22\.\[\]\r\n]+)|(%3F:\[(%3F:(%3F:[^\[\]\\\r\n])|(%3F:\\.))*\])))*)/g;window.focus();const%20b=document.body.innerHTML.match(a);b%26%26(await%20navigator.clipboard.writeText(b.join(%22\n%22)))})()}();`;
