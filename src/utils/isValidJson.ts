export const isValidJSON = (jsonString: string | null | undefined): boolean => {
  try {
    if (!jsonString) {
      return false;
    }

    JSON.parse(jsonString);
    return true;
  } catch (error) {
    return false;
  }
};
