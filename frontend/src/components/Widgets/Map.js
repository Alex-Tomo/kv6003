import React, { Component } from 'react'
import GoogleMapReact from 'google-map-react'

class Map extends Component {
  constructor(props) {
    super(props)

    let markers = this.props.coordinates.map(c => {
      return {lat: parseFloat(c.lat), lng: parseFloat(c.lng), name: c.name}
    })

    this.state = {
      markers: markers,
      location: (this.props.my_location !== undefined) ? false : null,
      duration: "",
      distance: ""
    }

    if (this.props.my_location !== undefined) {
      this.getMyLocation()
    }
  }

  getMyLocation = () => {
    if (this.props.my_location !== undefined) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( location => {
          let markers = this.state.markers
          markers.push({
            lat: location.coords.latitude,
            lng: location.coords.longitude,
            name: "Your location"
          })
          this.setState({markers: markers, location: true})
        })
      }
    }
  }

  handleApiLoaded = (map, maps) => {
    if (this.state.markers.length > 0) {
      if (this.props.my_location === undefined) {
        let bounds = new maps.LatLngBounds()

        this.state.markers.map(marker => {
          let infoWindow = new maps.InfoWindow({
            content: `<p class="info-window">${marker.name}</p>`
          })

          let m = new maps.Marker({
            position: {lat: marker.lat, lng: marker.lng},
            map
          })

          m.addListener("click", () => {
            infoWindow.open({
              anchor: m,
              map,
              shouldFocus: false,
            })
          })

          bounds.extend(marker)
        })

        map.fitBounds(bounds)
        if (this.state.markers.length === 1) {
          map.setZoom(15)
        }
      } else {
        let mapsDirectionsRenderer = new maps.DirectionsRenderer()
        let mapsDirectionsService = new maps.DirectionsService()

        let distanceMatrixRequest = {
          origins: [this.state.markers[1].lat + "," + this.state.markers[1].lng],
          destinations: [this.state.markers[0].lat + "," + this.state.markers[0].lng],
          travelMode: maps.TravelMode.DRIVING,
          unitSystem: maps.UnitSystem.IMPERIAL
        }

        let distanceNumber = 0

        new maps.DistanceMatrixService()
          .getDistanceMatrix(distanceMatrixRequest, (response, status) => {
            if (status === maps.DistanceMatrixStatus.OK) {
              let origins = response.originAddresses
              origins.forEach((origin, originIndex) => {
                let results = response.rows[originIndex].elements
                distanceNumber = results[0].distance.value
                let distance = results[0].distance.text
                let duration = results[0].duration.text

                this.setState({distance: distance, duration: duration})
              })
            }
          })

        let directionsServiceRequest = {
          origin: this.state.markers[1].lat + "," + this.state.markers[1].lng,
          destination: this.state.markers[0].lat + "," + this.state.markers[0].lng,
          travelMode: maps.TravelMode.DRIVING
        }

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
    if (this.props.my_location !== undefined) {
      if (!this.state.location) {
        return (
          <div>Loading Map</div>
        )
      }
    }

    return (
      <div>
        <div style={{ margin: "10px 10% 10px 10px", height: '500px', width: 'available'}}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyC9PJvUlePYUdC4yXUQVA1L0wK6gObyQiI' }}
            defaultCenter={{lat: 54.9769, lng: -1.6072}}
            defaultZoom={10}
            yesIWantToUseGoogleMapApiInternals={true}
            onGoogleApiLoaded={({ map, maps }) => {
              this.handleApiLoaded(map, maps)
            }}
          />
        </div>
        <p>
          {(this.state.duration !== "") ? "Duration: " +  this.state.duration : null}
          <br />
          {(this.state.distance !== "") ? "Distance: " + this.state.distance : null}
        </p>
      </div>
    )
  }
}

export default Map
