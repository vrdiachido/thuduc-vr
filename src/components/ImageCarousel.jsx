import { useCallback, useState } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { FaMapMarkerAlt, FaExternalLinkAlt, FaFileAlt, FaGlobe, FaCalendarAlt } from 'react-icons/fa';

// Simple Image Carousel Component
function ImageCarousel({ images = [] }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    const goToSlide = useCallback((index) => {
        setCurrentIndex(index);
    }, []);

    if (!images.length) {
        return <div className="text-white text-center">Không có hình ảnh</div>;
    }

    return (
        <div className="relative w-full">
            {/* Main Carousel */}
            <div className="overflow-hidden rounded-2xl glass-card" style={{ height: '300px' }}>
                <div
                    className="flex transition-transform duration-500 ease-out h-full"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {images.map((image, index) => (
                        <div key={index} className="w-full h-full flex-shrink-0 relative">
                            <img
                                src={image}
                                alt={`Image ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                        </div>
                    ))}
                </div>

                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevSlide}
                            className="glass-button absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-2"
                        >
                            <MdChevronLeft size={20} />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="glass-button absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2"
                        >
                            <MdChevronRight size={20} />
                        </button>
                    </>
                )}
            </div>

            {/* Dot Indicators */}
            {images.length > 1 && (
                <div className="flex justify-center mt-4 gap-2">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${currentIndex === index
                                ? 'bg-blue-400 scale-125 shadow-lg shadow-blue-400/50'
                                : 'glass-button w-3 h-3 p-0'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default ImageCarousel;
