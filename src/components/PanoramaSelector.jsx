import React, { useEffect, useState } from 'react'
import useHotspotStore from '../store/hotspot.store'
import { getPanoramasByHotspotId } from '../services/hotspots.service';

const PanoramaSelector = ({
    showMedia
}) => {
    const [panoramas, setPanoramas] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const currentHotspot = useHotspotStore(state => state.currentHotspot);
    useEffect(() => {
        (async () => {
            if (currentHotspot?.id) {
                const data = await getPanoramasByHotspotId(currentHotspot.id);
                setPanoramas(data || []);
                // Select first panorama by default if any exists
                if (data && data.length > 0) {
                    setSelectedId(data[0].id);
                }
            }
        })();
    }, [currentHotspot]);

    const handlePanoramaClick = (panoramaId) => {
        setSelectedId(panoramaId);
        if (showMedia && typeof showMedia === 'function') {
            showMedia(panoramaId);
        }
    };
    const filteredPanoramas = panoramas.filter(panorama =>
        panorama.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <div className="glass-container rounded-lg p-4 w-full max-w-2xl mx-auto">
            <div className="flex flex-col space-y-4">
                <h3 className="text-xl font-semibold text-white">Chọn Panorama</h3>

                {/* Search Input */}                <div className="relative">
                    <input
                        type="text"
                        placeholder="Tìm kiếm panorama..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="glass w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Panorama List */}
                <div className="max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">                    {filteredPanoramas.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredPanoramas.map((panorama) => (
                            <div
                                key={panorama.id}
                                onClick={() => handlePanoramaClick(panorama.id)}
                                className={`glass-card p-4 transition-all duration-300 ${selectedId === panorama.id
                                        ? 'ring-2 ring-blue-500 scale-[1.02]'
                                        : 'hover:scale-[1.01]'
                                    }`}
                            >
                                <div className="flex flex-col space-y-3">
                                    <div className="w-full h-36 rounded-md overflow-hidden">
                                        <img
                                            src={panorama.preview_image_url}
                                            alt={panorama.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/300x180?text=Không+có+hình';
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-white text-base">{panorama.title}</h4>
                                        <p className="text-xs text-gray-300 mt-1">Mã: {panorama.id.split('_').pop()}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (<div className="text-center py-6 text-gray-400">
                    {panoramas.length === 0 ? 'Không có panorama nào' : 'Không tìm thấy panorama phù hợp'}
                </div>
                )}
                </div>

                {/* Navigation Buttons */}                <div className="flex justify-between pt-4">
                    <button
                        onClick={() => selectedId && showMedia(selectedId)}
                        disabled={!selectedId}
                        className="glass-button px-5 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Xem Panorama
                    </button>

                    <button
                        onClick={() => setSearchTerm('')}
                        className="glass-button px-5 py-2 rounded-lg"
                    >
                        Xóa Tìm Kiếm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PanoramaSelector;