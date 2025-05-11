import React, { useState, useEffect } from 'react';
import { Modal, Slider, Switch, Button, Group, Text, Divider, Stack, CopyButton, Tooltip } from '@mantine/core';
import { FaVolumeUp, FaVolumeMute, FaShareAlt, FaFacebook, FaTwitter, FaLink } from 'react-icons/fa';
import { notifications } from '@mantine/notifications';

const SettingsModal = ({ opened, onClose, vrHook }) => {
    const [volume, setVolume] = useState(75);
    const [muted, setMuted] = useState(false);
    const handleVolumeChange = (value) => {
        setVolume(value);
        // Control volume in VR scene using vrHook
        if (vrHook && vrHook.sendMessage) {
            vrHook.sendMessage({
                type: 'set_volume',
                value: value / 100
            });
        }
    };

    const handleMuteToggle = () => {
        const newMutedState = !muted;
        setMuted(newMutedState);
        // Mute/unmute VR scene using vrHook
        if (vrHook && vrHook.sendMessage) {
            vrHook.sendMessage({
                type: 'set_mute',
                value: newMutedState
            });
        }
    };

    const shareUrl = window.location.href;

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Shared from VR Web',
                    url: shareUrl
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            // Fallback for browsers that don't support the Web Share API
            navigator.clipboard.writeText(shareUrl);
            notifications.show({
                title: 'Link Copied',
                message: 'URL has been copied to clipboard',
                color: 'blue',
            });
        }
    };

    return (
        <Modal opened={opened} onClose={onClose} title="Cài đặt" centered size="md">
            <Stack spacing="lg">
                {/* Volume Control */}
                <div>
                    <Text weight={500} size="lg" mb={10}>Âm lượng</Text>
                    <Group position="apart" spacing="xl" noWrap mb={10}>
                        <Button
                            variant="subtle"
                            onClick={handleMuteToggle}
                            color={muted ? "gray" : "blue"}
                        >
                            {muted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
                        </Button>
                        <Slider
                            value={muted ? 0 : volume}
                            onChange={handleVolumeChange}
                            size="md"
                            radius="md"
                            color="blue"
                            min={0}
                            max={100}
                            label={(value) => `${value}%`}
                            style={{ flex: 1 }}
                            disabled={muted}
                        />
                    </Group>
                </div>

                <Divider my="sm" />

                {/* Share Options */}
                <div>
                    <Text weight={500} size="lg" mb={10}>Chia sẻ</Text>
                    <Group position="apart" spacing="md">
                        <Button
                            leftIcon={<FaShareAlt />}
                            onClick={handleShare}
                            variant="light"
                            color="blue"
                            fullWidth
                        >
                            Chia sẻ trang web
                        </Button>
                    </Group>

                    <Group position="apart" mt="md" spacing="xs">
                        <Button
                            variant="subtle"
                            color="blue"
                            leftIcon={<FaFacebook />}
                            component="a"
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Facebook
                        </Button>

                        <Button
                            variant="subtle"
                            color="cyan"
                            leftIcon={<FaTwitter />}
                            component="a"
                            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Twitter
                        </Button>

                        <CopyButton value={shareUrl}>
                            {({ copied, copy }) => (
                                <Tooltip label={copied ? 'Đã sao chép' : 'Sao chép liên kết'} withArrow position="bottom">
                                    <Button
                                        variant="subtle"
                                        color={copied ? 'teal' : 'gray'}
                                        leftIcon={<FaLink />}
                                        onClick={copy}
                                    >
                                        {copied ? 'Đã sao chép' : 'Sao chép'}
                                    </Button>
                                </Tooltip>
                            )}
                        </CopyButton>
                    </Group>
                </div>
            </Stack>
        </Modal>
    );
};

export default SettingsModal;