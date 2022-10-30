import { useCallback, useEffect, useRef, useState } from "react";
import mapboxgl from 'mapbox-gl';
import { v4 } from 'uuid';
import { Subject } from 'rxjs';

mapboxgl.accessToken = 'pk.eyJ1IjoiYnJ5YW5sb3BlenMiLCJhIjoiY2w5dWwzdTVoMjJlYzN2b3VjOHg4NWo3bCJ9.6TYm_jtPU7qLWwRpifQWbQ';

export const useMapbox = (puntoInicial) => {
  
    // Referencia al div del mapa
    const mapRef = useRef();
    const setRef = useCallback((node) => {
        mapRef.current = node;
    });

    // Referencia a los marcadores
    const marcadores = useRef({});

    //Observables de Rxjs
    const movimientoMarcador = useRef(new Subject());
    const nuevoMarcador = useRef(new Subject());
    
    // Mapa y coords
    const mapa = useRef();
    const [coords, setCoords] = useState(puntoInicial);

    // Funcion para agregar marcadores
    const agregarMarcador = useCallback((ev, id) => {
        const { lng, lat } = ev.lngLat || ev;
        const marker = new mapboxgl.Marker();
        marker.id = id ?? v4();
        marker
        .setLngLat([lng, lat])
        .addTo(mapa.current)
        .setDraggable(true);

        marcadores.current[marker.id] = marker;

        if(!id) {
            // Emitir los marcadores
            nuevoMarcador.current.next({
                id: marker.id,
                lng,
                lat
            });
        }


        //Escuchar movimientos del marcador
        marker.on('drag', ({ target }) => {
            const { id } = target;
            const { lng, lat } = target.getLngLat();
            
            // Emitir los marcadores
            movimientoMarcador.current.next({ id, lng, lat });


        });

    }, []);

    // Actualizar la posicion del marcador
    const actualizarPosicion = useCallback(({ id, lng, lat }) => {
        marcadores.current[id].setLngLat([lng, lat]);
    }, []);

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapRef.current, // container ID
            style: 'mapbox://styles/mapbox/streets-v11', // style URL
            center: [puntoInicial.lng, puntoInicial.lat], // starting position [lng, lat]
            zoom: puntoInicial.zoom // starting zoom
        });

        mapa.current = map;


    }, [puntoInicial]);
    
    //Actualiza las coordenadas cuando se mueve el mapa
    useEffect(() => {
      mapa.current?.on('move', () => {
        const { lng, lat } = mapa.current.getCenter();
        setCoords({
            lng: lng.toFixed(4),
            lat: lat.toFixed(4),
            zoom: mapa.current.getZoom().toFixed(2)
        });
      });

      //Hacemos un return para que cuando se desmonte el componente se desactive el listener
      // return map?.off('move');

    }, []);

    //agregar marcadores al mapa
    useEffect(() => {
        mapa.current?.on('click', agregarMarcador);
    }, [agregarMarcador]);
    

    return {
        coords,
        agregarMarcador,
        actualizarPosicion,
        marcadores,
        nuevoMarcador$: nuevoMarcador.current,
        movimientoMarcador$: movimientoMarcador.current,
        setRef,
    }

}
