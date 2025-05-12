import React, { useState } from 'react';
import {
    Paper,
    Title,
    Text,
    Box,
    Container,
    Space,
    Button,
    Group,
    CopyButton,
    Tooltip
} from '@mantine/core';
import ImageUploader from '../components/ImageUploader';

const CreateHotspotPage = () => {
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');

    const handleImageUploaded = (imageUrl) => {
        setUploadedImageUrl(imageUrl);
        console.log('Image uploaded successfully:', imageUrl);
    };

    return (
        <Container size="md">
            <Paper p="xl" shadow="md" radius="md">
                <Title order={2} mb="md">Công cụ đăng tải ảnh lên Supabase + Crop</Title>
                <Box>
                    <ImageUploader
                        onImageUploaded={handleImageUploaded}
                        bucketName="vr-images"
                    />
                </Box>

            </Paper>
        </Container>
    );
};

export default CreateHotspotPage;