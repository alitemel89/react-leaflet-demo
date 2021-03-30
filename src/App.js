import React from "react";
import "./App.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from 'leaflet';
import * as parkData from "./data/skateparks.json";

const skater = new Icon({
  iconUrl: "/skateboarding.svg",
  iconSize: [25, 25]
})

function App() {
  const [activePark, setActivePark] = React.useState(null);
  console.log(activePark);
  return (
    <>
      <h1>React Leaflet Demo</h1>
      <MapContainer center={[45.421532, -75.697189]} zoom={12}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {parkData.features.map((park) => {
          return (
            <Marker
              key={park.properties.PARK_ID}
              position={[
                park.geometry.coordinates[1],
                park.geometry.coordinates[0],
              ]}
              eventHandlers={{
                click: () => {
                  setActivePark(park);
                },
              }}
              icon={skater}
            />
          );
        })}
        {activePark && (
          <Popup
            position={[
              activePark.geometry.coordinates[1],
              activePark.geometry.coordinates[0],
            ]}
            eventHandlers={{
              close: () => {
                setActivePark(null);
              },
            }}
          >
            <div>
              <h2>{activePark.properties.NAME}</h2>
              <p>{activePark.properties.DESCRIPTIO}</p>
            </div>
          </Popup>
        )}
      </MapContainer>
    </>
  );
}

export default App;
