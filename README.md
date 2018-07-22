TLV Markers
=====================
A Front End Web Dev Udacity course project

## What does this app do

This app was built with create-react-app. There are a few locations in Tel Aviv hardcoded in the app's state. These locations have `lat lng` coordinates which are passed into a google map component. If you use the filter, the locations on the map will update. The hardcoded locations can easily be replaced with a `fetch` call from a server, if wanted.

### InfoScreen

If you click on a marker on the map or on the list, the other markers will have lower opacity so you can tell which marker you clicked. In addition, an InfoScreen will render with details about the marker.

After rendering the hardcoded information about each location, the InfoScreen component fetches more information from the Foursquare API. If the information could not be fetched, the infoscreen will tell you that.

### Service worker

The app comes with create-react-app's built in service worker. In addition, there is a component called `<OnlineOnly> <Children/> </OnlineOnly> ` which only renders whatever children are passed into it if the navigator.onLine prop is true (if the user is online). If false is passed into it, is renders a message passed in offlineMessage prop.

### Async

Calls to Foursquare API are done using `fetch` which means they are asynchronous. In case of an error along the way, the user gets an error message inside the InfoScreen.
In addition, the app has been updated to use 'load-google-maps-api' package to load the Google Maps API asynchronously. Therefore, if Google Maps couldn't be loaded, `<OnlineOnly>` will receive props that Google Maps couldn't be loaded (for example, if you are online but for some odd reason still can't reach google).



## How to run

1. Clone/Download this repo.
2. In Node.js `cd` into the repo.
3. Type in `npm install`.
4. In order for the service worker to work, you will have to `npm run build` the source.
5. Now serve the build locally (`serve -s build`) and you can visit the app at the address `localhost:5000` in your browser.
Do not use `npm start` and assume you can visit `localhost:3000` after `npm install`, the create-react-app service worker does not work on non-production code.
