import "./App.css";
import React, { useState } from "react";
import { Map, Marker, InfoWindow } from "@vis.gl/react-google-maps";
import AppButton from "./AppButton";

const CustomMap = () => {
  //------------states------------
  // store clicked location
  const [selectedLocation, setSelectedLocation] = useState({});
  // store list of all locations selected
  const [listOfLocations, setListOfLocations] = useState([]);
  // store marker location
  // shows marker on London by default
  const [markerLocation, setMarkerLocation] = useState({
    lat: 51.509865,
    lng: -0.118092,
  });
  // store show dialog state to add location
  const [showDialog, setShowDialog] = useState(false);
  // store dialog location
  const [dialogLocation, setDialogLocation] = useState("");
  //------------states------------

  //------------functions------------
  // handle click on map
  const handleMapClick = (mapProps) => {
    // checks if location clicked is valid
    if (mapProps.detail.placeId) {
      const lat = mapProps.detail.latLng.lat;
      const lng = mapProps.detail.latLng.lng;
      setShowDialog(true);
      setDialogLocation({ lat, lng });
      setSelectedLocation({ lat, lng });
    } else {
      // show alert message
      alert("Please select the specific location");
    }
  };

  // add location to show in a list
  const onAddLocation = () => {
    // Create a Google Maps Geocoder instance
    const geocoder = new window.google.maps.Geocoder();

    // Reverse geocode the coordinates to get the place name
    geocoder.geocode({ location: selectedLocation }, (results, status) => {
      if (status === "OK") {
        if (results[0]) {
          setListOfLocations([
            ...listOfLocations,
            { name: results[0].formatted_address, location: selectedLocation },
          ]);
          setShowDialog(false);
        }
      } else {
        console.error("Geocoder failed due to: " + status);
      }
    });
  };

  // displays marker on the map for the selected location
  const onViewLocation = (loc) => {
    setMarkerLocation({ lat: loc.lat, lng: loc.lng });
  };

  // deletes selected location from the list
  const onDeleteLocation = (loc) => {
    let updatedList = listOfLocations.filter(
      (l) => loc.lat !== l.location.lat && loc.lng !== l.location.lng
    );
    setListOfLocations(updatedList);
  };

  // Function to export location list as JSON
  const exportLocations = () => {
    const data = JSON.stringify(listOfLocations);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "locations.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Function to import location list from JSON
  const importLocations = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const importedData = JSON.parse(e.target.result);
      console.log('importedData', importedData, 'listOfLocations', listOfLocations)
      setListOfLocations([...listOfLocations, ...importedData]);
    };
    reader.readAsText(file);
  };
  //------------functions------------

  return (
    <>
      <div className="map-container">
        <Map
          style={{ borderRadius: "20px" }}
          defaultZoom={13}
          defaultCenter={markerLocation}
          gestureHandling={"greedy"}
          disableDefaultUI
          onClick={(mapProps) => handleMapClick(mapProps)}
        >
          {showDialog && (
            // displays a dialog to add clicked location
            <InfoWindow position={dialogLocation}>
              <button className="app-button" onClick={onAddLocation}>
                Add this location
              </button>
            </InfoWindow>
          )}

          <Marker position={markerLocation} />
        </Map>
      </div>

      <div className="list-container">
        {/* checks the location list is not empty */}
        {listOfLocations.length > 0 ? (
          <div>
            <p className="list-heading">List of Selected Locations</p>
            {/* displays stored locations  */}
            {listOfLocations.map((loc) => {
              return (
                <div
                  key={loc.location.lat + loc.location.lng}
                  className="list-item"
                >
                  <p className="latLng-text">{loc.name}</p>
                  <div style={{ display: "flex" }}>
                    <AppButton handleClick={() => onViewLocation(loc.location)}>
                      View
                    </AppButton>
                    <AppButton
                      handleClick={() => onDeleteLocation(loc.location)}
                    >
                      Delete
                    </AppButton>
                  </div>
                </div>
              );
            })}
            {/* displays export and import options */}
            <div className="list-footer">
              <AppButton handleClick={exportLocations}>
                Export Locations
              </AppButton>
              <input
                className="app-button"
                type="file"
                accept=".json"
                onChange={importLocations}
              />
            </div>
          </div>
        ) : (
          // displays text msg to select a location
          <div>
            <p className="list-heading">
              Select a location from map to show in a list or import JSON file
            </p>
            <div className="list-footer">
                <input
                  className="app-button"
                  type="file"
                  accept=".json"
                  onChange={importLocations}
                />
              </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CustomMap;
