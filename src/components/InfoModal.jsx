import React from 'react'
import useHotspotStore from '../store/hotspot.store'
import { Modal, Image, Text, Title, Badge, Button, Divider, Group, ActionIcon, Tabs } from '@mantine/core'
import { FaMapMarkerAlt, FaLink, FaArrowRight } from 'react-icons/fa'
import { LuMapPinOff } from 'react-icons/lu'

const InfoModal = ({
    opened, onClose, showMedia
}) => {
    const { currentHotspot }
        = useHotspotStore(state => state)

    if (!currentHotspot) {
        return (
            <Modal
                opened={opened}
                onClose={onClose}
                title="Thông tin"
                centered
                size="lg">
                <div className="flex flex-col items-center justify-center py-8">
                    <LuMapPinOff className="text-4xl text-gray-400 mb-3" />
                    <Text size="lg" fw={500} c="dimmed">Không có thông tin</Text>
                </div>
            </Modal>
        )
    }

    const handlePanoramaClick = (panoramaId) => {
        if (showMedia && panoramaId) {
            showMedia(panoramaId);
            onClose();
        }
    }

    return (
        <Modal
            overlayProps={{
                backgroundOpacity: 0.1,
            }}
            opened={opened}
            onClose={onClose}
            title="Thông tin địa điểm"
            centered
            radius={"lg"}
            size="xl">
            <div className="space-y-4">
                {/* Preview Image */}
                <div className="relative rounded-lg overflow-hidden">
                    <Image
                        src={currentHotspot.preview_image_url}
                        alt={currentHotspot.title}
                        height={200}
                        className="w-full object-cover"
                    />

                </div>

                {/* Title */}
                <Title order={2} fw={700} className="text-gray-800">
                    {currentHotspot.title}
                </Title>

                {/* Address */}
                {currentHotspot.address && (
                    <Group align="flex-start" gap="xs">
                        <FaMapMarkerAlt className="text-blue-500 mt-1" />
                        <Text size="sm" className="text-gray-600">
                            {currentHotspot.address}
                        </Text>
                    </Group>
                )}

                {/* Tabs for Description and Panoramas */}
                <Tabs defaultValue="description">
                    <Tabs.List>
                        <Tabs.Tab value="description">Mô tả</Tabs.Tab>
                        <Tabs.Tab value="panoramas">Điểm tham quan ({currentHotspot.panoramas?.length || 0})</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="description" pt="md">
                        <div className="prose max-w-none">
                            <Text size="sm" className="text-gray-700 whitespace-pre-line">
                                {currentHotspot.description}
                            </Text>
                        </div>

                        {currentHotspot.url && (
                            <div className="mt-4">
                                <Divider mb="sm" />
                                <Group justify="space-between">
                                    <Text size="sm" fw={500}>Xem thêm thông tin:</Text>
                                    <Button
                                        component="a"
                                        href={currentHotspot.url}
                                        target="_blank"
                                        variant="light"
                                        color="blue"
                                        rightSection={<FaLink />}
                                        size="sm"
                                    >
                                        Mở liên kết
                                    </Button>
                                </Group>
                            </div>
                        )}
                    </Tabs.Panel>

                    <Tabs.Panel value="panoramas" pt="md">
                        {currentHotspot.panoramas && currentHotspot.panoramas.length > 0 ? (
                            <div className="space-y-3">
                                {currentHotspot.panoramas.map((panorama) => (
                                    <div
                                        key={panorama.id}
                                        className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex gap-3 items-center">
                                            {panorama.preview_image_url ? (
                                                <Image
                                                    src={panorama.preview_image_url}
                                                    width={60}
                                                    height={60}
                                                    radius="md"
                                                    alt={panorama.title}
                                                />
                                            ) : (
                                                <div className="w-[60px] h-[60px] bg-gray-200 rounded-md flex items-center justify-center">
                                                    <FaMapMarkerAlt className="text-gray-400" />
                                                </div>
                                            )}
                                            <Text fw={500}>{panorama.title}</Text>
                                        </div>

                                        <ActionIcon
                                            variant="light"
                                            color="blue"
                                            size={"xl"}
                                            onClick={() => handlePanoramaClick(panorama.id)}
                                            title="Xem điểm này"
                                        >
                                            <FaArrowRight />
                                        </ActionIcon>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <Text c="dimmed" ta="center" py="lg">
                                Không có điểm tham quan nào
                            </Text>
                        )}
                    </Tabs.Panel>
                </Tabs>
            </div>
        </Modal>
    )
}
export default InfoModal