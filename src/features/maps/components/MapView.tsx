'use client';

import {
  useEffect,
  useMemo,
} from 'react';

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet';

import L from 'leaflet';

import type {
  MapLocation,
} from '../types';

import {
  formatCoordinates,
} from '../lib/maps';

import 'leaflet/dist/leaflet.css';

type MapViewProps = {
  location: MapLocation | null;
};

const DEFAULT_CENTER: [
  number,
  number,
] = [
  20.5937,
  78.9629,
];

function MapController({
  location,
}: {
  location: MapLocation | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!location) {
      return;
    }

    map.flyTo(
      [
        location.latitude,
        location.longitude,
      ],
      16,
      {
        animate: true,
        duration: 1.5,
      },
    );
  }, [location, map]);

  return null;
}

function createLocationIcon() {
  return L.divIcon({
    className:
      'nexa-current-location-marker',
    html: `
      <div
        style="
          position: relative;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        "
      >
        <div
          style="
            position: absolute;
            width: 30px;
            height: 30px;
            border-radius: 9999px;
            background: rgba(59, 130, 246, 0.22);
            animation: nexa-location-pulse 2s infinite;
          "
        ></div>

        <div
          style="
            position: relative;
            width: 18px;
            height: 18px;
            border-radius: 9999px;
            background: #2563eb;
            border: 3px solid white;
            box-shadow: 0 2px 12px rgba(0,0,0,0.45);
          "
        ></div>
      </div>

      <style>
        @keyframes nexa-location-pulse {
          0% {
            transform: scale(0.7);
            opacity: 0.8;
          }

          70% {
            transform: scale(1.4);
            opacity: 0;
          }

          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }
      </style>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

export function MapView({
  location,
}: MapViewProps) {
  const locationIcon =
    useMemo(
      () => createLocationIcon(),
      [],
    );

  return (
    <div className="h-full min-h-[420px] overflow-hidden rounded-3xl border border-white/10">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={5}
        scrollWheelZoom={true}
        zoomControl={true}
        className="h-full min-h-[420px] w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController
          location={location}
        />

        {location && (
          <Marker
            position={[
              location.latitude,
              location.longitude,
            ]}
            icon={locationIcon}
          >
            <Popup>
              <div className="space-y-1">
                <strong>
                  {location.name ??
                    'My location'}
                </strong>

                <div>
                  {formatCoordinates(
                    location.latitude,
                    location.longitude,
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
