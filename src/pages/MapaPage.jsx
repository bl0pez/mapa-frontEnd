import React, { useContext } from 'react';
import { useEffect } from 'react';
import { SocketContext } from '../context';
import { useMapbox } from '../hooks/useMapbox';

const puntoInicial = {
    lng: -70.3082,
    lat: -18.4699,
    zoom: 13
}

export const MapaPage = () => {

    const { setRef, coords, nuevoMarcador$, movimientoMarcador$, actualizarPosicion, agregarMarcador } = useMapbox( puntoInicial );
    const { socket } = useContext( SocketContext );

    // Escuchar los marcadores existentes
    useEffect(() => {
        socket.on('marcadores-activos', (marcadores) => {
            for(const key of Object.keys( marcadores )) {
                agregarMarcador( marcadores[key], key );
            }
        });
    }, [nuevoMarcador$, socket]);

    //Nuevo marcador
    useEffect(() => {
        nuevoMarcador$.subscribe( marcador => {
            socket.emit('marcador-nuevo', marcador);
        });
    }, [nuevoMarcador$, socket]);

    //Movimiento marcador
    useEffect(() => {
        movimientoMarcador$.subscribe( marcador => {
            socket.emit('marcador-actualizado', marcador);
        });
    }, [socket, movimientoMarcador$]);

    //Mover marcador mediante sockets
    useEffect(() => {
        socket.on('marcador-actualizado', (marcador) => {
            actualizarPosicion( marcador );
        });
    }, [socket, actualizarPosicion]);

    //Escuchar nuevos marcadores
    useEffect(() => {
        socket.on('marcador-nuevo', (marcador) => {
            agregarMarcador( marcador, marcador.id );
        });
    }, [socket, agregarMarcador]);

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
