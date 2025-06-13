import React, { useState, useEffect, useRef } from 'react'
import { Modal } from '@mantine/core'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import useHotspotStore from '../store/hotspot.store'
import './MapModal.css'
import {
    FaLocationArrow, FaSearch, FaCompass,
    FaTimes, FaMapMarkerAlt, FaInfoCircle, FaLayerGroup
} from 'react-icons/fa'

const MapModal = ({
    setCurrentHotspot,
    currentHotspot,
    showMedia,
    opened,
    onClose
}) => {
    const { fetchHotspots } = useHotspotStore()

    // State management
    const [hotspots, setHotspots] = useState([])
    const [searchTitle, setSearchTitle] = useState('')
    const [selectedHotspot, setSelectedHotspot] = useState(null)
    const [loading, setLoading] = useState(true)
    const [viewingCurrentHotspot, setViewingCurrentHotspot] = useState(true)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [filteredSuggestions, setFilteredSuggestions] = useState([])

    // Refs
    const mapContainer = useRef(null)
    const map = useRef(null)
    const markers = useRef({})
    const initialFlyDone = useRef(false)
    const searchInputRef = useRef(null)

    // Default center (Ho Chi Minh City)
    const defaultCenter = { lat: 10.762622, lon: 106.660172 }

    // Load hotspots and handle initial selection
    useEffect(() => {
        if (!opened) return

        const loadData = async () => {
            setLoading(true)
            try {
                const data = await fetchHotspots()
                setHotspots(data)

                // Set current hotspot as selected if available
                if (currentHotspot) {
                    setSelectedHotspot(currentHotspot)
                    setViewingCurrentHotspot(true)
                }
            } catch (error) {
                console.error('Error fetching hotspots:', error)
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [fetchHotspots, opened, currentHotspot])

    // Initialize map
    useEffect(() => {
        // Skip if modal is not open, map is loading, or map already exists
        if (!opened || loading || map.current) return

        initialFlyDone.current = false

        const initMap = () => {
            if (!mapContainer.current) return

            try {
                // Initialize map with Goong Map tiles
                const mapKey = import.meta.env.VITE_GOONG_MAP_TILES_KEY
                const mapUrl = 'https://tiles.goong.io/assets/'

                map.current = new maplibregl.Map({
                    container: mapContainer.current,
                    style: `${mapUrl}goong_map_web.json?api_key=${mapKey}`,
                    center: [defaultCenter.lon, defaultCenter.lat],
                    zoom: 12
                })

                // Add navigation controls
                map.current.addControl(new maplibregl.NavigationControl())

                // Handle map load event
                map.current.on('load', () => {
                    addMarkers()

                    // Fly to current hotspot if available
                    const hasValidCoords = currentHotspot?.geolocation?.lat && currentHotspot?.geolocation?.lon
                    if (currentHotspot && !initialFlyDone.current && hasValidCoords) {
                        flyToHotspot(currentHotspot)
                        initialFlyDone.current = true
                    }
                })
            } catch (error) {
                console.error('Error initializing map:', error)
            }
        }

        // Small delay to ensure DOM is ready
        const timer = setTimeout(initMap, 100)

        // Cleanup function
        return () => {
            clearTimeout(timer)
            if (map.current) {
                map.current.remove()
                map.current = null
            }
        }
    }, [loading, opened, currentHotspot])

    // Fly to current hotspot when modal opens
    useEffect(() => {
        if (opened && currentHotspot && map.current && map.current.loaded()) {
            if (currentHotspot.geolocation?.lat && currentHotspot.geolocation?.lon) {
                flyToHotspot(currentHotspot)
                setViewingCurrentHotspot(true)
                initialFlyDone.current = true
            }
        }
    }, [opened, currentHotspot])

    // Re-add markers when hotspots change
    useEffect(() => {
        if (map.current && map.current.loaded && map.current.loaded()) {
            addMarkers()
        }
    }, [hotspots, currentHotspot])    // Add markers for hotspots
    // Add markers for hotspots with debugging
    const addMarkers = () => {
        if (!map.current) return;

        // Clear existing markers
        Object.values(markers.current).forEach(marker => {
            if (marker && typeof marker.remove === 'function') {
                marker.remove();
            }
        });
        markers.current = {};

        // Add markers for hotspots with valid coordinates
        hotspots.forEach(hotspot => {
            // Skip hotspots without valid coordinates
            if (!hotspot.geolocation?.lat || !hotspot.geolocation?.lon) return;

            const isCurrentHotspot = currentHotspot && hotspot.id === currentHotspot.id;
            const primaryColor = isCurrentHotspot ? 'emerald' : 'indigo';

            // Create marker element
            const markerEl = document.createElement('div');
            markerEl.className = 'custom-marker';
            markerEl.style.zIndex = isCurrentHotspot ? '10' : '1';

            // Create marker HTML
            markerEl.innerHTML = `
                <div class="marker-container" style="position: relative; display: flex; justify-content: center; width: 50px; height: 50px;">
                    ${isCurrentHotspot ?
                    `<div class="current-location-badge" style="position: absolute; top: -2rem; left: 50%; transform: translateX(-50%); white-space: nowrap; z-index: 5; background: rgba(16, 185, 129, 0.9); color: white; font-size: 11px; padding: 2px 8px; border-radius: 10px; font-weight: 500;">
                        Bạn đang ở đây
                    </div>`
                    : ''
                }
                    <div class="custom-marker-pin ${isCurrentHotspot ? 'current' : ''}">
                        <div class="marker-chevron">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="16" height="16">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                            </svg>
                        </div>
                    </div>
                    ${isCurrentHotspot ? '<div class="custom-marker-pulse"></div>' : ''}
                </div>
            `;

            // Define the popup content
            const popupContent = `
                <div class="map-popup-card p-4 max-w-sm">
                    <div class="mb-2">
                        <h3 class="font-bold text-white text-lg mb-1">
                            ${hotspot.title || 'Không có tiêu đề'}
                        </h3>
                        ${isCurrentHotspot ?
                    `<div class="flex">
                                <span class="current-badge text-emerald-300 text-xs font-medium">
                                    Vị trí hiện tại
                                </span>
                            </div>`
                    : ''
                }
                    </div>
                    
                    ${hotspot.address ?
                    `<div class="flex items-start gap-2 mb-3">
                            <span class="text-red-400 mt-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                </svg>
                            </span>
                            <p class="text-white text-xs">
                                ${hotspot.address}
                            </p>
                        </div>`
                    : ''
                }
                    
                    <div class="flex gap-2 mt-3">
                        <button 
                            class="flex-1 bg-indigo-600/90 hover:bg-indigo-700 text-white px-3 py-2 rounded text-xs font-medium flex items-center justify-center gap-1 transition-all"
                            id="view-panorama-${hotspot.id}"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M8 12s2-2 4-2 4 2 4 2-2 2-4 2-4-2-4-2z"></path>
                            </svg>
                            Xem 360°
                        </button>
                        
                        ${!isCurrentHotspot ?
                    `<button 
                                class="flex-1 bg-emerald-600/90 hover:bg-emerald-700 text-white px-3 py-2 rounded text-xs font-medium flex items-center justify-center gap-1 transition-all"
                                id="set-current-${hotspot.id}"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                                </svg>
                                Đặt làm hiện tại
                            </button>`
                    : ''
                }
                    </div>
                </div>
            `;

            // Create popup
            const popup = new maplibregl.Popup({
                offset: [0, -15],
                closeButton: false,
                className: 'custom-popup map-popup-container'
            }).setHTML(popupContent); // Now popupContent is defined

            try {
                // Create and add marker with proper positioning
                const marker = new maplibregl.Marker({
                    element: markerEl,
                    anchor: 'bottom',
                })
                    .setLngLat([hotspot.geolocation.lon, hotspot.geolocation.lat])
                    .addTo(map.current);

                console.log("Marker added successfully for:", hotspot.id);

                // Store marker reference
                markers.current[hotspot.id] = marker;

                // Set popup on marker - same behavior for all
                marker.setPopup(popup);

                // Standard hover behavior for all markers
                markerEl.addEventListener('mouseenter', () => {
                    marker.togglePopup();
                });

                markerEl.addEventListener('mouseleave', () => {
                    if (marker.getPopup().isOpen()) {
                        marker.togglePopup();
                    }
                });

                // Handle marker click for selection
                markerEl.addEventListener('click', () => {
                    setSelectedHotspot(hotspot);
                    setViewingCurrentHotspot(isCurrentHotspot);
                });

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
        });

        console.log("Total markers created:", Object.keys(markers.current).length);
    };

    // Fix map zoom behavior to prevent markers from clustering
    useEffect(() => {
        if (map.current && map.current.loaded()) {
            map.current.on('zoom', () => {
                // Update marker positions to fix coordinate alignment
                Object.entries(markers.current).forEach(([id, marker]) => {
                    const hotspot = hotspots.find(h => h.id === id);
                    if (hotspot && hotspot.geolocation) {
                        // Force marker to update its position
                        marker.setLngLat([hotspot.geolocation.lon, hotspot.geolocation.lat]);
                    }
                });
            });
        }
    }, [map.current]);

    // Fly to hotspot
    const flyToHotspot = (hotspot) => {
        if (!map.current || !hotspot.geolocation?.lat || !hotspot.geolocation?.lon) return;

        // Update state
        setSelectedHotspot(hotspot);
        const isCurrentHotspot = currentHotspot && hotspot.id === currentHotspot.id;
        setViewingCurrentHotspot(isCurrentHotspot);

        // Animate map to hotspot location
        map.current.flyTo({
            center: [hotspot.geolocation.lon, hotspot.geolocation.lat],
            zoom: 15,
            duration: 1000
        });

        // Do NOT automatically show popup for any hotspot (including current)
        // Let it be shown only on hover
    };

    // Fly to current hotspot
    const flyToCurrentHotspot = () => {
        if (currentHotspot) {
            flyToHotspot(currentHotspot)
            setViewingCurrentHotspot(true)
        }
    }

    // Show panorama 
    const handleShowPanorama = () => {
        if (selectedHotspot?.click_panorama_id && showMedia) {
            showMedia(selectedHotspot.click_panorama_id)
            onClose()
        }
    }

    // Set selected as current
    const handleSetCurrentHotspot = () => {
        if (selectedHotspot) {
            setCurrentHotspot(selectedHotspot)
            setViewingCurrentHotspot(true)
        }
    }

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault()
        const query = searchTitle.toLowerCase().trim()

        // If query is empty, reset results
        if (!query) {
            setHotspots(hotspots)
            return
        }

        // Filter hotspots by title
        const filtered = hotspots.filter(
            hotspot => hotspot.title &&
                hotspot.title.toLowerCase().includes(query)
        )

        setHotspots(filtered)

        // If exactly one result, fly to it
        if (filtered.length === 1 && filtered[0].geolocation) {
            flyToHotspot(filtered[0])
        }
    }

    // Handle search input change
    const handleSearchChange = (e) => {
        const query = e.target.value
        setSearchTitle(query)

        // Handle empty query
        if (!query.trim()) {
            setShowSuggestions(false)
            setFilteredSuggestions([])
            return
        }

        // Filter and limit results to 5
        const filtered = hotspots
            .filter(hotspot =>
                hotspot.title &&
                hotspot.title.toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, 5)

        setFilteredSuggestions(filtered)
        setShowSuggestions(filtered.length > 0)
    }

    // Handle suggestion selection
    const handleSelectSuggestion = (hotspot) => {
        setSearchTitle(hotspot.title)
        setShowSuggestions(false)
        flyToHotspot(hotspot)
    }

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchInputRef.current && !searchInputRef.current.contains(e.target)) {
                setShowSuggestions(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            // Remove all markers
            Object.values(markers.current).forEach(marker => {
                if (marker && typeof marker.remove === 'function') {
                    marker.remove()
                }
            })
            markers.current = {}

            // Remove map
            if (map.current) {
                map.current.remove()
                map.current = null
            }
        }
    }, [])

    // Cleanup when modal closes
    useEffect(() => {
        if (!opened && map.current) {
            map.current.remove()
            map.current = null
        }
    }, [opened])

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            withCloseButton={false}
            size="90%"
            centered
            classNames={{
                content: 'glassmorphism-modal',
                header: 'p-0',
                title: 'hidden',
            }}
            overlayProps={{
                opacity: 0.8,
                blur: 7,
            }}
            transitionProps={{
                transition: 'slide-up',
                duration: 300
            }}
            styles={{
                body: { padding: '0' },
                header: { padding: 0 },
            }}
        >
            {/* Custom header */}
            <div className="custom-modal-header" style={{ position: 'relative', zIndex: 10000 }}>
                <div className="flex items-center gap-2">
                    <span className="text-white  p-2 rounded-full backdrop-blur-md">
                        <FaMapMarkerAlt className="text-white text-lg" />
                    </span>
                    <span className="text-xl font-bold text-white">Bản Đồ Địa Điểm</span>
                </div>

                <form onSubmit={handleSearch} className="flex-1 mx-4 relative" ref={searchInputRef}>
                    <input
                        type="text"
                        value={searchTitle}
                        onChange={handleSearchChange}
                        placeholder="Nhập tên địa điểm để tìm kiếm trên bản đồ..."
                        className="map-search-input w-full px-4 py-2 pr-10 rounded-full 
                                   border border-white/10 text-white placeholder-white/60 
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 
                                   text-white/70 hover:text-white p-1.5 rounded-full
                                   transition-colors"
                    >
                        <FaSearch />
                    </button>

                    {/* Updated search suggestions overlay */}
                    {showSuggestions && filteredSuggestions.length > 0 && (
                        <div
                            className="absolute top-full left-0 right-0 mt-2 
                                    bg-gray-900/95 backdrop-blur-md rounded-lg overflow-hidden
                                    border border-white/20 shadow-lg shadow-black/50"
                            style={{ zIndex: 99999 }}
                        >
                            <div className="max-h-[300px] overflow-y-auto">
                                {filteredSuggestions.map((hotspot) => (
                                    <div
                                        key={hotspot.id}
                                        className="px-4 py-3 cursor-pointer hover:bg-indigo-500/40
                                                transition-colors flex items-center border-b border-gray-800/50 
                                                gap-3"
                                        onClick={() => handleSelectSuggestion(hotspot)}
                                    >
                                        <span className="text-indigo-400 flex-shrink-0">
                                            <FaMapMarkerAlt />
                                        </span>
                                        <div className="overflow-hidden">
                                            <div className="font-medium text-white truncate">
                                                {hotspot.title}
                                            </div>
                                            {hotspot.address && (
                                                <div className="text-xs text-white/70 truncate">
                                                    {hotspot.address}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </form>
                <button onClick={onClose} className="modal-close-button">
                    <FaTimes />
                </button>
            </div>

            {/* Modal content */}
            {loading ? (
                <div className="flex flex-col justify-center items-center h-[60vh] bg-black/50 backdrop-blur-md">
                    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-lg text-white font-medium">Đang tải bản đồ...</p>
                </div>
            ) : (
                <div className="flex flex-col md:flex-row h-[70vh] map-fade-in">
                    <div className="w-full md:w-3/4 h-full relative">
                        {/* Map container */}
                        <div className="h-full w-full rounded-lg overflow-hidden border border-white/20 relative">
                            <div ref={mapContainer} className="h-full w-full" id="map-container"></div>

                            {/* Map controls */}
                            <div className="absolute top-4 right-4 flex flex-col gap-2">
                                <button
                                    className="map-control-button"
                                    title="Xem tất cả điểm"
                                    onClick={() => {
                                        map.current.fitBounds([
                                            [104.5, 8.5],
                                            [109.5, 23.5]
                                        ]);
                                    }}
                                >
                                    <FaCompass className="text-white" />
                                </button>                                {!viewingCurrentHotspot && currentHotspot && (
                                    <button
                                        onClick={flyToCurrentHotspot}
                                        className="map-control-button map-control-button-location"
                                        title="Quay lại vị trí hiện tại"
                                    >
                                        <FaLocationArrow className="text-white text-lg" />
                                    </button>
                                )}

                                <button
                                    className="map-control-button"
                                    title="Phóng to"
                                    onClick={() => map.current.zoomIn()}
                                >
                                    <span className="text-xl text-white font-bold">+</span>
                                </button>

                                <button
                                    className="map-control-button"
                                    title="Thu nhỏ"
                                    onClick={() => map.current.zoomOut()}
                                >
                                    <span className="text-xl text-white font-bold">−</span>
                                </button>
                            </div>                            {/* Map legend */}
                            <div className="absolute bottom-4 left-4 glassmorphism-modal p-3 rounded-lg">
                                <h4 className="font-semibold mb-2 text-sm text-white flex items-center gap-1">
                                    <FaLayerGroup className="text-white/70" />
                                    <span>Chú thích bản đồ</span>
                                </h4>                                <div className="flex items-center gap-1 mb-1 p-1 rounded bg-gray-800/50 hover:bg-gray-700/50 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                                    <span className="text-white/90 text-xs">Điểm tham quan</span>
                                </div>
                                <div className="flex items-center gap-1 p-1 rounded bg-gray-800/50 hover:bg-gray-700/50 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                    <span className="text-white/90 text-xs">Điểm hiện tại</span>
                                </div>

                                {/* Hotspot count */}
                                <div className="mt-2 pt-2 border-t border-white/20 text-white/70 text-xs">
                                    <span>{hotspots.length} địa điểm</span>
                                </div>
                            </div>

                            {/* Map attribution */}
                            <div className="absolute top-4 left-4 glassmorphism-modal px-2 py-1 rounded text-xs text-white/70 flex items-center gap-1">
                                <FaInfoCircle size={12} />
                                <span>MapLibre</span>
                            </div>
                        </div>
                    </div>

                    {/* Details panel */}
                    <div className="w-full md:w-1/4 p-4 border-l border-white/20 overflow-auto backdrop-blur h-full">
                        <div className="glassmorphism-modal p-4 rounded-lg">
                            <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-white">
                                <FaMapMarkerAlt />
                                <span>Thông tin địa điểm</span>
                            </h2>

                            {selectedHotspot ? (
                                <>                                    <div className="bg-black/30 rounded-lg p-4 mb-4">                                        <div className="flex flex-col">
                                    <h3 className="text-xl font-bold text-white mb-1">{selectedHotspot.title}</h3>
                                    {currentHotspot && selectedHotspot.id === currentHotspot.id && (
                                        <div className="flex">
                                            <span className="current-badge text-emerald-300 text-xs font-medium">
                                                Hiện tại
                                            </span>
                                        </div>
                                    )}
                                </div>

                                    <div className="mt-2">
                                        <div className="flex items-start gap-2">
                                            <FaMapMarkerAlt className="text-red-400 mt-1" />
                                            <p className="text-white/80">{selectedHotspot.address || 'Không có địa chỉ'}</p>
                                        </div>
                                    </div>

                                    {selectedHotspot.description && (
                                        <div className="mt-4 bg-black/30 p-3 rounded max-h-40 overflow-y-auto">
                                            <p className="text-white/70 text-sm">
                                                {selectedHotspot.description.substring(0, 300)}
                                                {selectedHotspot.description.length > 300 ? '...' : ''}
                                            </p>
                                        </div>
                                    )}
                                </div>                                    <div className="flex gap-3 mt-4">
                                        <button
                                            onClick={handleShowPanorama}
                                            className="flex-1 px-4 py-3 bg-indigo-500/70 hover:bg-indigo-600/90 
                                                       text-white rounded-lg transition-all duration-200 
                                                       flex items-center justify-center gap-2
                                                       hover:shadow-lg hover:shadow-indigo-900/30 hover:-translate-y-1"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                                fill="none" stroke="currentColor" strokeWidth="2"
                                                strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <path d="M8 12s2-2 4-2 4 2 4 2-2 2-4 2-4-2-4-2z"></path>
                                            </svg>
                                            <span>Xem 360°</span>
                                        </button>

                                        {(!currentHotspot || selectedHotspot.id !== currentHotspot.id) && (
                                            <button
                                                onClick={handleSetCurrentHotspot}
                                                className="flex-1 px-4 py-3 bg-emerald-500/70 hover:bg-emerald-600/90 
                                                           text-white rounded-lg transition-all duration-200 
                                                           flex items-center justify-center gap-2
                                                           hover:shadow-lg hover:shadow-emerald-900/30 hover:-translate-y-1"
                                            >
                                                <FaLocationArrow />
                                                <span>Đặt làm điểm hiện tại</span>
                                            </button>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 bg-black/30 rounded-lg">
                                    <FaMapMarkerAlt className="text-4xl text-white/40 mb-3" />
                                    <p className="text-white/70 text-center">
                                        Chọn một địa điểm trên bản đồ để xem thông tin chi tiết
                                    </p>
                                </div>
                            )}

                            {hotspots.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="text-sm font-medium text-white/50 mb-2">Các địa điểm gần đây</h3>                                    <div className="space-y-2 max-h-36 overflow-y-auto">                                        {hotspots.slice(0, 3).map(hotspot => (<div
                                        key={hotspot.id}
                                        className="p-2 bg-gray-800/50 hover:bg-gray-700/60 hover:translate-x-1 rounded 
                                                           transition-all duration-200 cursor-pointer flex items-center"
                                        onClick={() => flyToHotspot(hotspot)}
                                    >
                                        <div className="w-2 h-2 rounded-full bg-indigo-400 mr-2"></div>
                                        <span className="text-sm truncate text-white/80">{hotspot.title}</span>
                                    </div>
                                    ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between p-3 border-t border-white/10">
                {currentHotspot && !viewingCurrentHotspot && (<button
                    onClick={flyToCurrentHotspot}
                    className="px-4 py-2 bg-gray-700/70 hover:bg-gray-600/80 text-white 
                                   rounded-lg transition-all duration-200 flex items-center gap-2
                                   hover:shadow-lg hover:shadow-gray-900/30 hover:-translate-y-1"
                >
                    <FaLocationArrow />
                    Quay lại vị trí hiện tại
                </button>
                )}
                <div className="ml-auto">
                    <button onClick={onClose}
                        className="px-4 py-2 bg-gray-700/70 hover:bg-gray-600/80 text-white 
                                   rounded-lg transition-all duration-200 flex items-center gap-2
                                   hover:shadow-lg hover:shadow-gray-900/30 hover:-translate-y-1"
                    >
                        <FaTimes />
                        Đóng
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default MapModal