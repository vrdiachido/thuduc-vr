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
            withBorder
            mb="md"
            className='hover:shadow-lg ease-in-out duration-150 hover:scale-[1.02] cursor-pointer'
            onClick={() => onClick(hotspot)}
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
                            background: 'linear-gradient(45deg, #e1e1e1, #f5f5f5)',
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
                <Text weight={600} size="lg">{hotspot.title}</Text>

            </Group>

            <Text size="sm" color="dimmed" lineClamp={3}>
                {truncateDescription(hotspot.description)}
            </Text>

            <Group mt="md" spacing="xs">
                <HiLocationMarker size={16} />
                <Text size="sm" color="dimmed" style={{ flex: 1 }}>
                    {hotspot.address}
                </Text>
            </Group>

            <Group position="apart" mt="md">
                <Button
                    variant="blue"
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
                        variant="outline"
                        href={hotspot.url}
                        onClick={(e) => {
                            e.stopPropagation();
                            // Open the URL in a new tab
                            window.open(hotspot.url, '_blank');
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
