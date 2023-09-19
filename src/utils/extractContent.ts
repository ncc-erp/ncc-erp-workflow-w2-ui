export const extractContent = (
  htmlString: string | undefined
): string | null => {
  const parser = new DOMParser();
  const doc = htmlString
    ? parser.parseFromString(htmlString, 'text/html')
    : null;

  const pElement = doc?.querySelector('p');
  if (pElement) {
    return pElement.textContent || null;
  } else {
    return null;
  }
};
