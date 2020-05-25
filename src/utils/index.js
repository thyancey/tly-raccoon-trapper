export const renderHtml = (selector, htmlString) => {
  const element = document.querySelector(selector);
  if(element){
    element.innerHTML = htmlString;
  }
}