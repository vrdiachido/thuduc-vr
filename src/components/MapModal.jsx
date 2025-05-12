import { Modal } from '@mantine/core'
import React from 'react'

const MapModal = ({
    opened, onClose, showMedia
}) => {
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Bản đồ"
            centered

            size="lg"
            overlayProps={{
                backgroundOpacity: 0.1,
            }}
        >
            <div className="flex flex-col items-center justify-center py-8">
                <img
                    src="/images/map.png"
                    alt="Map"
                    className="w-full h-auto rounded-lg shadow-lg"
                />
            </div>
            <div className="flex flex-col items-center justify-center py-8">
                <h2 className="text-lg font-semibold">Bản đồ địa điểm</h2>
                <p className="text-gray-500">Địa chỉ: 123 Đường ABC, Thành phố XYZ</p>
                <p className="text-gray-500">Điện thoại: (123) 456-7890</p>
                <p className="text-gray-500">Email:

                </p>
                <p className="text-gray-500">Website: <a href="https://example.com" className="text-blue-500 hover:underline">example.com</a></p>
                <p className="text-gray-500">Giờ mở cửa: 9:00 AM - 5:00 PM</p>
                <p className="text-gray-500">Mô tả: Đây là một mô tả ngắn về địa điểm.</p>
            </div>
            <div className="flex justify-end">
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                >
                    Đóng
                </button>
            </div>
        </Modal>
    )
}

export default MapModal