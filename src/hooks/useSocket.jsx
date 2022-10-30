import { useEffect, useMemo, useState } from 'react';
import io from 'socket.io-client';

export const useSocket = (servarPath) => {
    // useMemo: memoriza el valor de la variable
    const socket = useMemo(() => io.connect(servarPath, {
        transports: ['websocket']
    }), [servarPath]);

    const [online, setOnline] = useState(false);

    //Escuchamos cuando el servidor se conecta
    useEffect(() => {
        setOnline(socket.connected);
    }, [socket]);

    //Escuchamos cuando el servidor se reconecta
    useEffect(() => {
        socket.on('connect', () => {
            setOnline(true);
        });
    }, [socket]);

    //Escuchamos cuando el servidor se desconecta
    useEffect(() => {
        socket.on('disconnect', () => {
            setOnline(false);
        });
    }, [socket]);

    return {
        socket,
        online
    };
}