import { SocketProvider } from "./context"
import { MapaPage } from "./pages/MapaPage"

export const MapasApp = () => {
  return (
    <SocketProvider>
      <MapaPage />
    </SocketProvider>
  )
}
