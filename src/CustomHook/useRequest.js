import { BASE_URL } from '../BASE_URL/baseUrl';

const useRequest = ({ url, method, body }) => {
  const doRequest = async () => {
    try {
      let data = { ...body };

      for (let key in data) {
        if (typeof data[key] === 'string') {
          if (!data[key] || !data[key].trim()) {
            delete data[key];
          }
        }
      }

      const response = await fetch(BASE_URL + url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      const responseData = await response.json();

      return responseData;
    } catch (err) {
      throw err;
    }
  };

  return doRequest;
};

export default useRequest;
