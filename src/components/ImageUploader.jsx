// filepath: d:\MY_PROJECTS\VR_WEB\frontend\src\components\ImageUploader
import { useState, useRef, useEffect } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { uploadFile, getPublicUrl, createUniqueFilename } from '../services/upload.service';
import { Button, Text, Group, Image, Paper, LoadingOverlay, NumberInput, Box, Alert, CopyButton, Tooltip } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { FiLock, FiUnlock, FiInfo } from 'react-icons/fi';

// Default bucket name if not provided via props
const DEFAULT_BUCKET_NAME = 'images';

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight
        ),
        mediaWidth,
        mediaHeight
    );
}

export default function ImageUploader({ onImageUploaded, aspectRatio = 16 / 9, bucketName = DEFAULT_BUCKET_NAME }) {
    const [imgSrc, setImgSrc] = useState('');
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    const [width, setWidth] = useState(1600);
    const [height, setHeight] = useState(900);
    const [isRatioLocked, setIsRatioLocked] = useState(true);
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);

    // Calculate initial height based on default width and aspect ratio
    useEffect(() => {
        if (isRatioLocked) {
            setHeight(Math.round(width / aspectRatio));
        }
    }, []);

    const handleWidthChange = (value) => {
        setWidth(value);
        if (isRatioLocked && value > 0) {
            setHeight(Math.round(value / aspectRatio));
        }
    };

    const handleHeightChange = (value) => {
        setHeight(value);
        if (isRatioLocked && value > 0) {
            setWidth(Math.round(value * aspectRatio));
        }
    };

    const toggleRatioLock = () => {
        setIsRatioLocked(!isRatioLocked);
    };

    const onSelectFile = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImgSrc(reader.result?.toString() || '');
                setCrop(undefined); // Reset crop
            });
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const onImageLoad = (e) => {
        const { width, height } = e.currentTarget;
        setCrop(centerAspectCrop(width, height, aspectRatio));
    };

    useEffect(() => {
        if (
            completedCrop?.width &&
            completedCrop?.height &&
            imgRef.current &&
            previewCanvasRef.current
        ) {
            // We use canvas to create a preview of the cropped image
            const image = imgRef.current;
            const canvas = previewCanvasRef.current;
            const crop = completedCrop;

            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;
            const ctx = canvas.getContext('2d');

            const pixelRatio = window.devicePixelRatio;

            canvas.width = crop.width * pixelRatio * scaleX;
            canvas.height = crop.height * pixelRatio * scaleY;

            ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
            ctx.imageSmoothingQuality = 'high';

            ctx.drawImage(
                image,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0,
                0,
                crop.width * scaleX,
                crop.height * scaleY
            );
        }
    }, [completedCrop]);

    const handleUpload = async () => {
        if (!completedCrop || !previewCanvasRef.current) {
            notifications.show({
                title: 'Lỗi',
                message: 'Vui lòng cắt ảnh trước khi tải lên',
                color: 'red',
            });
            return;
        }

        try {
            setIsUploading(true);

            // Convert canvas to blob
            const canvas = previewCanvasRef.current;
            const blob = await new Promise((resolve) => {
                canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.95);
            });

            if (!blob) {
                throw new Error('Không thể tạo blob từ hình ảnh');
            }

            // Create a File object from Blob
            const filename = createUniqueFilename('cropped-image.jpg');
            const file = new File([blob], filename, { type: 'image/jpeg' });
            // Upload to Supabase
            const filePath = `uploads/${filename}`;
            const { data, error } = await uploadFile(bucketName, filePath, file);

            if (error) {
                throw error;
            }

            // Get the public URL
            const { data: urlData } = getPublicUrl(bucketName, filePath);

            // Set the uploaded image URL
            setUploadedImageUrl(urlData.publicUrl);

            // Call the callback if provided
            if (onImageUploaded) {
                onImageUploaded(urlData.publicUrl);
            }

            notifications.show({
                title: 'Thành công',
                message: 'Đã tải ảnh lên thành công',
                color: 'green',
            });
        } catch (error) {
            console.error('Upload error:', error);
            notifications.show({
                title: 'Lỗi',
                message: error.message || 'Không thể tải ảnh lên',
                color: 'red',
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Paper p="md" withBorder>
            <LoadingOverlay visible={isUploading} overlayBlur={2} />

            <Group position="center" direction="column" spacing="md">
                <Alert icon={<FiInfo size={16} />} title="Vui lòng lưu ý" color="blue">
                    Để đồng bộ, hãy để tỉ lệ {aspectRatio.toFixed(2)} như hiện tại trong web đang code
                </Alert>

                <Box mb={15} w="100%">
                    <Text weight={500} mb={5}>Kích thước:</Text>
                    <Group spacing="xs">
                        <NumberInput
                            label="Chiều rộng"
                            value={width}
                            onChange={handleWidthChange}
                            min={100}
                            step={10}
                            w="45%"
                        />
                        <Button
                            onClick={toggleRatioLock}
                            variant="outline"
                            style={{ marginTop: 25 }}
                        >
                            {isRatioLocked ? <FiLock size={16} /> : <FiUnlock size={16} />}
                        </Button>
                        <NumberInput
                            label="Chiều cao"
                            value={height}
                            onChange={handleHeightChange}
                            min={100}
                            step={10}
                            w="45%"
                        />
                    </Group>
                </Box>

                <Button component="label" fullWidth>
                    Chọn hình ảnh
                    <input type="file" hidden accept="image/*" onChange={onSelectFile} />
                </Button>

                {imgSrc && (
                    <>
                        <Text weight={500} mb={5} component="label">Cắt hình ảnh:</Text>
                        <Box w="100%">
                            <ReactCrop
                                crop={crop}
                                onChange={(_, percentCrop) => setCrop(percentCrop)}
                                onComplete={(c) => setCompletedCrop(c)}
                                aspect={isRatioLocked ? aspectRatio : undefined}
                            >
                                <img
                                    ref={imgRef}
                                    alt="Cắt hình ảnh"
                                    src={imgSrc}
                                    style={{ maxHeight: '400px' }}
                                    onLoad={onImageLoad}
                                />
                            </ReactCrop>
                        </Box>

                        <canvas
                            ref={previewCanvasRef}
                            style={{ display: 'none' }}
                        />

                        <Button onClick={handleUpload} disabled={!completedCrop} color="blue" fullWidth>
                            Tải lên hình ảnh đã cắt
                        </Button>
                    </>
                )}

                {uploadedImageUrl && (
                    <div style={{ width: '100%' }}>
                        <Text weight={500}>Hình ảnh đã tải lên:</Text>
                        <Image src={uploadedImageUrl} alt="Đã tải lên" style={{ maxWidth: '100%', marginBottom: '10px' }} />

                        <Group position="apart">
                            <Text size="sm" style={{ wordBreak: 'break-all' }}>{uploadedImageUrl}</Text>
                            <CopyButton value={uploadedImageUrl} timeout={2000}>
                                {({ copied, copy }) => (
                                    <Tooltip label={copied ? 'Đã sao chép' : 'Sao chép URL'} withArrow position="top">
                                        <Button color={copied ? 'teal' : 'blue'} onClick={copy}>
                                            {copied ? 'Đã sao chép!' : 'Sao chép URL'}
                                        </Button>
                                    </Tooltip>
                                )}
                            </CopyButton>
                        </Group>
                    </div>
                )}
            </Group>
        </Paper>
    );
}