const zomatoApiMeta = {
  url: 'https://developers.zomato.com/',
  path: 'api/v2.1/geocode',
  getURL: function(longitude, latitude) {
    return `${this.url}${this.path}?lat=${latitude}&lon=${longitude}`;
  },
  headers: {
    'user-key': '3219360d02e0fa6f41c8f53172775e14',
  },
};

export const getRestaurentsList = (
  longitude,
  latitude,
  successHandler,
  errorHandler
) =>
  fetch(zomatoApiMeta.getURL(longitude, latitude), {
    headers: zomatoApiMeta.headers,
  })
    .then(response => response.json())
    .then(successHandler)
    .catch(errorHandler);
