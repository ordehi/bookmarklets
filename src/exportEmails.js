/* 
Test here:
https://fauxid.com/tools/fake-email-list?number=100
*/

(() => {
  const emailRE =
    /(?<user>(?:(?:[^ \t\(\)\<\>@,;\:\\\"\.\[\]\r\n]+)|(?:\"(?:(?:[^\"\\\r\n])|(?:\\.))*\"))(?:\.(?:(?:[^ \t\(\)\<\>@,;\:\\\"\.\[\]\r\n]+)|(?:\"(?:(?:[^\"\\\r\n])|(?:\\.))*\")))*)@(?<domain>(?:(?:[^ \t\(\)\<\>@,;\:\\\"\.\[\]\r\n]+)|(?:\[(?:(?:[^\[\]\\\r\n])|(?:\\.))*\]))(?:\.(?:(?:[^ \t\(\)\<\>@,;\:\\\"\.\[\]\r\n]+)|(?:\[(?:(?:[^\[\]\\\r\n])|(?:\\.))*\])))*)/g;
  const emails = document.body.innerHTML.match(emailRE);
  if (emails) {
    const link = document.createElement('a');
    const file = new Blob([emails.join('\n')], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = 'emails' + new Date().getTime() + '.txt';
    link.click();
    URL.revokeObjectURL(link.href);
  }
})();

// bookmarklet version
const bookmarklet = `javascript:void%20function(){(()=%3E{const%20a=/(%3F%3Cuser%3E(%3F:(%3F:[^%20\t\(\)\%3C\%3E%40,;\:\\\%22\.\[\]\r\n]+)|(%3F:\%22(%3F:(%3F:[^\%22\\\r\n])|(%3F:\\.))*\%22))(%3F:\.(%3F:(%3F:[^%20\t\(\)\%3C\%3E%40,;\:\\\%22\.\[\]\r\n]+)|(%3F:\%22(%3F:(%3F:[^\%22\\\r\n])|(%3F:\\.))*\%22)))*)%40(%3F%3Cdomain%3E(%3F:(%3F:[^%20\t\(\)\%3C\%3E%40,;\:\\\%22\.\[\]\r\n]+)|(%3F:\[(%3F:(%3F:[^\[\]\\\r\n])|(%3F:\\.))*\]))(%3F:\.(%3F:(%3F:[^%20\t\(\)\%3C\%3E%40,;\:\\\%22\.\[\]\r\n]+)|(%3F:\[(%3F:(%3F:[^\[\]\\\r\n])|(%3F:\\.))*\])))*)/g,b=document.body.innerHTML.match(a);if(b){const%20a=document.createElement(%22a%22),c=new%20Blob([b.join(%22\n%22)],{type:%22text/plain%22});a.href=URL.createObjectURL(c),a.download=%22emails%22+new%20Date().getTime()+%22.txt%22,a.click(),URL.revokeObjectURL(a.href)}})()}();`;
