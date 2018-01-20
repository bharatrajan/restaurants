/**
  * @description - Zip code validator
  * @param {string} zipStr - zipCode to be validated
  * @returns {boolean} - valid / invalid
  */
export const zipVaildator = zipStr => /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zipStr);

export const locationProvider = {
  options: {
    enableHighAccuracy: true,
    maximumAge: 0,
  },

  /**
  * @description - Gets the location from Geo Location API
  * @param {callback function} callBackSuccess - called on success
  * @param {callback function} callBackError - called on error
  * @returns null
  */

  getCurrentPosition: function(callBackSuccess, callBackError) {
    if (navigator.geolocation && navigator.geolocation.getCurrentPosition)
      navigator.geolocation.getCurrentPosition(
        callBackSuccess || console.log,
        callBackError || console.error,
        this.options
      );
    else callBackError();
  },
};
