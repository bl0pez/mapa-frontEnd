import { createContext } from 'react';
import { useSocket } from '../hooks/useSocket';

// Create a context
export const SocketContext = createContext();

// Create a provider
export const SocketProvider = ({ children }) => {

    const { socket, online } = useSocket(import.meta.env.VITE_APP_BACKEND_URL);



    return (
        <SocketContext.Provider
            value={{ socket, online }}>
            {children}
        </SocketContext.Provider>
    )
}
