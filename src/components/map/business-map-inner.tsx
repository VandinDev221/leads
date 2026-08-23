'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Business } from '@/types/business';
import { Star, Phone, MapPin, Eye } from 'lucide-react';
import { ProspectStatusBadge } from '../business/prospect-status-badge';

// Fix icones padrao do Leaflet em Next.js
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

interface BusinessMapInnerProps {
  businesses: Business[];
  onSelectBusiness: (business: Business) => void;
  center?: [number, number];
}

function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function BusinessMapInner({
  businesses,
  onSelectBusiness,
  center = [-2.5298, -44.3025],
}: BusinessMapInnerProps) {
  // Ajustar centro para primeira empresa se houver
  const mapCenter: [number, number] =
    businesses.length > 0 && businesses[0].latitude && businesses[0].longitude
      ? [businesses[0].latitude, businesses[0].longitude]
      : center;

  return (
    <div className="w-full h-[600px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative z-0">
      <MapContainer
        center={mapCenter}
        zoom={13}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRecenter center={mapCenter} />

        {businesses.map((b) => {
          if (!b.latitude || !b.longitude) return null;

          return (
            <Marker key={b.id || b.externalId} position={[b.latitude, b.longitude]}>
              <Popup className="custom-popup">
                <div className="p-1 space-y-2 max-w-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                      {b.category}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug">
                      {b.name}
                    </h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      {b.address}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                    <span className="font-semibold text-slate-600">
                      Distância: {b.distanceKm !== undefined ? `${b.distanceKm} km` : '—'}
                    </span>
                    {b.rating && (
                      <span className="flex items-center gap-1 font-bold text-slate-800">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        {b.rating}
                      </span>
                    )}
                  </div>

                  {b.phone && (
                    <div className="text-xs text-slate-700 font-medium flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {b.phone}
                    </div>
                  )}

                  <div className="pt-1 flex items-center justify-between gap-2">
                    <ProspectStatusBadge status={b.prospectStatus || 'NOVO'} size="sm" />

                    <button
                      onClick={() => onSelectBusiness(b)}
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" /> Ver detalhes
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
