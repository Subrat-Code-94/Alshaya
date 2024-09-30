/**
 * loads and decorates the scrollable-banner
 * @param {Element} block The scrollable-banner block element
 */
export default async function decorate(block) {
  const picture = block.querySelector('img');
  const picContainer = picture.parentElement.parentElement;
  const imgSource = picture.getAttribute('src');
  block.style.backgroundImage = `url(${imgSource})`;
  picContainer.remove();
}
