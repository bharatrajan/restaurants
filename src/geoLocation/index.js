export const locationProvider = {
  options: {
    enableHighAccuracy: true,
    maximumAge: 0,
  },

  success: function(position) {
    console.log(`Latitude : ${position.coords.latitude}`);
    console.log(`Longitude: ${position.coords.longitude}`);
    console.log(`More or less ${position.coords.accuracy} meters.`);
  },

  errorHandler: function(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  },

  getCurrentPosition: function(callBackSuccess, callBackError) {
    if (navigator.geolocation && navigator.geolocation.getCurrentPosition)
      navigator.geolocation.getCurrentPosition(
        callBackSuccess || this.success,
        callBackError || this.error,
        this.options
      );
    else callBackError();
  },
};
