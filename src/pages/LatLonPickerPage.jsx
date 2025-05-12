import React, { useState, useEffect, useRef } from 'react';
import { Tooltip, CopyButton, Paper, Text } from '@mantine/core';
import { FiCopy, FiCheck, FiCornerLeftDown } from 'react-icons/fi';
import { HiLocationMarker, HiMap, HiOutlineCursorClick, HiSearch } from "react-icons/hi";
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const LatLonPickerPage = () => {
    const [coordinates, setCoordinates] = useState({ lat: 21.029579719995272, lon: 105.85242472181584 });
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    const mapContainer = useRef(null);
    const map = useRef(null);
    const marker = useRef(null);
    const markerElementRef = useRef(null);
    const previousRotationRef = useRef(0);
    const totalRotationRef = useRef(0);
    const [currentHeading, setCurrentHeading] = useState(0);

    useEffect(() => {
        // Initialize MapLibre
        const mapKey = import.meta.env.VITE_GOONG_MAP_TILES_KEY;
        const mapUrl = 'https://tiles.goong.io/assets/';

        if (map.current) return; // Initialize map only once

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: `${mapUrl}goong_map_web.json?api_key=${mapKey}`,
            center: [coordinates.lon, coordinates.lat],
            zoom: 14
        });

        map.current.addControl(new maplibregl.NavigationControl());

        // Create custom marker element
        const markerEl = document.createElement("div");
        markerEl.className = "w-8 h-8 relative";
        markerEl.innerHTML = `
            <div class="absolute inset-0 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4285F4" class="w-8 h-8">
                    <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                </svg>
            </div>
        `;
        markerElementRef.current = markerEl;

        // Add marker
        marker.current = new maplibregl.Marker({
            element: markerEl,
            draggable: true
        })
            .setLngLat([coordinates.lon, coordinates.lat])
            .addTo(map.current);

        // Update coordinates when marker is dragged
        marker.current.on('dragend', () => {
            const lngLat = marker.current.getLngLat();
            setCoordinates({ lat: lngLat.lat, lon: lngLat.lng });
        });

        // Add click handler to map
        map.current.on('click', (e) => {
            marker.current.setLngLat([e.lngLat.lng, e.lngLat.lat]);
            setCoordinates({ lat: e.lngLat.lat, lon: e.lngLat.lng });
        });

        return () => {
            map.current.remove();
        };
    }, []);

    // Function to fetch places autocomplete
    const fetchDataAutoComplete = async (query) => {
        if (query.length < 2) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        const apiKey = import.meta.env.VITE_GOONG_MAP_API_KEY;
        const apiUrl = 'https://rsapi.goong.io';
        const apiLink = `${apiUrl}/Place/AutoComplete?api_key=${apiKey}&input=${encodeURIComponent(query)}`;

        try {
            const response = await fetch(apiLink);
            const data = await response.json();

            if (data.predictions) {
                setSearchResults(data.predictions);
                setShowResults(true);
            } else {
                setSearchResults([]);
                setShowResults(false);
            }
        } catch (error) {
            console.error('Error fetching places:', error);
            setSearchResults([]);
            setShowResults(false);
        }
    };

    // Function to fetch place details by ID
    const fetchPlaceDetails = async (placeId) => {
        const apiKey = import.meta.env.VITE_GOONG_MAP_API_KEY;
        const apiUrl = 'https://rsapi.goong.io';
        const apiLink = `${apiUrl}/Place/Detail?api_key=${apiKey}&place_id=${placeId}`;

        try {
            const response = await fetch(apiLink);
            const data = await response.json();

            if (data.result && data.result.geometry) {
                const { location } = data.result.geometry;
                const newCoords = { lat: location.lat, lon: location.lng };

                // Update marker and coordinates
                setCoordinates(newCoords);
                if (marker.current) {
                    marker.current.setLngLat([newCoords.lon, newCoords.lat]);
                }

                // Center map on the selected location
                if (map.current) {
                    map.current.flyTo({
                        center: [newCoords.lon, newCoords.lat],
                        zoom: 14,
                        duration: 1000
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching place details:', error);
        }
    };

    // Handle input change
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        fetchDataAutoComplete(query);
    };

    // Handle place selection
    const handlePlaceSelect = (place) => {
        setSearchQuery(place.description);
        fetchPlaceDetails(place.place_id);
        setShowResults(false);
    };

    const formatCoordinates = () => {
        return JSON.stringify(coordinates, null, 2);
    };

    const centerOnLocation = () => {
        if (map.current) {
            map.current.flyTo({
                center: [coordinates.lon, coordinates.lat],
                zoom: 14,
                duration: 1000
            });
        }
    };

    // Close search results if clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showResults && !event.target.closest('.search-container')) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showResults]);

    return (
        <div className="flex flex-col p-4 h-screen">
            <h1 className="text-2xl font-bold mb-4">Chọn Vị Trí Vĩ Độ & Kinh Độ</h1>

            <div className="flex flex-col md:flex-row gap-4 h-full">
                {/* Map Container */}
                <div className="flex-grow h-[50vh] md:h-auto relative border rounded-lg overflow-hidden">
                    {/* Search Box */}
                    <div className="absolute top-4 left-4 z-10 search-container">
                        <div className="flex items-center bg-white rounded-md shadow-md">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="Tìm kiếm địa điểm"
                                className="p-2 px-3 w-64 md:w-80 rounded-l-md focus:outline-none"
                            />
                            <div className="bg-white p-2 rounded-r-md flex items-center justify-center">
                                <HiSearch className="text-gray-600 w-5 h-5" />
                            </div>
                        </div>

                        {/* Search Results */}
                        {showResults && searchResults.length > 0 && (
                            <div className="absolute top-full left-0 mt-1 w-full bg-white shadow-lg rounded-md overflow-hidden z-50">
                                {searchResults.map((result, index) => (
                                    <div
                                        key={index}
                                        className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                                        onClick={() => handlePlaceSelect(result)}
                                    >
                                        {result.description}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div ref={mapContainer} className="h-full w-full" />

                    {/* Center on location button */}
                    <button
                        onClick={centerOnLocation}
                        className="absolute right-4 bottom-4 p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 center-location-button"
                        aria-label="Căn giữa vào vị trí đã chọn"
                    >
                        <HiLocationMarker className="text-blue-600 w-5 h-5" />
                    </button>
                </div>

                {/* Coordinates Display */}
                <Paper shadow="sm" p="md" className="w-full md:w-80 bg-white border rounded-lg">
                    <div className="flex items-center mb-4">
                        <HiLocationMarker className="text-blue-500 mr-2" size={20} />
                        <Text fw={600} size="lg">Tọa Độ Đã Chọn</Text>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Vĩ Độ</label>
                            <input
                                type="number"
                                value={coordinates.lat}
                                onChange={(e) => {
                                    const newLat = parseFloat(e.target.value);
                                    setCoordinates(prev => ({ ...prev, lat: newLat }));
                                    if (marker.current && !isNaN(newLat)) {
                                        marker.current.setLngLat([coordinates.lon, newLat]);
                                    }
                                }}
                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kinh Độ</label>
                            <input
                                type="number"
                                value={coordinates.lon}
                                onChange={(e) => {
                                    const newLon = parseFloat(e.target.value);
                                    setCoordinates(prev => ({ ...prev, lon: newLon }));
                                    if (marker.current && !isNaN(newLon)) {
                                        marker.current.setLngLat([newLon, coordinates.lat]);
                                    }
                                }}
                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="p-3 bg-gray-100 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">Định Dạng JSON</span>
                                <CopyButton value={formatCoordinates()} timeout={2000}>
                                    {({ copied, copy }) => (
                                        <Tooltip label={copied ? 'Đã sao chép!' : 'Sao chép vào bộ nhớ'} withArrow position="top">
                                            <button
                                                onClick={copy}
                                                className="p-1 rounded hover:bg-gray-200 transition-colors"
                                            >
                                                {copied ? (
                                                    <FiCheck className="text-green-500" size={16} />
                                                ) : (
                                                    <FiCopy className="text-gray-500" size={16} />
                                                )}
                                            </button>
                                        </Tooltip>
                                    )}
                                </CopyButton>
                            </div>
                            <pre className="text-xs bg-gray-800 text-white p-2 rounded overflow-auto">
                                {formatCoordinates()}
                            </pre>
                        </div>

                        <div className="mt-4">
                            <button
                                onClick={centerOnLocation}
                                className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
                            >
                                <FiCornerLeftDown className="mr-2" size={16} />
                                Căn Giữa Bản Đồ Theo Tọa Độ
                            </button>
                        </div>
                    </div>
                </Paper>
            </div>

            <style jsx>{`
                .center-location-button {
                    transform-origin: center;
                    transition: all 0.2s ease;
                }
                .center-location-button:active {
                    transform: scale(0.95);
                }
            `}</style>
        </div>
    );
};

export default LatLonPickerPage;