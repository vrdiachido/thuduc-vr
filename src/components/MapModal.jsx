import { Modal } from '@mantine/core'
import React, { useState, useEffect, useRef } from 'react'
import { getAllHotspots, searchHotspotsByTitle } from '../services/hotspots.service'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { FaLocationArrow, FaSearch, FaMapMarkedAlt } from 'react-icons/fa'

const MapModal = ({
    opened, onClose, showMedia, currentHotspot, setCurrentHotspot
}) => {
    const [allHotspots, setAllHotspots] = useState([])
    const [hotspots, setHotspots] = useState([])
    const [searchTitle, setSearchTitle] = useState('')
    const [selectedHotspot, setSelectedHotspot] = useState(null)
    const [loading, setLoading] = useState(true)
    const [viewingCurrentHotspot, setViewingCurrentHotspot] = useState(true)

    const mapContainer = useRef(null)
    const map = useRef(null)
    const markers = useRef({})
    const initialFlyDone = useRef(false)

    // Add state for search suggestions
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [filteredSuggestions, setFilteredSuggestions] = useState([])
    const searchInputRef = useRef(null)

    // Default center (Ho Chi Minh City)
    const defaultCenter = { lat: 10.762622, lon: 106.660172 }

    // Function to fetch all hotspots
    const fetchHotspots = async () => {
        try {
            setLoading(true)
            const data = await getAllHotspots()
            setAllHotspots(data)
            setHotspots(data)
            setLoading(false)
            return data
        } catch (error) {
            console.error('Error fetching hotspots:', error)
            setLoading(false)
            return []
        }
    }

    // Function to search hotspots (API-based)
    const searchHotspotsByTitleApi = async (query) => {
        if (!query.trim()) {
            setHotspots(allHotspots)
            return
        }

        try {
            setLoading(true)
            const data = await searchHotspotsByTitle(query)
            setHotspots(data)
            setLoading(false)
        } catch (error) {
            console.error('Error searching hotspots:', error)
            setLoading(false)
        }
    }

    // Set initial selected hotspot to current hotspot
    useEffect(() => {
        if (currentHotspot && opened) {
            setSelectedHotspot(currentHotspot)
            setViewingCurrentHotspot(true)
        }
    }, [currentHotspot, opened])

    // Fly to current hotspot when modal opens
    useEffect(() => {
        if (opened && currentHotspot && map.current &&
            map.current.loaded && map.current.loaded()) {

            // Check if hotspot has valid coordinates
            if (currentHotspot.geolocation?.lat &&
                currentHotspot.geolocation?.lon &&
                currentHotspot.geolocation.lat !== 0 &&
                currentHotspot.geolocation.lon !== 0) {

                flyToHotspot(currentHotspot)
                setViewingCurrentHotspot(true)
                initialFlyDone.current = true
            }
        }
    }, [opened, currentHotspot])

    // Load hotspots when component mounts
    useEffect(() => {
        fetchHotspots()
    }, [])

    // Initialize map when component mounts and hotspots are loaded
    useEffect(() => {
        // Don't initialize map if it's already created, modal is not open, or still loading
        if (!opened || loading || map.current) return

        // Reset flag when map is initialized
        initialFlyDone.current = false

        // Need a small delay to ensure the DOM is fully rendered
        const timer = setTimeout(() => {
            if (!mapContainer.current) {
                console.error('Map container reference is not available');
                return;
            }

            try {
                // Get MapLibre API key from environment variables
                const mapKey = import.meta.env.VITE_GOONG_MAP_TILES_KEY
                const mapUrl = 'https://tiles.goong.io/assets/'

                // Create the map instance
                map.current = new maplibregl.Map({
                    container: mapContainer.current,
                    style: `${mapUrl}goong_map_web.json?api_key=${mapKey}`,
                    center: [defaultCenter.lon, defaultCenter.lat],
                    zoom: 12
                })

                map.current.addControl(new maplibregl.NavigationControl())

                // Wait for map to load before adding markers
                map.current.on('load', () => {
                    addMarkers()

                    // Fly to current hotspot after map loads if we have one
                    if (currentHotspot && !initialFlyDone.current &&
                        currentHotspot.geolocation?.lat &&
                        currentHotspot.geolocation?.lon &&
                        currentHotspot.geolocation.lat !== 0 &&
                        currentHotspot.geolocation.lon !== 0) {

                        flyToHotspot(currentHotspot)
                        initialFlyDone.current = true
                    }
                })
            } catch (error) {
                console.error('Error initializing map:', error);
            }
        }, 100); // Small delay to ensure container is available

        // Cleanup function
        return () => {
            clearTimeout(timer);
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        }
    }, [loading, opened, currentHotspot])

    // Add markers for hotspots with valid coordinates
    const addMarkers = () => {
        // Don't proceed if map is not available
        if (!map.current) return;

        // Clear existing markers
        Object.values(markers.current).forEach(marker => {
            if (marker && typeof marker.remove === 'function') {
                marker.remove();
            }
        });
        markers.current = {};

        // Add a marker for each hotspot with valid coordinates
        hotspots.forEach(hotspot => {
            if (hotspot.geolocation &&
                hotspot.geolocation.lat && hotspot.geolocation.lat !== 0 &&
                hotspot.geolocation.lon && hotspot.geolocation.lon !== 0) {

                // Create marker element
                const markerEl = document.createElement('div')
                markerEl.className = 'map-marker'
                markerEl.style.width = '24px'
                markerEl.style.height = '24px'
                markerEl.style.borderRadius = '50%'
                markerEl.style.backgroundColor = '#4285F4'
                markerEl.style.border = '2px solid white'
                markerEl.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)'
                markerEl.style.cursor = 'pointer'

                // Highlight current hotspot marker
                if (currentHotspot && hotspot.id === currentHotspot.id) {
                    markerEl.style.backgroundColor = '#FF4500'
                    markerEl.style.width = '28px'
                    markerEl.style.height = '28px'
                    markerEl.style.zIndex = '10'
                    markerEl.style.border = '3px solid white'
                }

                // Create popup for the marker with safer HTML
                const popup = new maplibregl.Popup({ offset: 25 })
                    .setHTML(`
                        <div style="padding: 5px;">
                            <h3 style="margin: 0 0 5px 0; font-weight: bold;">${hotspot.title || 'No Title'}</h3>
                            <p style="margin: 0 0 5px 0; font-size: 12px;">${hotspot.address || 'Không có địa chỉ'}</p>
                            <div style="display: flex; gap: 5px;">
                                <button 
                                    style="background: #4285F4; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; font-size: 12px;"
                                    id="view-panorama-${hotspot.id}">
                                    Xem 360°
                                </button>
                                <button 
                                    style="background: #28a745; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; font-size: 12px;"
                                    id="set-current-${hotspot.id}">
                                    Đặt làm điểm hiện tại
                                </button>
                            </div>
                        </div>
                    `)

                // Create marker
                try {
                    const marker = new maplibregl.Marker({ element: markerEl })
                        .setLngLat([hotspot.geolocation.lon, hotspot.geolocation.lat])
                        .setPopup(popup)
                        .addTo(map.current)

                    // Store marker reference
                    markers.current[hotspot.id] = marker

                    // Handle marker click
                    markerEl.addEventListener('click', () => {
                        setSelectedHotspot(hotspot)
                        // Check if we're viewing a different hotspot than the current one
                        setViewingCurrentHotspot(currentHotspot && hotspot.id === currentHotspot.id)
                    })

                    // Add event listener for popup open
                    popup.on('open', () => {
                        // Button to view panorama
                        const viewButton = document.getElementById(`view-panorama-${hotspot.id}`);
                        if (viewButton) {
                            viewButton.addEventListener('click', () => {
                                if (hotspot.click_panorama_id && showMedia) {
                                    showMedia(hotspot.click_panorama_id);
                                    onClose();
                                }
                            });
                        }

                        // Button to set as current hotspot
                        const setCurrentButton = document.getElementById(`set-current-${hotspot.id}`);
                        if (setCurrentButton) {
                            setCurrentButton.addEventListener('click', () => {
                                setCurrentHotspot(hotspot);
                                setViewingCurrentHotspot(true);
                            });
                        }
                    });
                } catch (error) {
                    console.error(`Error creating marker for hotspot ${hotspot.id}:`, error);
                }
            }
        })
    }

    // Re-add markers when hotspots change
    useEffect(() => {
        if (map.current && map.current.loaded && map.current.loaded()) {
            addMarkers();
        }
    }, [hotspots, currentHotspot]);

    // Handle search - using local filtering
    const handleSearch = (e) => {
        e.preventDefault()
        const query = searchTitle.toLowerCase().trim()

        if (!query) {
            // Reset to all hotspots if search is empty
            setHotspots(allHotspots)
            return
        }

        // Local filtering option
        const filtered = allHotspots.filter(
            hotspot => hotspot.title && hotspot.title.toLowerCase().includes(query)
        )

        setHotspots(filtered)

        // If we have exactly one result, select it and fly to it
        if (filtered.length === 1 && filtered[0].geolocation) {
            flyToHotspot(filtered[0])
        }

        // Alternative: API-based search (uncomment to use)
        // searchHotspotsByTitleApi(query)
    }

    // Handle input change with real-time filtering
    const handleSearchChange = (e) => {
        const query = e.target.value
        setSearchTitle(query)

        if (!query.trim()) {
            setShowSuggestions(false)
            setFilteredSuggestions([])
            return
        }

        // Filter hotspots by title as user types
        const filtered = allHotspots.filter(
            hotspot => hotspot.title &&
                hotspot.title.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5) // Limit to 5 results for performance

        setFilteredSuggestions(filtered)
        setShowSuggestions(true)
    }

    // Handle suggestion selection
    const handleSelectSuggestion = (hotspot) => {
        setSearchTitle(hotspot.title)
        setShowSuggestions(false)

        // Fly to the selected hotspot
        flyToHotspot(hotspot)
    }

    // Handle click outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchInputRef.current && !searchInputRef.current.contains(e.target)) {
                setShowSuggestions(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    // Fly to a specific hotspot location
    const flyToHotspot = (hotspot) => {
        if (!map.current || !hotspot.geolocation ||
            !hotspot.geolocation.lat || hotspot.geolocation.lat === 0 ||
            !hotspot.geolocation.lon || hotspot.geolocation.lon === 0) {
            return
        }

        setSelectedHotspot(hotspot)

        // Set viewingCurrentHotspot based on if this is the current hotspot
        setViewingCurrentHotspot(currentHotspot && hotspot.id === currentHotspot.id)

        map.current.flyTo({
            center: [hotspot.geolocation.lon, hotspot.geolocation.lat],
            zoom: 15,
            duration: 1000
        })

        // Open popup for this marker
        const marker = markers.current[hotspot.id]
        if (marker) {
            marker.togglePopup()
        }
    }

    // Fly back to current hotspot location
    const flyToCurrentHotspot = () => {
        if (currentHotspot) {
            flyToHotspot(currentHotspot)
            setViewingCurrentHotspot(true)
        }
    }

    // Show panorama for selected hotspot
    const handleShowPanorama = () => {
        if (selectedHotspot && selectedHotspot.click_panorama_id && showMedia) {
            showMedia(selectedHotspot.click_panorama_id)
            onClose()
        }
    }

    // Set selected hotspot as current hotspot
    const handleSetCurrentHotspot = () => {
        if (selectedHotspot) {
            setCurrentHotspot(selectedHotspot)
            setViewingCurrentHotspot(true)
        }
    }

    // Cleanup on unmount or when modal closes
    useEffect(() => {
        return () => {
            // Clean up markers
            Object.values(markers.current).forEach(marker => {
                if (marker && typeof marker.remove === 'function') {
                    marker.remove();
                }
            });
            markers.current = {};

            // Clean up map
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        }
    }, []);

    // Clean up when modal closes
    useEffect(() => {
        if (!opened && map.current) {
            map.current.remove();
            map.current = null;
        }
    }, [opened]);

    // Custom title component with search form and autocomplete
    const ModalTitle = (
        <div className="w-full flex items-center">
            <form onSubmit={handleSearch} className="flex-1 flex items-center">
                <div className="relative flex-1" ref={searchInputRef}>
                    <input
                        type="text"
                        value={searchTitle}
                        onChange={handleSearchChange}
                        placeholder="Tìm kiếm địa điểm..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500"
                    >
                        <FaSearch />
                    </button>

                    {/* Autocomplete suggestions dropdown */}
                    {showSuggestions && filteredSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 w-full mt-1 bg-white shadow-lg rounded-md overflow-hidden z-50 border border-gray-200">
                            {filteredSuggestions.map((hotspot) => (
                                <div
                                    key={hotspot.id}
                                    className="px-4 py-2 cursor-pointer hover:bg-blue-50 transition-colors flex items-center"
                                    onClick={() => handleSelectSuggestion(hotspot)}
                                >
                                    <span className="mr-2 text-blue-500">
                                        <FaMapMarkedAlt size={16} />
                                    </span>
                                    <div>
                                        <div className="font-medium">{hotspot.title}</div>
                                        {hotspot.address && (
                                            <div className="text-xs text-gray-500">{hotspot.address}</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </form>
        </div>
    );

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={ModalTitle}
            centered
            size="lg"
            overlayProps={{
                backgroundOpacity: 0.1,
            }}
        >
            {loading ? (
                <div className="flex justify-center items-center h-96">
                    <p>Đang tải bản đồ...</p>
                </div>
            ) : (
                <div className="h-96 w-full rounded-lg overflow-hidden mb-4 border relative">
                    <div ref={mapContainer} className="h-full w-full" id="map-container"></div>

                    {/* Button to return to current hotspot location */}
                    {!viewingCurrentHotspot && currentHotspot && (
                        <button
                            onClick={flyToCurrentHotspot}
                            className="absolute right-4 bottom-4 p-3 rounded-full bg-white shadow-lg hover:bg-gray-100 z-10 flex items-center"
                            title="Quay lại vị trí hiện tại"
                        >
                            <FaLocationArrow className="text-blue-600" />
                        </button>
                    )}
                </div>
            )}

            <div className="flex flex-col items-center justify-center py-4">
                <h2 className="text-lg font-semibold">Thông tin địa điểm</h2>
                {selectedHotspot ? (
                    <>
                        <div className="flex items-center mb-2">
                            <p className="text-gray-500 font-medium">Tên: {selectedHotspot.title}</p>
                            {currentHotspot && selectedHotspot.id === currentHotspot.id && (
                                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Hiện tại</span>
                            )}
                        </div>
                        <p className="text-gray-500">Địa chỉ: {selectedHotspot.address || 'Không có địa chỉ'}</p>
                        {selectedHotspot.description && (
                            <p className="text-gray-500 max-h-32 overflow-y-auto mt-2 text-center">
                                {selectedHotspot.description.substring(0, 150)}
                                {selectedHotspot.description.length > 150 ? '...' : ''}
                            </p>
                        )}
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={handleShowPanorama}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                            >
                                Xem 360°
                            </button>
                            {(!currentHotspot || selectedHotspot.id !== currentHotspot.id) && (
                                <button
                                    onClick={handleSetCurrentHotspot}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
                                >
                                    Đặt làm điểm hiện tại
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <p className="text-gray-500">Chọn một địa điểm trên bản đồ để xem thông tin</p>
                )}
            </div>

            <div className="flex justify-between">
                {currentHotspot && !viewingCurrentHotspot && (
                    <button
                        onClick={flyToCurrentHotspot}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200 flex items-center gap-2"
                    >
                        <FaLocationArrow className="text-blue-600" />
                        Quay lại vị trí hiện tại
                    </button>
                )}
                <div className="ml-auto">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default MapModal