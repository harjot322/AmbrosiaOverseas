import { useEffect, useRef } from "react"
import "leaflet/dist/leaflet.css"
import dynamic from 'next/dynamic'

// Import leaflet dynamically without SSR
const loadLeaflet = () => import('leaflet')

interface OpenStreetMapProps {
  latitude: number
  longitude: number
  zoom?: number
  markerTitle?: string
  customMarker?: string
}

export function OpenStreetMap({
  latitude = 28.658979,
  longitude = 77.211914,
  zoom = 17,
  markerTitle = "Ambrosia Overseas",
  customMarker,
}: OpenStreetMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null) // Use any to avoid type conflicts

  useEffect(() => {
    const initMap = async () => {
      if (!mapContainerRef.current || mapInstanceRef.current) return
    
      try {
        const L = await loadLeaflet()
    
        if (!mapInstanceRef.current) {
          const map = L.map(mapContainerRef.current).setView([latitude, longitude], zoom)
          mapInstanceRef.current = map
    
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(map)
    
          const markerIcon = L.icon({
            iconUrl: customMarker || "/custom-marker.png",
            iconSize: [50, 50],
            iconAnchor: [25, 50],
            popupAnchor: [0, -50],
          })
    
          L.marker([latitude, longitude], { icon: markerIcon })
            .addTo(map)
            .bindPopup(markerTitle)
            .openPopup()
        }
      } catch (error) {
        console.error("Failed to initialize the map:", error)
      }
    }
    

    initMap()

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, []) // Update the dependency array to an empty array

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full min-h-[400px] rounded-lg overflow-hidden"
      aria-label="OpenStreetMap showing Ambrosia Overseas location"
    />
  )
}