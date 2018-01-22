## Notes about the app
1) This app saves the preference of browser-based geo-location is on/off
2) This app can take zip code from the user, validates it then make call to zamato-api(free layer) to get restaurant list
3) This app saves those zip codes in browser's localstorage and shows the "history" bar on the top
4) If user allows geo-location, this app automatically makes the API call then populate the nearby restaurant list
5) Along with the list, it shows the driving directions from the current location to the selected restaurant via google-maps api.
6) The Zamoto api & google api are needing an auth. key to make API calls. I placed that auth key in the UI. Ideally, I should have kept that sensitive information in the server side. I wanted to deploy the app in free GitHub pages to show you the demo and so I did not use a serverside proxy for zamoto-api & google maps-api.

## TODO list 
- Make map-widget responsive 
- Start using a server-side proxy (Node + express JS)
- Migrate API keys to server side
- Try adding a sort option to the restaurant list
- Add a spinner to cover the initial zamoto-api call lag