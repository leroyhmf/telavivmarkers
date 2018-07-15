import React, { Component } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
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
        {lat: 32.084271, lng: 34.780392, name: "Hemda", description: `With great money comes great education. Come here to study
        sciences. The place holds science conventions for everyone and teaches high schoolers arriving from schools from all
        around town three main curriculums Physics, Chemistry and Computer Sciences.`}
      ],
      markerClicked: false
  }
  this.changeMarkerClicked = this.changeMarkerClicked.bind(this);
}

  changeMarkerClicked(markerNum) {
    if (!markerNum && markerNum !== 0) {markerNum = false}
    this.setState({markerClicked: markerNum});
  }

  render() {
    return (
      <div>
      <SideList
        markers={this.state.Markers}
        changeMarkerClicked={this.changeMarkerClicked}
        />
      <GoogleMapSection
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCAQb9xq2iRT6lG8DW3cGP1K43kastziMA"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100vh`, width: `80vw`}} />}
        mapElement={<div style={{ height: `100%` }} />}
        markers={this.state.Markers}
        includeMarkerInBounds={this.includeMarkerInBounds}
        changeMarkerClicked={this.changeMarkerClicked}
      />
      {this.state.markerClicked !== false && <InfoScreen
        markers={this.state.Markers}
        markerClicked={this.state.markerClicked}
        />}
      </div>
    );
  }
}

class SideList extends Component {
  render() {
    return <ul>
      {this.props.markers.map((marker, index) => <li
        key={'marker-onlist-'+index}
        onClick={() => this.props.changeMarkerClicked(index)}>
          <button onClick={(e) => {e.preventDefault()}}>{marker.name}</button>
      </li>)}
    </ul>
  }
}

class InfoScreen extends Component {
  render() {
    return <p>{this.props.markers[this.props.markerClicked]['description']}</p>
  }
}

class GoogleMapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
        bounds: new window.google.maps.LatLngBounds(),
        areBoundsBeingChanged: false,
        timesBoundsChanged: 0
      }
    this.includeMarkerInBounds = this.includeMarkerInBounds.bind(this);
    this.checkIfBoundsAreBeingChanged = this.checkIfBoundsAreBeingChanged.bind(this);
  }

  checkIfBoundsAreBeingChanged() {
    let here = this;
    return new Promise(function (resolve, reject) {
        (function waitForFalse(){
            if (here.state.areBoundsBeingChanged === false) return resolve();
            setTimeout(waitForFalse, 30);
            return reject('bounds are being changed');
        })();
      });
    }

  includeMarkerInBounds(marker) {
    let bounds;
    const ifBoundsHaveFinishedChanging = this.checkIfBoundsAreBeingChanged;
    return ifBoundsHaveFinishedChanging().then(response => {
      this.setState({areBoundsBeingChanged: true});
      bounds = this.state.bounds;
      bounds.extend(marker.props.position);
      return this.setState(prevState => { return {bounds: bounds, areBoundsBeingChanged: false,
        timesBoundsChanged: ++prevState.timesBoundsChanged} }, () => {
          if (this.state.timesBoundsChanged === this.props.markers.length) {
            this._mapRef.fitBounds(this.state.bounds);
          }
        });
      })
    }

    saveMapRef = (ref) => {
      if (!ref || this._mapRef) return;
      this._mapRef = ref;
    }

  render() {
    return (
      <GoogleMap
        defaultZoom={17}
        defaultCenter={{ lat: 32.080359, lng: 34.780670 }}
        ref={this.saveMapRef}
        >
          {
            this.props.markers.map((marker, index) => <Marker
            onClick={() => this.props.changeMarkerClicked(index)}
            position={{lat: marker.lat, lng: marker.lng}}
            ref={this.includeMarkerInBounds}
            key={'marker-onmap-'+index}
            />
          )
       }
      </GoogleMap>
    ) }
}

const GoogleMapSection = withScriptjs( withGoogleMap( GoogleMapContainer ) )

export default App;
