"use client"

import { useEffect, useRef } from "react"

interface MapProps {
  latitude: number
  longitude: number
  name: string
  address?: string
}

export default function Map({ latitude, longitude, name, address }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && mapRef.current) {
      // Clean up existing map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }

      // Dynamically import Leaflet
      import("leaflet")
        .then((L) => {
          if (!mapRef.current) return

          // Create map
          const map = L.map(mapRef.current, {
            center: [latitude, longitude],
            zoom: 13,
            zoomControl: true,
            scrollWheelZoom: false,
          })

          mapInstanceRef.current = map

          // Add tile layer with better styling
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
            maxZoom: 19,
          }).addTo(map)

          // Custom marker icon
          const customIcon = L.divIcon({
            html: `
            <div style="
              background-color: #3B82F6;
              width: 30px;
              height: 30px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 2px 10px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="
                background-color: white;
                width: 12px;
                height: 12px;
                border-radius: 50%;
              "></div>
            </div>
          `,
            className: "custom-marker",
            iconSize: [30, 30],
            iconAnchor: [15, 15],
          })

          // Add marker with popup
          const popupContent = `
          <div style="text-align: center; padding: 8px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #1F2937;">${name}</h3>
            ${address ? `<p style="margin: 0; color: #6B7280; font-size: 14px;">${address}</p>` : ""}
            <p style="margin: 8px 0 0 0; color: #9CA3AF; font-size: 12px;">
              ${latitude.toFixed(4)}, ${longitude.toFixed(4)}
            </p>
          </div>
        `

          L.marker([latitude, longitude], { icon: customIcon }).addTo(map).bindPopup(popupContent).openPopup()

          // Add a circle to show the area
          L.circle([latitude, longitude], {
            color: "#3B82F6",
            fillColor: "#3B82F6",
            fillOpacity: 0.1,
            radius: 500,
          }).addTo(map)
        })
        .catch((error) => {
          console.error("Error loading Leaflet:", error)
        })
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [latitude, longitude, name, address])

  return <div ref={mapRef} className="w-full h-full rounded-lg" style={{ minHeight: "250px" }} />
}
