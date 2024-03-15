export const removeDiacritics = (diacriticsString: string) => {
  return diacriticsString
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace('Đ', 'D')
    .replace('đ', 'd');
};
