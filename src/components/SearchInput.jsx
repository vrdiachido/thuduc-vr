import { TextInput, Group } from '@mantine/core';
import { HiSearch } from 'react-icons/hi';
import { useRef, useEffect } from 'react';
import useHotspotStore from '../store/hotspot.store';

/**
 * SearchInput component for the drawer title
 * This will be sticky by nature when used in the drawer title
 */
const SearchInput = ({ value, onChange, onSearch }) => {
    const inputRef = useRef(null);

    // Focus input when mounted
    useEffect(() => {
        if (inputRef.current) {
            setTimeout(() => {
                inputRef.current.focus();
            }, 100);
        }
    }, []);

    // Handle key press events (for Enter key)
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && onSearch) {
            onSearch(value);
        }
    };

    return (
        <Group style={{ width: '100%' }}>
            <TextInput
                placeholder="Tìm kiếm..."
                value={value}
                onChange={onChange}
                onKeyPress={handleKeyPress}
                style={{ flex: 1 }}
                radius="xl"
                size="md"
                leftSection={<HiSearch />}
                ref={inputRef}
            />
        </Group>
    );
};

export default SearchInput;
