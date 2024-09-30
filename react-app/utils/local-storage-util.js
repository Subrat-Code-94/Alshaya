/**
 * Get local storage data by key
 *
 * @param storageKey
 * @returns {{data: null|string}}
 */
const getLocalStorageByKey = (storageKey) => {
  let data = null;
  const storedData = window.localStorage.getItem(storageKey);
  if (storedData) {
    try {
      const parsed = JSON.parse(storedData);
      data = parsed.value.replaceAll('"', '');
    } catch (error) {
      console.error('Error parsing JSON from local storage', error);
    }
  }

  return data;
};

export default getLocalStorageByKey;
