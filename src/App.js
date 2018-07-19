import React, { Component } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import { DebounceInput } from 'react-debounce-input';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Markers: [
        {lat: 32.072532, lng: 34.779597, name: 'Habima Square',
        description: `This might be the center of your universe, if you're a true resident of Tel Aviv!`},
        {lat: 32.071323, lng: 34.783824, name: 'Alef High School',
        description: `This was my high school, I rate it 10/10!`},
        {lat: 32.077987, lng: 34.784167, name: 'Dubnov Garden',
        description: `It's a cute garden. I used to come here a lot when I was little.`},
        {lat: 32.075160, lng: 34.774908, name: 'Dizengoff Center',
        description: `This has to be the best mall in Tel Aviv. Seriously, no other mall can compare to it in Israel.
        Locals will tell you that the "center" feels very homie unlike other malls in Tel Aviv such as 'Azrieli' or 'Gindi TLV',
        and that makes it a very special cookie indeed.`},
        {lat: 32.078439, lng: 34.778231, name: 'Masarik Square', description: `It's a cute spot to chill and think about where you're going with
        your life. The atmosphere can be spiritual and eerie at times.`},
        {lat: 32.080384, lng: 34.780709, name: 'Rabin Square', description: `Rabin Square is considered quite central in Tel Aviv,
        the Tel Aviv Municipality is connected to it, Hemda (school) is nearby and so are some iconic food joints.`},
        {lat: 32.084092, lng: 34.780367, name: "Hemda", description: `With great money comes great education. Come here to study
        sciences. The place holds science conventions for everyone and teaches high schoolers arriving from schools from all
        around town three main curriculums Physics, Chemistry and Computer Sciences.`}
      ],
      markerClicked: false,
      shownMarkers: false
  }
  this.changeMarkerClicked = this.changeMarkerClicked.bind(this);
  this.changeShownMarkers = this.changeShownMarkers.bind(this);
  this.filterMarkers = this.filterMarkers.bind(this);
}

  changeMarkerClicked(markerNum) {
    if (!markerNum && markerNum !== 0) {markerNum = false}
    this.setState({markerClicked: markerNum});
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
        <h1 className="logo"> TLV <span className="logo" style={{color: 'white'}}> Markers </span> </h1>
      <SideList
        markers={this.state.shownMarkers || this.state.Markers}
        changeMarkerClicked={this.changeMarkerClicked}
        filterMarkers={this.filterMarkers}
        markerClicked={this.state.markerClicked}
        >
          {this.state.markerClicked !== false && <InfoScreen
            markers={this.state.Markers}
            markerClicked={this.state.markerClicked}
            />}
      </SideList>
      <GoogleMapSection
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCAQb9xq2iRT6lG8DW3cGP1K43kastziMA"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div className="contain-map" />}
        mapElement={<div style={{ height: `100%` }} />}
        markers={this.state.shownMarkers || this.state.Markers}
        includeMarkerInBounds={this.includeMarkerInBounds}
        changeMarkerClicked={this.changeMarkerClicked}
      />
      </div>
    );
  }
}

class SideList extends Component {
  state = {
    filterInput: ''
  }

  setFilterInput = (event) => {
    let filterInput = event.target.value;
    this.setState({filterInput: filterInput});
    this.props.filterMarkers(filterInput);
  }

  handleClick = (markerNum) => {
    this.props.changeMarkerClicked(markerNum);
  }

  render() {
    return <div className="side-list">
      <DebounceInput
        onChange={this.setFilterInput}
        value={this.state.setFilterInput}
        debounceTimeout={200}
      />
      <ul>
      {this.props.markers.map((marker, index) => <li
        className={'marker-list-item' + (() => {if (index === this.props.markerClicked) return ' selected'
        else return ''})()}
        key={'marker-onlist-'+index}
        onClick={() => this.props.changeMarkerClicked(index)}>
          <button className="marker-on-list" onClick={() => this.handleClick(index)}>{marker.name}</button>
      </li>)}
    </ul>
    {this.props.children}
  </div>
  }
}

class InfoScreen extends Component {
  render() {
    const marker = this.props.markers[this.props.markerClicked];
    return <div className="info-screen">
    <h2>{marker.name}</h2>
    <p>{marker['description']}</p>
    <FourSquareInfo marker={marker}/>
  </div>
  }
}

class FourSquareInfo extends Component {
  state = {
    cafes: []
  }
  fetchUpdate() {
    const marker = this.props.marker;
    const v = '20180323'; // v is for current forsquare api version
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
    ).then(response => response.json()).then(json =>
      {console.log(json);
      this.setState({
      cafes: json.response.venues,
      finishedFetch: true
    })
    })
    .catch(error => this.setState({
      finishedFetch: 'failed'
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
    ( this.state.finishedFetch === 'failed' ) && <p>Failed to connect to Foursquare. Perhaps you're offline!</p> ||
    this.state.finishedFetch && <ul>
      {this.state.cafes.map(
        cafe => <li key={'l-' + cafe.id}><FSListing cafe={cafe}/></li>
      )}
    </ul> }</div>
  }
}

class FSListing extends Component {
  state = {
    cafe: this.props.cafe,
    moreInfo: false
  }

  fetchUpdate() {
      const id = this.props.cafe.id;
      console.log(id);
      const v = '20180323'; // v is for current forsquare api version
      const clientId = 'BCSJS3NQSKYXTSRBXXGO52YT3GXY1MPXZ2Q03QCAQEH42XKX';
      const clientSecret = '3JGNHARRD3000WJBSMMEYI34MMWCIWNTERIRG1FRLOR2W3OD';

      return fetch(`https://api.foursquare.com/v2/venues/${id}?
      &client_id=${clientId}
      &client_secret=${clientSecret}
      &v=${v}
      `,
      {method: "GET",}
    ).then(response => response.json()).then(json => {console.log(json); return this.setState({moreInfo: json.response})});
  }

  componentDidMount() {
    this.fetchUpdate();
  }

  render() {
    const name = this.state.cafe.name;
    if (!this.state.moreInfo) return <div><h4>{name}</h4>
    <span>I'll be able to tell you more about {name} in a jiffy!</span></div>
    if (this.state.moreInfo && this.state.moreInfo.rating) return <div><h4>{name}</h4>
    <p>
      {this.state.moreInfo.rating}
    </p></div>
    else if (this.state.moreInfo && !this.state.moreInfo.rating) return <div>
          <h4>{name}</h4>
          <p>No rating</p>
          </div>
  }
}

class GoogleMapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
        zoom: 17
      }
  }

  includeMarkersInBounds() {
    if(this.props.markers.length < 2) {return}
    let bounds = new window.google.maps.LatLngBounds();
    const centerOfTown = {lat:32.080748, lng:34.781330};
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

  saveMapRef = (ref) => {
      if (!ref || this._mapRef) return;
      this._mapRef = ref;
    }


  render() {
    return (
      <GoogleMap
        defaultZoom={this.state.zoom}
        zoom={this.state.zoom}
        defaultCenter={{ lat: 32.080359, lng: 34.780670 }}
        ref={this.saveMapRef}
        >
          {
            this.props.markers.map((marker, index, markers) => {
              const position = {lat: marker.lat, lng: marker.lng}
              if (marker === markers[markers.length-1]) {
                this.includeMarkersInBounds();
              }
              return <Marker
                key={'marker-onmap-'+index}
                onClick={() => this.props.changeMarkerClicked(index)}
                position={position}
                ref={this.includeMarkerInBounds}
              />
            }
          )
       }
    </GoogleMap>
    ) }
}

const GoogleMapSection = withScriptjs( withGoogleMap( GoogleMapContainer ) )

export default App;
