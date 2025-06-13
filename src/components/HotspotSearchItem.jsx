import { Card, Image, Text, Badge, Button, Group, Box, Anchor } from '@mantine/core';
import { HiLocationMarker, HiExternalLink, HiArrowRight } from 'react-icons/hi';

/**
 * HotspotSearchItem component for displaying individual hotspot search results
 * 
 * @param {Object} props
 * @param {Object} props.hotspot - The hotspot data object
 * @param {Function} props.onClick - Handler for when the item is clicked
 */
const HotspotSearchItem = ({ hotspot, onClick }) => {
    // Truncate description for preview
    const truncateDescription = (text, maxLength = 150) => {
        if (!text) return '';
        return text.length > maxLength
            ? text.substring(0, maxLength) + '...'
            : text;
    };

    return (
        <Card
            shadow="sm"
            padding="lg"
            radius="md"
            mb="md"
            className='glass-card hover:shadow-lg ease-in-out duration-200 hover:scale-[1.02] cursor-pointer'
            onClick={() => onClick(hotspot)}
            styles={{
                root: {
                    backgroundColor: 'rgba(55, 55, 65, 0.75)',
                    backdropFilter: 'blur(16px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
                    color: '#ffffff'
                }
            }}
        >
            <Card.Section>
                {hotspot.preview_image_url ? (
                    <Image
                        src={hotspot.preview_image_url}
                        height={160}
                        alt={hotspot.title}
                    />
                ) : (
                    <Box
                        style={{
                            height: 160,
                            background: 'linear-gradient(45deg, #2a2a3c, #3a3a4c)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Text color="dimmed">Không có ảnh xem trước</Text>
                    </Box>
                )}
            </Card.Section>

            <Group position="apart" mt="md" mb="xs">
                <Text weight={600} size="lg" className="text-white">{hotspot.title}</Text>

            </Group>

            <Text size="sm" color="rgba(255, 255, 255, 0.8)" lineClamp={3}>
                {truncateDescription(hotspot.description)}
            </Text>

            <Group mt="md" spacing="xs">
                <HiLocationMarker size={16} className="text-blue-300" />
                <Text size="sm" color="rgba(255, 255, 255, 0.7)" style={{ flex: 1 }}>
                    {hotspot.address}
                </Text>
            </Group>

            <Group position="apart" mt="md">
                <Button
                    className="glass-button"
                    variant="filled"
                    color="blue"
                    compact
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick(hotspot);
                    }}
                    rightSection={
                        <HiArrowRight size={16} />
                    }
                >
                    Đi đến
                </Button>
                {hotspot.url && (
                    <Button
                        className="glass-button"
                        variant="outline"
                        color="gray"
                        onClick={(e) => {
                            e.stopPropagation();
                            // Open the URL in a new tab
                            window.open(hotspot.url, '_blank');
                        }}
                        styles={{
                            root: {
                                border: '1px solid rgba(255, 255, 255, 0.15)'
                            }
                        }}
                    >
                        <Group spacing="xs">
                            <Text size="sm">Thông tin thêm</Text>
                            <HiExternalLink size={16} />
                        </Group>
                    </Button>
                )}
            </Group>
        </Card>
    );
};

export default HotspotSearchItem;
