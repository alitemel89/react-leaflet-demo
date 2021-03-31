import React from "react";
import "./App.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import useSwr from "swr";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

const fetcher = (...args) => fetch(...args).then((response) => response.json());

function App() {
  const [activeCrime, setActiveCrime] = React.useState(null);
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const month = selectedDate.getMonth() + 1;
  const year = selectedDate.getFullYear();

  const bicycleTheftUrl = `https://data.police.uk/api/crimes-street/bicycle-theft?lat=52.629729&lng=-1.131592&date=${year}-${month}`;

  const { data, error } = useSwr(bicycleTheftUrl, { fetcher });

  const crimes = data && !error ? data.slice(0, 20) : [];

  return (
    <>
      <header className="heading">
        <h2>Bicycle Theft Crimes</h2>
        <p className="heading-text">
          Please select a month to view bicycle-theft crime locations in
          Leicester.
        </p>
      </header>

      <div className="date-field">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy/MM"
          maxDate={moment().toDate()}
          wrapperClassName="datePicker"
        />
      </div>

      <MapContainer
        center={[52.636256, -1.125933]}
        zoom={12}
        className="map-container"
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {crimes.map((crime) => {
          return (
            <Marker
              key={crime.id}
              position={[crime.location.latitude, crime.location.longitude]}
              eventHandlers={{
                click: () => {
                  setActiveCrime(crime);
                },
              }}
            />
          );
        })}

        {activeCrime && (
          <Popup
            position={[
              activeCrime.location.latitude,
              activeCrime.location.longitude,
            ]}
            eventHandlers={{
              close: () => {
                setActiveCrime(null);
              },
            }}
          >
            <div>
              <h2>🚲 {activeCrime.category}</h2>
              <p>{activeCrime.location.street.name}</p>
              <p>{activeCrime.month}</p>
            </div>
          </Popup>
        )}
      </MapContainer>
    </>
  );
}

export default App;
