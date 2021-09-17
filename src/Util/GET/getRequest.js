const { BASE_URL } = require('../../BASE_URL/baseUrl');

const getRequest = (url) => {
  return async () => {
    const data = await fetch(BASE_URL + url, {
      method: 'GET',
      credentials: 'include',
    });

    const jsonizedData = await data.json();
    return jsonizedData;
  };
};

module.exports = getRequest;
