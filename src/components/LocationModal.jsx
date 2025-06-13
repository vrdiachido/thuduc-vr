import React, { useState, useEffect } from 'react';
import { Modal, Tabs, Text, ScrollArea, Box, Group, Badge } from '@mantine/core';
import { IoLocationSharp, IoArrowForward, IoImageOutline, IoDocumentTextOutline } from 'react-icons/io5';
import { FaExternalLinkAlt } from 'react-icons/fa';
import useHotspotStore from '../store/hotspot.store';
import { getAllHotspots } from '../services/hotspots.service';

const LocationModal = ({ opened, onClose, showMedia }) => {
    const [panoramas, setPanoramas] = useState([]);
    const [activeTab, setActiveTab] = useState('info');
    const [allHotspots, setAllHotspots] = useState([]);
    const { currentHotspot, setCurrentHotspot } = useHotspotStore(state => state);
    const [loading, setLoading] = useState(true);

    // Fetch all hotspots to get panoramas data
    useEffect(() => {
        const fetchHotspots = async () => {
            setLoading(true);
            try {
                const data = await getAllHotspots();
                setAllHotspots(data);
            } catch (error) {
                console.error("Error fetching hotspots:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHotspots();
    }, []);

    // Update panoramas when current hotspot changes
    useEffect(() => {
        if (currentHotspot && allHotspots.length > 0) {
            // Find all panoramas for the current hotspot
            const panoramasForHotspot = Object.values(allHotspots)
                .flatMap(hotspot => {
                    if (hotspot.id === currentHotspot.id) {
                        // Find all panoramas with this hotspot_id
                        return Object.values(hotspot.panoramas || {});
                    }
                    return [];
                })
                .filter(Boolean); // Remove undefined/null values

            setPanoramas(panoramasForHotspot);
        }
    }, [currentHotspot, allHotspots]);

    const handlePanoramaClick = (panoramaId) => {
        showMedia(panoramaId);
        onClose();
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={
                <div className="flex items-center gap-2 text-xl font-bold">
                    <IoLocationSharp className="text-indigo-400" />
                    <span>Địa điểm tham quan</span>
                </div>
            }
            centered
            size="xl"
            classNames={{
                content: 'glassmorphism-modal',
                header: 'glassmorphism-modal-header',
                title: 'text-xl font-bold text-white',
            }}
            overlayProps={{
                opacity: 0.7,
                blur: 5,
            }}
        >
            <Tabs
                value={activeTab}
                onChange={setActiveTab}
                variant="pills"
                classNames={{
                    tabsList: 'border-b border-gray-700/30 flex flex-wrap px-4',
                    tab: 'text-white/70 hover:bg-white/10 data-[active]:bg-indigo-500 data-[active]:text-white px-4 py-2 rounded-t-lg transition-all',
                }}
            >
                <Tabs.List>
                    <Tabs.Tab value="info" className="font-medium">Thông tin</Tabs.Tab>
                    <Tabs.Tab value="panoramas" className="font-medium">Các điểm tham quan</Tabs.Tab>
                    <Tabs.Tab value="gallery" className="font-medium">Hình ảnh</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="info" pt="md">
                    <div className="p-4 overflow-y-auto">
                        {currentHotspot ? (
                            <>
                                <h2 className="text-2xl font-bold text-white mb-3">{currentHotspot.title}</h2>

                                {currentHotspot.description && (
                                    <div className="mb-4 bg-black/20 p-4 rounded-lg">
                                        <p className="text-white/80 whitespace-pre-line">
                                            {currentHotspot.description}
                                        </p>
                                    </div>
                                )}

                                <div className="flex flex-col gap-4">
                                    {currentHotspot.address && (
                                        <div className="flex items-start gap-2">
                                            <IoLocationSharp className="text-indigo-400 text-xl mt-1 flex-shrink-0" />
                                            <Text className="text-white/90">{currentHotspot.address}</Text>
                                        </div>
                                    )}

                                    {currentHotspot.url && (
                                        <a
                                            href={currentHotspot.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                                        >
                                            <FaExternalLinkAlt />
                                            <span>Tìm hiểu thêm</span>
                                        </a>
                                    )}
                                </div>
                            </>
                        ) : (
                            <Text className="text-center text-white/50 italic py-10">
                                Không có thông tin về địa điểm
                            </Text>
                        )}
                    </div>
                </Tabs.Panel>

                <Tabs.Panel value="panoramas" pt="md">
                    <ScrollArea h={400} className="p-4">
                        {panoramas.length > 0 ? (
                            <div className="space-y-3">
                                {panoramas.map(panorama => (
                                    <Box
                                        key={panorama.id}
                                        className="bg-gradient-to-r from-gray-800/30 to-indigo-900/20 rounded-lg p-4 border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer hover:shadow-lg hover:shadow-indigo-500/10 hover:translate-x-1"
                                        onClick={() => handlePanoramaClick(panorama.id)}
                                    >
                                        <Group spacing="md">
                                            {panorama.preview_image_url && (
                                                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={panorama.preview_image_url}
                                                        alt={panorama.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex-grow">
                                                <Group position="apart">
                                                    <Text className="font-bold text-lg text-white">{panorama.title}</Text>
                                                    <IoArrowForward className="text-indigo-400" />
                                                </Group>
                                                <Text className="text-white/50 text-sm mt-1">
                                                    ID: {panorama.id}
                                                </Text>
                                            </div>
                                        </Group>
                                    </Box>
                                ))}
                            </div>
                        ) : (
                            <Text className="text-center text-white/50 italic py-10">
                                Không có điểm tham quan cho địa điểm này
                            </Text>
                        )}
                    </ScrollArea>
                </Tabs.Panel>

                <Tabs.Panel value="gallery" pt="md">
                    <ScrollArea h={400} className="p-4">
                        {currentHotspot && currentHotspot.metadata?.images?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">                                {currentHotspot.metadata.images.map((image, index) => (
                                <div
                                    key={index}
                                    className="aspect-video bg-gray-900/40 rounded-lg overflow-hidden group relative"
                                >
                                    <img
                                        src={image.includes('http') ? image : image}
                                        alt={`Image ${index + 1}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Text className="text-white text-sm">
                                            {image.split('/').pop() || `Image ${index + 1}`}
                                        </Text>
                                    </div>
                                </div>
                            ))}
                            </div>
                        ) : (
                            <Text className="text-center text-white/50 italic py-10">
                                <Group position="center" spacing="xs">
                                    <IoImageOutline size={20} />
                                    <span>Không có hình ảnh cho địa điểm này</span>
                                </Group>
                            </Text>
                        )}

                        {currentHotspot && currentHotspot.metadata?.document_link?.length > 0 && (
                            <div className="mt-6 border-t border-white/10 pt-4">
                                <Text className="text-white font-medium mb-2 flex items-center gap-2">
                                    <IoDocumentTextOutline />
                                    Tài liệu
                                </Text>
                                <div className="space-y-2">                                    {currentHotspot.metadata.document_link.map((doc, index) => (
                                    <a
                                        key={index}
                                        href={doc.includes('http') ? doc : doc}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors p-2 bg-black/20 rounded-lg"
                                    >
                                        <IoDocumentTextOutline />
                                        <span>{doc.split('/').pop() || `Document ${index + 1}`}</span>
                                    </a>
                                ))}
                                </div>
                            </div>
                        )}
                    </ScrollArea>
                </Tabs.Panel>
            </Tabs>
        </Modal>
    );
};

export default LocationModal;
