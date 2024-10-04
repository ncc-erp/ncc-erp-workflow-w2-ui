export const convertToCase = (inputString: string) => {
  return inputString
    .split(/(?=[A-Z])/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const toDisplayName = (inputName: string) => {
  return inputName.replace(/([a-z])([A-Z])/g, '$1 $2');
};
