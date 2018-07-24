TLV Markers
=====================
A Front End Web Dev Udacity course project

## What does this app do

This app was built with create-react-app. There are a few locations in Tel Aviv hardcoded in the app's state. These locations have `lat lng` coordinates which are passed into a google map component. If you use the filter, the locations on the map will update. The hardcoded locations can easily be replaced with a `fetch` call from a server, if wanted.

### InfoScreen

If you click on a marker on the map or on the list, the other markers will have lower opacity so you can tell which marker you clicked. In addition, an InfoScreen will render with details about the marker.

After rendering the hardcoded information about each location, the InfoScreen component fetches more information from the Foursquare API. If the information could not be fetched, the infoscreen will tell you that.

### Service worker

The app comes with create-react-app's built in service worker. In addition, there is a component called `<OnlineOnly> <Children/> </OnlineOnly> ` which only renders whatever children are passed into it if the navigator.onLine prop is true (if the user is online).
It will render other messages as follows (the message numbers have been marked in code with comments for easy access):
1. If you're plain offline from the beginning, true for component props: `clientOnline === false`.
2. If asynchronously loading Google Maps has not finished, true for component props: `connectedToGoogleMaps === 'dunnoYet' && clientOnline === true`.
3. If there was an unexpected error loading Google Maps (e.g API down or API Key broke), true for component props: `connectedToGoogleMaps === false && clientOnline === true`.
4. If you've already established a connection, but the Google Map never rendered because you went offline before it could go through the 'idle' stage/event, true for component props: `connectedToGoogleMaps === true && clientOnline === true && isMapRendered === false && disconnectedGoogleMaps === true`.
5. If you've disconnected from the internet after having a map on screen,
true for component props: `clientOnline === true && connectedToGoogleMaps === true && disconnectedGoogleMaps === true && isMapRendered === true && disconnectedGoogleMaps === true`.
Notice we don't update `clientOnline` anymore after successfully connecting to Google Maps. This boolean should not be used to indicate whether the client is currently online or not but whether it was "initially" online.

Also note that if the client has gone offline before Google Maps managed to load, on going online again, it will be tried to reconnect.

### Async

Calls to Foursquare API are done using `fetch` which means they are asynchronous. In case of an error along the way, the user gets an error message inside the InfoScreen.
In addition, the app has been updated to use 'load-google-maps-api' package to load the Google Maps API asynchronously. Therefore, if Google Maps couldn't be loaded, `<OnlineOnly>` will receive props that Google Maps couldn't be loaded (e.g API down or API Key broke).

## How to run

1. Clone/Download this repo.
2. In Node.js `cd` into the repo.
3. Type in `npm install`.
4. In order for the service worker to work, you will have to `npm run build` the source.
5. Now serve the build locally (`serve -s build`) and you can visit the app at the address `localhost:5000` in your browser.
Do not use `npm start` and assume you can visit `localhost:3000` after `npm install`, the create-react-app service worker does not work on non-production code.
