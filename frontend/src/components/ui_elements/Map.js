import React, { Component } from 'react'
import GoogleMapReact from 'google-map-react'


/**
 * Makes use of the NPM google-map-react Library to render
 * Google Maps API
 *
 * @author Alex Thompson, W19007452
 */

class Map extends Component {
  constructor(props) {
    super(props)

    // Get the coordinates from props and parse them to float
    let markers = this.props.coordinates.map(c => {
      return {lat: parseFloat(c.lat), lng: parseFloat(c.lng), name: c.name}
    })

    // Location is used to find the distance from your current location
    // to the given props.coordinates
    this.state = {
      markers: markers,
      location: (this.props.my_location !== undefined) ? false : null,
      duration: '',
      distance: ''
    }
  }

  componentDidMount() {
    if (this.props.my_location !== undefined) {
      this.getMyLocation()
    }
  }

  /**
   * If my_location is defined, get the users current location
   * This requires the user to approve their location via the
   * browser otherwise this cannot not be used
   */
  getMyLocation = () => {
    if (this.props.my_location !== undefined) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( location => {
          let markers = this.state.markers
          markers.push({
            lat: location.coords.latitude,
            lng: location.coords.longitude,
            name: 'Your location'
          })
          this.setState({
            markers: markers,
            location: true
          })
        })
      }
    }
  }

  /**
   * react-google-maps function
   * When the map is loaded, the API function is run
   * @param map - the loaded map
   * @param maps - the google API maps
   *
   * Load all the markers or load the route between two locations
   */
  handleApiLoaded = (map, maps) => {
    if (this.state.markers.length > 0) {
      if (this.props.my_location === undefined) {
        let bounds = new maps.LatLngBounds()

        // load each marker on the map
        this.state.markers.forEach(marker => {
          let infoWindow = new maps.InfoWindow({
            content: `<p class='info-window'>${marker.name}</p>`
          })

          let m = new maps.Marker({
            position: {lat: marker.lat, lng: marker.lng},
            map
          })

          // add an info window that the user can click
          // provide the location detail
          m.addListener('click', () => {
            infoWindow.open({
              anchor: m,
              map,
              shouldFocus: false,
            })
          })

          bounds.extend(marker)
        })

        // extend the map to fit all markers
        map.fitBounds(bounds)
        if (this.state.markers.length === 1) {
          // if only 1 marker is present zoom in further
          map.setZoom(15)
        }
      } else {
        let mapsDirectionsRenderer = new maps.DirectionsRenderer()
        let mapsDirectionsService = new maps.DirectionsService()

        let distanceMatrixRequest = {
          origins: [this.state.markers[1].lat+','+this.state.markers[1].lng],
          destinations: [this.state.markers[0].lat+','+this.state.markers[0].lng],
          travelMode: maps.TravelMode.DRIVING,
          unitSystem: maps.UnitSystem.IMPERIAL
        }

        // get the distance between two locations
        new maps.DistanceMatrixService()
          .getDistanceMatrix(distanceMatrixRequest, (response, status) => {
            if (status === maps.DistanceMatrixStatus.OK) {
              let origins = response.originAddresses
              origins.forEach((origin, originIndex) => {
                let results = response.rows[originIndex].elements
                let distance = results[0].distance.text
                let duration = results[0].duration.text

                this.setState({distance: distance, duration: duration})
              })
            }
          })

        let directionsServiceRequest = {
          origin: this.state.markers[1].lat+','+this.state.markers[1].lng,
          destination: this.state.markers[0].lat+','+this.state.markers[0].lng,
          travelMode: maps.TravelMode.DRIVING
        }

        // show the route between two locations
        mapsDirectionsService.route(directionsServiceRequest, (response, status) => {
          if (status === 'OK') {
            mapsDirectionsRenderer.setDirections(response)
          }
        })

        mapsDirectionsRenderer.setMap(map)
      }
    }
  }

  render() {
    // my_location requires an async function to finish, so
    // this loading animation lets the async function finish
    // before displaying the map
    if (this.props.my_location !== undefined) {
      if (!this.state.location) {
        return (
          <div>Loading Map</div>
        )
      }
    }

    return (
      <div>
        <div className='map'>
          <GoogleMapReact
            bootstrapURLKeys={{ key: 'deleted-this-key 🤷‍♂️' }}
            defaultCenter={{lat: 54.9769, lng: -1.6072}}
            defaultZoom={10}
            yesIWantToUseGoogleMapApiInternals={true}
            onGoogleApiLoaded={({ map, maps }) => {
              this.handleApiLoaded(map, maps)
            }}
          />
        </div>
        <p>
          {(this.state.duration !== '') ?
            'Duration: ' +  this.state.duration : null}
          <br />
          {(this.state.distance !== '') ?
            'Distance: ' + this.state.distance : null}
        </p>
      </div>
    )
  }
}

export default Map
