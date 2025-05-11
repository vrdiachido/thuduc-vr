import { Button, TextInput, Box, Group, Text, Loader, Alert, SimpleGrid, Container, Drawer }
    from '@mantine/core'
import { HiSearch } from 'react-icons/hi'
import useHotspotStore from '../store/hotspot.store'
import { useEffect, useCallback, useState, useRef } from 'react'
import HotspotSearchItem from './HotspotSearchItem'
const HotspotSearch = ({ opened, onClose, showMedia }) => {
    const hotspots = useHotspotStore(state => state.hotspots);
    const searchTitle = useHotspotStore(state => state.searchTitle);
    const loading = useHotspotStore(state => state.loading);
    const error = useHotspotStore(state => state.error);

    // Get functions from store
    const setSearchTitle = useHotspotStore(state => state.setSearchTitle);
    const searchHotspots = useHotspotStore(state => state.searchHotspots);
    const clearSearch = useHotspotStore(state => state.clearSearch);
    const fetchHotspots = useHotspotStore(state => state.fetchHotspots);

    const [inputValue, setInputValue] = useState(searchTitle);
    const debounceTimerRef = useRef(null);
    const inputRef = useRef(null);

    const fetchData = useCallback(async () => {
        await fetchHotspots();
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 200);
    }, [fetchHotspots]);

    // Load hotspots when component mounts
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Handle input change with debounce
    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);

        // Clear any existing timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Set new timer to update search after 500ms of no typing
        debounceTimerRef.current = setTimeout(() => {
            setSearchTitle(value);
            if (value.trim() === '') {
                // If cleared, reset to all hotspots
                clearSearch();
            } else {
                searchHotspots(value);
            }
            // Focus the input again after search
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 500);
    };

    // Clean up timer when component unmounts
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);    // Handle Enter key press in the search input
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            // Clear existing timer
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
            // Immediately perform search
            setSearchTitle(inputValue);
            searchHotspots(inputValue);

            // Ensure the input stays focused
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }, 0);
        }
    }

    const handleHotspotClick = (hotspot) => {
        useHotspotStore.getState().setCurrentHotspot(hotspot);
        showMedia(hotspot?.click_panorama_id);
        onClose();
    }

    return (
        <Drawer
            overlayProps={{ backgroundOpacity: 0.1 }}
            position='right'
            title={<>
                <Group mb="md" className='p-4 absolute top-0 left-0 right-0 z-[2]'>
                    <TextInput
                        placeholder="Tìm kiếm địa điểm..."
                        value={inputValue}
                        radius={"xl"}
                        size='md'
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        style={{ flex: 1 }}
                        // disabled={loading}
                        leftSection={
                            <HiSearch />
                        }
                        ref={inputRef}
                        autoFocus
                    />
                </Group>
            </>}
            withCloseButton={false}
            className='z-[1000]' opened={opened} onClose={onClose} >
            <Box p="md" className='relative  h-full w-full'>
                {error && (
                    <Alert color="red" title="Error" mb="md">
                        {error}
                    </Alert>
                )}

                {loading ? (
                    <Box style={{ display: 'flex', justifyContent: 'center', padding: '20px' }} className='h-[60vh] flex items-center justify-center'>
                        <Loader size="md" />
                    </Box>
                ) : (
                    <>
                        {hotspots.length > 0 ? (
                            <Container fluid p={0}>
                                <Text size="sm" mb="md">Đã tìm thấy {hotspots.length} địa điểm</Text>
                                {hotspots.map(hotspot => (
                                    <HotspotSearchItem
                                        key={hotspot.id}
                                        hotspot={hotspot}
                                        onClick={handleHotspotClick}
                                    />
                                ))}
                            </Container>
                        ) : (
                            <Text size="sm">Không tìm thấy địa điểm</Text>
                        )}
                    </>
                )}
            </Box>
        </Drawer >
    )
}

export default HotspotSearch
