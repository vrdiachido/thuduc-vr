import { Modal, Text } from '@mantine/core';
import ImageCarousel from './ImageCarousel';
import React, { useState } from 'react';
import useHotspotStore from '../store/hotspot.store';
import { FaMapMarkerAlt, FaGlobe, FaExternalLinkAlt, FaFileAlt, FaCalendarAlt, FaTimes } from 'react-icons/fa';

// HotspotCard Component (renamed from UniversityCard)
function HotspotCard({ data }) {
    const [showPDF, setShowPDF] = useState(false);
    const [currentPDF, setCurrentPDF] = useState('');

    const {
        title,
        description,
        preview_image_url,
        address,
        url,
        geolocation,
        metadata
    } = data;

    const handleMapClick = () => {
        if (geolocation) {
            window.open(`https://www.google.com/maps?q=${geolocation.lat},${geolocation.lon}`, '_blank');
        }
    };

    const handleUrlClick = () => {
        if (url) {
            window.open(url, '_blank');
        }
    };

    const handlePDFView = (pdfPath) => {
        setCurrentPDF(pdfPath);
        setShowPDF(true);
    };

    const closePDFViewer = () => {
        setShowPDF(false);
        setCurrentPDF('');
    };

    return (
        <div className="rounded-3xl p-4 md:p-8 shadow-2xl max-h-[80vh] overflow-y-auto custom-scrollbar">
            {/* Header Section */}
            <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                    {title}
                </h1>
                <div className="flex flex-wrap gap-2 md:gap-4 text-blue-200">
                    {address && (
                        <div className="flex items-center gap-2">
                            <FaMapMarkerAlt size={16} className="md:w-[18px] md:h-[18px]" />
                            <span className="text-xs md:text-sm break-all">{address}</span>
                        </div>
                    )}
                    {geolocation && (
                        <div className="flex items-center gap-2">
                            <FaGlobe size={16} className="md:w-[18px] md:h-[18px]" />
                            <span className="text-xs md:text-sm">
                                {geolocation.lat.toFixed(6)}, {geolocation.lon.toFixed(6)}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-8">
                {/* Left Column - Image Gallery */}
                <div className="space-y-4 md:space-y-6 order-2 lg:order-1">
                    {/* Preview Image */}
                    {preview_image_url && (
                        <div className="glass-card rounded-xl md:rounded-2xl overflow-hidden">
                            <img
                                src={preview_image_url}
                                alt="Xem trước"
                                className="w-full h-32 md:h-48 object-cover"
                            />
                            <div className="p-3 md:p-4">
                                <h3 className="text-white font-semibold text-base md:text-lg">Ảnh Xem Trước</h3>
                                <p className="text-blue-200 text-xs md:text-sm">Hình ảnh chính của địa điểm</p>
                            </div>
                        </div>
                    )}

                    {/* Image Carousel */}
                    {metadata?.images && metadata.images.length > 0 && (
                        <div>
                            <h3 className="text-white font-semibold text-base md:text-lg mb-3 md:mb-4 flex items-center gap-2">
                                <FaCalendarAlt size={18} className="md:w-[20px] md:h-[20px]" />
                                Thư Viện Ảnh
                            </h3>
                            <ImageCarousel images={metadata.images} />
                        </div>
                    )}
                </div>

                {/* Right Column - Information */}
                <div className="space-y-4 md:space-y-6 order-1 lg:order-2">
                    {/* Description */}
                    <div className="glass-card rounded-xl md:rounded-2xl p-4 md:p-6">
                        <h3 className="text-white font-semibold text-lg md:text-xl mb-3 md:mb-4">Giới Thiệu</h3>
                        <div className="text-blue-100 leading-relaxed text-xs md:text-sm max-h-48 md:max-h-64 overflow-y-auto custom-scrollbar">
                            {description?.split('\n\n').map((paragraph, index) => (
                                <p key={index} className="mb-3 md:mb-4 last:mb-0">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-2 md:space-y-3">
                        {url && (
                            <button
                                onClick={handleUrlClick}
                                className="glass-button w-full rounded-lg md:rounded-xl p-3 md:p-4 flex items-center gap-2 md:gap-3 text-left"
                            >
                                <FaExternalLinkAlt size={16} className="md:w-[20px] md:h-[20px] flex-shrink-0" />
                                <div className="min-w-0">
                                    <div className="font-semibold text-sm md:text-base">Truy Cập Website</div>
                                    <div className="text-xs md:text-sm text-blue-200">Tìm hiểu thêm trực tuyến</div>
                                </div>
                            </button>
                        )}

                        {geolocation && (
                            <button
                                onClick={handleMapClick}
                                className="glass-button w-full rounded-lg md:rounded-xl p-3 md:p-4 flex items-center gap-2 md:gap-3 text-left"
                            >
                                <FaMapMarkerAlt size={16} className="md:w-[20px] md:h-[20px] flex-shrink-0" />
                                <div className="min-w-0">
                                    <div className="font-semibold text-sm md:text-base">Xem Trên Bản Đồ</div>
                                    <div className="text-xs md:text-sm text-blue-200">Lấy chỉ đường</div>
                                </div>
                            </button>
                        )}

                        {metadata?.document_link && metadata.document_link.length > 0 && (
                            <div className="glass-card rounded-lg md:rounded-xl p-3 md:p-4">
                                <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                                    <FaFileAlt size={16} className="md:w-[20px] md:h-[20px] text-blue-400 flex-shrink-0" />
                                    <div className="font-semibold text-white text-sm md:text-base">Tài Liệu</div>
                                </div>
                                <div className="space-y-2 max-h-32 md:max-h-none overflow-y-auto custom-scrollbar">
                                    {metadata.document_link.map((doc, index) => {
                                        const fileName = doc.split('\\').pop();
                                        const isPDF = fileName.toLowerCase().endsWith('.pdf');

                                        return (
                                            <div key={index} className="glass-button rounded-md md:rounded-lg p-2 md:p-3 cursor-pointer hover:bg-white/10 transition-colors">
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                                        <FaFileAlt size={14} className="md:w-[16px] md:h-[16px] text-blue-400 flex-shrink-0" />
                                                        <span className="text-xs md:text-sm text-white truncate">{fileName}</span>
                                                    </div>
                                                    {isPDF && (
                                                        <button
                                                            onClick={() => handlePDFView(doc)}
                                                            className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-md hover:bg-blue-500/30 transition-colors flex-shrink-0"
                                                        >
                                                            Xem PDF
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const GalleryModal = ({
    galleryModalOpened,
    closeGalleryModal,
}) => {
    const currentHotspot = useHotspotStore(state => state.currentHotspot);

    return (
        <Modal
            withCloseButton={false}
            opened={galleryModalOpened}
            onClose={closeGalleryModal}
            size="95%"
            centered
            classNames={{
                content: 'glassmorphism-modal',
                header: 'glassmorphism-modal-header',
                title: 'text-xl font-bold text-white',
            }}
            overlayProps={{
                opacity: 0.55,
                blur: 3,
            }}
            styles={{
                body: { padding: '0' },
                header: { padding: 0 },
                content: {
                    maxWidth: '90vw',
                    maxHeight: '95vh',
                    width: 'auto',
                    '@media (min-width: 768px)': {
                        maxWidth: '80vw',
                    },
                    '@media (min-width: 1024px)': {
                        maxWidth: '70vw',
                    }
                }
            }}
        >
            <div className="custom-modal-header flex justify-between items-center p-3 md:p-4 border-b border-white/10">
                <Text className="text-lg md:text-2xl font-bold text-white truncate">Chi tiết địa điểm</Text>
                <button
                    onClick={closeGalleryModal}
                    className="glass-button p-2 rounded-full hover:bg-red-500/30 transition-colors flex-shrink-0 ml-2"
                >
                    <FaTimes size={14} className="md:w-[16px] md:h-[16px]" />
                </button>
            </div>
            {currentHotspot && <HotspotCard data={currentHotspot} />}
        </Modal>
    );
};

export default GalleryModal;