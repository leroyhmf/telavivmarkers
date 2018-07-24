import React, { Component } from 'react';
import { withGoogleMap, GoogleMap } from "react-google-maps";
import MarkerWithLabel from "react-google-maps/lib/components/addons/MarkerWithLabel";
import { DebounceInput } from 'react-debounce-input';
import './App.css';
import { Style } from './mapstyle.js';
const loadGoogleMapsApi = require('load-google-maps-api');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Markers: [
        {num: 0, lat: 32.072532, lng: 34.779597, name: 'Habima Square', type: 'square',
        description: `This might be the center of your universe, if you're a true resident of Tel Aviv!`},
        {num: 1, lat: 32.071323, lng: 34.783824, name: 'Alef High School', type: 'school',
        description: `This was my high school, I rate it 10/10!`},
        {num: 2, lat: 32.077987, lng: 34.784167, name: 'Dubnov Garden', type: 'garden',
        description: `It's a cute garden. I used to come here a lot when I was little.`},
        {num: 3, lat: 32.075160, lng: 34.774908, name: 'Dizengoff Center', type: 'mall',
        description: `This has to be the best mall in Tel Aviv. Seriously, no other mall can compare to it in Israel.
        Locals will tell you that the "center" feels very homie unlike other malls in Tel Aviv such as 'Azrieli' or 'Gindi TLV',
        and that makes it a very special cookie indeed.`},
        {num: 4, lat: 32.078342, lng: 34.778429, name: 'Masarik Square', type: 'square',
        description: `It's a cute spot to chill and think about where you're going with
        your life. The atmosphere can be spiritual and eerie at times.`},
        {num: 5, lat: 32.080384, lng: 34.780709, name: 'Rabin Square', type: 'square',
        description: `Rabin Square is considered quite central in Tel Aviv,
        the Tel Aviv Municipality is connected to it, Hemda (school) is nearby and so are some iconic food joints.`},
        {num: 6, lat: 32.084092, lng: 34.780367, name: "Hemda", type: 'school',
        description: `With great money comes great education. Come here to study
        sciences. The place holds science conventions for everyone and teaches high schoolers arriving from schools from all
        around town three main curriculums Physics, Chemistry and Computer Sciences.`}
      ],
      extraMarkers: [],
      markerClicked: false,
      extraMarkerClicked: false,
      shownMarkers: false,
      hamburgerOpen: false,
      clientOnline: window.navigator.onLine,
      connectedToGoogleMaps: 'dunnoYet',
      disconnectedGoogleMaps: false,
      isMapRendered: false
  }
  this.changeMarkerClicked = this.changeMarkerClicked.bind(this);
  this.changeShownMarkers = this.changeShownMarkers.bind(this);
  this.filterMarkers = this.filterMarkers.bind(this);
  this.updateExtraMarkers = this.updateExtraMarkers.bind(this);
  this.setIsMapRendered = this.setIsMapRendered.bind(this);
}

  setIsMapRendered() {
    this.setState({isMapRendered: true});
  }

  updateExtraMarkers(extraMarkers) {
    this.setState({extraMarkers: extraMarkers})
  }

  componentDidMount() {
    const here = this;
    const loadRoutine = () => {
      loadGoogleMapsApi({key: 'AIzaSyCAQb9xq2iRT6lG8DW3cGP1K43kastziMA'})
      .then(function (googleMaps) {
        window.google.maps = googleMaps;
        here.setState({connectedToGoogleMaps: true})
        return Promise.resolve();
      }).catch(function (error) {
        here.setState({connectedToGoogleMaps: false, googleMapsError: error});
      });
    }
    window.addEventListener('offline', function(e) {
      if (here.state.connectedToGoogleMaps !== true) {
        //If we haven't reached google maps yet and the browser detects we're offline,
        //update client online to false
        here.setState({clientOnline: false}) }
      else {
        //Otherwise, update the state so we know that the user disconnected after initializing
        //google map
        here.setState({disconnectedGoogleMaps: true});
      }});
    window.addEventListener('online', function(e) {
      if (here.state.connectedToGoogleMaps === 'false') {
        //If we failed to connect to Google Maps and reconnected to the internet,
        //try loading google maps again
        loadRoutine()
        .then(
        here.setState({clientOnline: true}));
      }
  });
    loadRoutine();
  }

  changeMarkerClicked(markerNum, isExtra) {
    if (!markerNum && markerNum !== 0 && isExtra === true) {markerNum = false}
    else if (!markerNum && markerNum !== 0 ) {markerNum = false}
    //This means calling this function without a parameter
    // or w/ "false" will set it to false
    if (isExtra) {
      return this.setState({extraMarkerClicked: markerNum})
    }
    isExtra = this.state.extraMarkerClicked
    this.setState({markerClicked: markerNum,
    extraMarkerClicked: false});
  }
  changeShownMarkers(markers) {
    this.setState({shownMarkers: markers});
  }
  filterMarkers(filterInput) {
    let markers = this.state.Markers;
    if (filterInput !== '') {
      const regex = new RegExp(filterInput, 'i')
      markers = markers.filter(marker => regex.test(marker.name) )
    }
    this.changeShownMarkers(markers);
  }

  render() {
    return (
      <div className="main-div">
        <div className="logo-and-sidelist">
        <h1 className="logo"> TLV <span className="logo" style={{color: 'white'}}> Markers </span> </h1>
      <SideList
        markers={this.state.shownMarkers || this.state.Markers}
        originalMarkers={this.state.Markers}
        changeMarkerClicked={this.changeMarkerClicked}
        filterMarkers={this.filterMarkers}
        markerClicked={this.state.markerClicked}
        updateExtraMarkers={this.updateExtraMarkers}
      />
        </div>
    <OnlineOnly
      clientOnline={this.state.clientOnline}
      connectedToGoogleMaps={this.state.connectedToGoogleMaps}
      googleMapsError={this.state.googleMapsError}
      disconnectedGoogleMaps={this.state.disconnectedGoogleMaps}
      isMapRendered={this.state.isMapRendered}
      >
      <GoogleMapSection
        setIsMapRendered={this.setIsMapRendered}
        isMapRendered={this.state.isMapRendered}
        markerClicked={this.state.markerClicked}
        originalMarkers={this.state.Markers}
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCAQb9xq2iRT6lG8DW3cGP1K43kastziMA"
        loadingElement={<div style={{ height: `100%`}} />}
        containerElement={<div className="contain-map" aria-label="locations map" />}
        mapElement={<div style={{ height: `100%` }} />}
        markers={this.state.shownMarkers || this.state.Markers}
        includeMarkerInBounds={this.includeMarkerInBounds}
        changeMarkerClicked={this.changeMarkerClicked}
        extraMarkers={this.state.extraMarkers}
        extraMarkerClicked={this.state.extraMarkerClicked}
      />
    </OnlineOnly>
      </div>
    );
  }
}

class OnlineOnly extends Component {
  state = {
    showAlert: true
  }

  hideAlert = () => {this.setState({showAlert: false})}

  render() {
    if (this.props.clientOnline && this.props.connectedToGoogleMaps === "dunnoYet") {
      return <p>Connecting to Google Maps.</p>
    }
    if (this.props.clientOnline && this.props.connectedToGoogleMaps === true) {
      if (this.props.disconnectedGoogleMaps && this.props.isMapRendered === true)
      {
        return <React.Fragment>
          {this.props.children}
          {this.state.showAlert && <div className="alert"
            role="alertdialog"
            aria-labelledby="dialogTitle"
            aria-describedby="dialogDesc"
            tabIndex="0"
            >
              <div className="flex">
              <h2 id="dialogTitle">You've disconnected.</h2>
              <CloseButton
                className='close'
                handleClick={this.hideAlert}
              /></div>
              <p id="dialogDesc">In order to continue using the map you might need to refresh.</p>
            </div>
          }
          </React.Fragment>
      }
      else if (this.props.disconnectedGoogleMaps && this.props.isMapRendered === false)
      {
        return <p className="alert">Error: We were able to initialize first contact with Google Maps.
            However, somewhere along the way after that your connection
            fell before we could finally ask Google Maps to show us a map on screen.</p>
      }
      else {
        return this.props.children
      }
    }
    else if (this.props.clientOnline && this.props.connectedToGoogleMaps === false) {
      return <div> <p className="alert"> It's not that you're offline, but an unexpected error occured so we couldn't connect to Google Maps. </p>
      {this.props.googleMapsError && <p> {this.props.googleMapsError} </p>}
    </div> }
    else return <p className="alert">You're offline, Google Maps can't load offline!</p>
    }
  }

class SideList extends Component {
  state = {
    filterInput: '',
    hamburgerOpen: false,
    matchMedia: false
  }

  setFilterInput = (event) => {
    let filterInput = event.target.value;
    this.setState({filterInput: filterInput});
    this.props.filterMarkers(filterInput);
  }

  updateHamburger = () => {
      return this.setState(prevState => { return {hamburgerOpen: !prevState.hamburgerOpen} })
  }

  handleResize = () => {
    let matchMedia = false;
    if (window.matchMedia('(min-width: 990px)').matches) {
      matchMedia = true;
      console.log('true');
    }
    else {console.log('false')}
    this.setState({ matchMedia: matchMedia})
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
  }

  handleClick = (markerNum) => {
    this.props.changeMarkerClicked(markerNum);
  }

  handleRevertClick = (e) => {
    e.preventDefault();
    this.props.changeMarkerClicked(false, true); // remove extra marker clicked
    this.props.changeMarkerClicked(false); // remove marker clicked
    this.props.updateExtraMarkers(false) // remove extra markers
  }

  render() {
    return <div>
    <button
      onClick={this.updateHamburger}
      aria-label={
        this.state.hamburgerOpen ? 'open menu' : 'close menu'
      }
      className={this.state.hamburgerOpen ? 'entypo-book-open hamburger' : 'entypo-book hamburger'}>
    </button>
    {(this.state.hamburgerOpen || this.state.matchMedia) && <div className="side-list">
      <div className="menu"><DebounceInput
        onChange={this.setFilterInput}
        value={this.state.setFilterInput}
        debounceTimeout={200}
        placeholder='Type to filter'
        aria-label="Filter markers"
      />
      <ul>
      {this.props.markers.map((marker, index) => <li
        className={'marker-list-item' + (() => {if (marker.num === this.props.markerClicked) return ' selected'
        else return ''})()}
        key={'marker-onlist-'+index}>
          <button className="marker-on-list"
            onClick={() => this.handleClick(marker.num)}>{marker.name}</button>
      </li>)}
    </ul></div>
    {this.props.markerClicked !== false && <InfoScreen
          markers={this.props.originalMarkers}
          markerClicked={this.props.markerClicked}
          handleRevertClick={this.handleRevertClick}
          updateExtraMarkers={this.props.updateExtraMarkers}
          changeMarkerClicked={this.props.changeMarkerClicked}
    />}
</div>}
</div>
  }
}

function CloseButton(props) {return <button
    className='close'
    onClick={props.handleClick}
    aria-label={props.label || "close"}>
      <span className='iconicfill-x' style={{color: 'rgb(59, 49, 49)'}}></span>
    </button>
}

class InfoScreen extends Component {
  render() {
    const marker = this.props.markers[this.props.markerClicked];
    return <div tabIndex="0" className="info-screen"
      role="dialog"
      >
      <div className="flex">
    <CloseButton
      handleClick={this.props.handleRevertClick}
      label='undo marker selection and close'
    />
    <h2>{marker.name}</h2>
    </div>
    <p className="info-describe">{marker['description']}</p>
    <FourSquareInfo
      updateExtraMarkers={this.props.updateExtraMarkers}
      marker={marker}
      changeMarkerClicked={this.props.changeMarkerClicked}
    />
  </div>
  }
}

class FourSquareInfo extends Component {
  state = {
    cafes: []
  }
  fetchUpdate() {
    const marker = this.props.marker;
    const v = '20180323'; // v is for current foursquare api version
    const lL = `${marker.lat},${marker.lng}`; //lat lng
    const clientId = 'BCSJS3NQSKYXTSRBXXGO52YT3GXY1MPXZ2Q03QCAQEH42XKX';
    const clientSecret = '3JGNHARRD3000WJBSMMEYI34MMWCIWNTERIRG1FRLOR2W3OD';
    const categoryId = '4bf58dd8d48988d16d941735';
    // this is the categoryId for cafes, there are others at foursquare
    return fetch(`https://api.foursquare.com/v2/venues/search?ll=${lL}
      &categoryId=${categoryId}
      &client_id=${clientId}
      &client_secret=${clientSecret}
      &radius=250
      &v=${v}&limit=10`,
      {method: "GET",}
    ).then(response => response.json())
    .then(json => {
      let venues = json.response.venues;
      venues = venues.filter(venue => venue.location.lat && venue.location.lng);
      //Kick out, just in case, venues that were sent by Foursquare without lat lngs
      if (Array.isArray(venues) === false) {return Promise.reject("no-venues")};
      //If there's no array left after filtering, or if no array was delivered, abort state change
      this.setState({
      cafes: venues,
      finishedFetch: true
    });
      let extraMarkers = venues;
      for (const extraMarker of extraMarkers) {
        extraMarker.type = 'cafe';
      }
      this.props.updateExtraMarkers(extraMarkers);
    })
    .catch(error => this.setState({
      finishedFetch: 'failed',
      failedFetchError: error
    }))
  }
  componentDidMount() {
    this.fetchUpdate();
  }
  componentDidUpdate(prevProps) {
    if (this.props.marker !== prevProps.marker) {
      this.setState({cafes: []}, () => this.fetchUpdate())
    }
  }

  render() {
    return <div>
      { !this.state.finishedFetch && <p>Hooking up to Foursquare. Please wait!</p> ||
    (this.state.failedFetchError === 'no-venues') && <p>Weird response error. Didn't get venues from Foursquare. Perhaps our API key broke.</p> ||
    ( this.state.finishedFetch === 'failed' ) && <p>Failed to connect to Foursquare. Perhaps you're offline!</p> ||
    this.state.finishedFetch && <div>
          <h3>Cafes around (thanks to Foursquare)</h3>
      <ul className="fs-listings">
      {this.state.cafes.map(
        (cafe, index) => {
        return <li className='fs-listing' key={'l-' + cafe.id}>
          <FSListing cafe={cafe}
            handleClick={() => {
              this.props.changeMarkerClicked(index, true)}}
          />
        </li>
      })}
    </ul></div> }</div>
  }
}

class FSListing extends Component {
  state = {
    moreInfo: false
  }

  render() {
    const cafe = this.props.cafe
    if (!this.state.moreInfo) return <div className="fs-listing">
      <button onClick={this.props.handleClick}><h4
        style={{marginBottom: 0}}>
        {cafe.name || 'No name for cafe'}</h4></button>
    <span>{cafe.location.address || `No address, lat: ${cafe.location.lat} lng ${cafe.location.lng}` || 'No address'}</span></div>
  }
}

class GoogleMapContainer extends Component {
  constructor(props) {
    super(props);
    this.prevMarkers = this.props.markers;
    this.usingFirstMarkers = true;
    //A boolean I pushed in to prevent setting bounds of map on icon clicks,
    //so it doesn't act the same as location filtering for bounding,
  }

  componentDidUpdate(prevProps) {
    if (this.prevMarkers !== this.props.markers) {
      this.prevMarkers = prevProps.markers;
      this.usingFirstMarkers = false;
    }
  }

  includeMarkersInBounds() {
    const centerOfTown = {lat:32.084948, lng:34.781330};
    //Credits for distance function: Salvador Dali on Stack Overflow
    function distance(lat1, lon1, lat2, lon2) {
      var p = 0.017453292519943295;    // Math.PI / 180
      var c = Math.cos;
      var a = 0.5 - c((lat2 - lat1) * p)/2 +
            c(lat1 * p) * c(lat2 * p) *
            (1 - c((lon2 - lon1) * p))/2;
      return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
    }
    let areCurrentMarkersTooCloseToCenter = this.props.markers.some(marker => {
      return distance(centerOfTown.lat, centerOfTown.lng, marker.lat, marker.lng) >= 0.14
    })
    if(!areCurrentMarkersTooCloseToCenter) {return}
    //For example, rabin square is too close to center, without this functionality,
    //showing only rabin square would zoom too far in into the map because the bounds
    //become too small
    let bounds = new window.google.maps.LatLngBounds();
      bounds.extend(centerOfTown);
      this.props.markers.map(marker => {
        bounds.extend({lat: marker.lat, lng: marker.lng})
      })
      this.checkIfMapRefExists().then(
        res => {
          this._mapRef.fitBounds(bounds);
        }
      )
    }

  checkIfMapRefExists() {
    let here = this;
    return new Promise(function(resolve, reject) {
      (function waitForMapRef() {
        if (here._mapRef) {return resolve()}
        return setTimeout(waitForMapRef, 30);
      })()
      })
  }

  getMarkerStyle(markerType) {
    let style = {};
    switch (markerType) {
      case 'square': style.color = '#2a0041';
      style.iconName = 'iconicfill-stop'
      style.size = '21px'; break;
      case 'garden': style.color = 'rgb(0, 50, 11)';
      style.iconName = 'maki-tree-2'
      style.size = '30px'; break;
      case 'mall': style.color = 'rgb(200, 0, 124)';
      style.iconName = 'maki-shop',
      style.size = '22px'; break;
      case 'cafe': style.color = 'rgb(92, 41, 34)';
      style.iconName = 'maki-cafe',
      style.size = '19px'; break;
      case 'school': style.color = 'rgb(133, 73, 0)';
      style.iconName = 'maki-college';
      style.size = '23px'; break;
      default: style.color = '#ea4739';
      style.size = '47px';
      style.iconName = 'iconicfill-map-pin-fill';
    }
    return style
  }

  saveMapRef = (ref) => {
      if (!ref || this._mapRef) return;
      this._mapRef = ref;
      const actualMapObj = ref.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      //react-google-maps turned out to be a very problematic library with little documentation.
      //With that said, I felt I had to use the actual map object to know when the map went through
      //the idle stage (when it actually got fully rendered. You can't know this with just react or plain javascript
      //because the listening to the idle stage is something that the google maps API supplies, and just knowing
      //when the compononent mounted, for example won't tell us if we can actually see the map with everything on it)
      //This shouldn't have drastic side effects because we're only listening for a change
      //in the map and not changing anything. I hope I don't get fired :)
      const setIsMapRendered = this.props.setIsMapRendered;
      window.google.maps.event.addListenerOnce(actualMapObj, 'idle', function(){
        //Uncomment to test what happens when the app doesn't get that the map
        //went through the idle event (meaning we can see a map on screen)
        //debugger;
        //<Turn browser offline at this point>
        //setTimeout(function() {
        //debugger;
        setIsMapRendered(); // }, 200)
      });
    }


  render() {
    let markerClickedObj = false;
    const defaultCenterLatLng = { lat: 32.080359, lng: 34.780670 };
    let markerClickedLatLng = defaultCenterLatLng;
    let zoom = 15;
    if (this.props.markerClicked !== false) {
      zoom = 17;
      if (this.props.extraMarkerClicked) {
        markerClickedObj = this.props.extraMarkers[this.props.extraMarkerClicked];
        markerClickedLatLng = {lat: markerClickedObj.location.lat, lng: markerClickedObj.location.lng};
      } else {
        markerClickedObj = this.props.originalMarkers[this.props.markerClicked];
        markerClickedLatLng = {lat: markerClickedObj.lat, lng: markerClickedObj.lng};
      }
    }
    return (
      <GoogleMap
        defaultOptions={{styles: Style, streetViewControl: false,
        mapTypeControl: false}}
        markerClicked={this.props.marker}
        zoom={zoom}
        center={markerClickedLatLng}
        ref={this.saveMapRef}
        >
          {
            this.props.markers.map((marker, index, markers) => {
              const position = {lat: marker.lat, lng: marker.lng}
              const markerStyle = this.getMarkerStyle(marker.type);
              let opacity = 1;
              let className;
              if (this.props.markerClicked !== false) {
                if (marker.num !== this.props.markerClicked) {opacity = 0.5} else {
                  className="animated tada infinite"
                }
              }
              if (marker === markers[markers.length-1]) {
                if (this.props.markers !== this.prevMarkers ||
                this.usingFirstMarkers === true) {
                this.includeMarkersInBounds();
                this.usingFirstMarkers = false}
                //If we've rendered the final marker, set the bounds
              }
              return <MarkerWithLabel
                opacity={0}
                key={'marker-onmap-'+index}
                labelAnchor={new window.google.maps.Point(6.5, 36)}
                onClick={() => this.props.changeMarkerClicked(marker.num)}
                position={position}
                ref={this.includeMarkerInBounds}
              >
                <div className={className}>
                <span className={markerStyle.iconName} style={
                  {opacity: opacity,
                  color: markerStyle.color,
                  fontSize: markerStyle.size}
                }></span></div>
              </MarkerWithLabel>
            }
          )}
          {
          this.props.extraMarkers && this.props.extraMarkers.map((marker, index) => {
            let opacity = 1;
            let className;
            if (this.props.extraMarkerClicked !== false) {
              if (index !== this.props.extraMarkerClicked) {opacity = 0.5} else {
                className = "animated tada infinite";
              }
            }
            const markerStyle = this.getMarkerStyle(marker.type);
            return <MarkerWithLabel
              opacity={0}
              key={'extra-marker-onmap-'+index}
              position={{lat: marker.location.lat, lng: marker.location.lng}}
              labelAnchor={new window.google.maps.Point(6.5, 36)}
              onClick={() => this.props.changeMarkerClicked(index, true)}
              >
              <div className={className}>
              <span className={markerStyle.iconName} style={
                {color: markerStyle.color,
                opacity: opacity,
                fontSize: markerStyle.size}
              }></span></div>
          </MarkerWithLabel>})
       }
    </GoogleMap>
    ) }
}

const GoogleMapSection = withGoogleMap( GoogleMapContainer )

export default App;
