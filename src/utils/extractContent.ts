// const pTagRegex = /<p\b[^>]*>[\s\S]*?<\/p>/i;

export const extractContent = (strInput: string | undefined): string | null => {
  if (!strInput) {
    return '';
  }

  // const pElement = new DOMParser()
  //   .parseFromString(strInput, 'text/html')
  //   .querySelector('p');
  const div = document.createElement("div");
  div.innerHTML = strInput;
  // var text = div.textContent || div.innerText || "";
  return div.textContent || div.innerText || "";
};
