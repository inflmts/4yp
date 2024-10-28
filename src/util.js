export function html(tag, attrs, children) {
  const element = document.createElement(tag);
  if (attrs)
    for (const [key, value] of Object.entries(attrs))
      element.setAttribute(key, value);
  if (children) {
    if (typeof children === 'string')
      element.textContent = children;
    else
      element.append(...children);
  }
  return element;
}

export function renderId(id) {
  return html('span', null, [
    html('span', { class: 'font-mono px-[0.125em]' }, id.slice(0, 3)),
    html('span', { class: 'font-mono px-[0.125em]' }, id.slice(3))
  ]);
}

export function renderTitle(title) {
  title = title.replace(/ (?=\d)/g, '\xa0');
  const element = html('span');
  const re = /[A-Z]{3}\d{4}[LC]?/g;
  let index, match;
  while (index = re.lastIndex, match = re.exec(title)) {
    element.append(
      title.slice(index, match.index),
      renderId(match[0])
    );
  }
  element.append(title.slice(index));
  return element;
}
