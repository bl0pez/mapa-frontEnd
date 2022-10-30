import React from 'react';
import { useMapbox } from '../hooks/useMapbox';

const puntoInicial = {
    lng: -70.3082,
    lat: -18.4699,
    zoom: 13
}

export const MapaPage = () => {

    const { setRef, coords, agregarMarcador } = useMapbox( puntoInicial );

  return (
    <>

    <div className='info'>
        Lng: {coords.lng} | Lat: {coords.lat} | Zoom: {coords.zoom}
    </div>

    <div 
        ref={ setRef }
        className='mapContainer'>
    </div>
    </>
  )
}
