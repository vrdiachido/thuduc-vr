import React from 'react';
import { Modal } from '@mantine/core';
import { FiMap } from 'react-icons/fi';
import { PiMouseLeftClickFill } from 'react-icons/pi';
import { FaVrCardboard, FaInfoCircle } from 'react-icons/fa';
import { MdTouchApp, MdScreenRotation } from 'react-icons/md';
import { GiKeyboard } from 'react-icons/gi';
import { BsArrowsFullscreen } from 'react-icons/bs';
import { BiRotateRight } from 'react-icons/bi';

const HelpModal = ({ opened, onClose }) => {
    const tutorialItems = [
        {
            icon: <GiKeyboard className='text-4xl text-blue-600' />,
            text: 'Di chuyển bằng các phím WASD hoặc các phím mũi tên trên bàn phím.'
        },
        {
            icon: <PiMouseLeftClickFill className='text-4xl text-blue-500' />,
            text: 'Nhấp chuột trái để tương tác với các điểm quan tâm.'
        },
        {
            icon: <MdTouchApp className='text-4xl text-blue-600' />,
            text: 'Chạm vào màn hình để di chuyển trên thiết bị di động.'
        },
        {
            icon: <FaVrCardboard className='text-4xl text-blue-500' />,
            text: 'Tương thích với kính thực tế ảo để trải nghiệm sống động.'
        },
        {
            icon: <MdScreenRotation className='text-4xl text-blue-600' />,
            text: 'Xoay thiết bị di động để quan sát xung quanh một cách tự nhiên.'
        },
        {
            icon: <BsArrowsFullscreen className='text-4xl text-blue-500' />,
            text: 'Nhấn F11 hoặc nút toàn màn hình để có trải nghiệm tốt nhất.'
        },
        {
            icon: <FaInfoCircle className='text-4xl text-blue-600' />,
            text: 'Nhấp vào biểu tượng thông tin để tìm hiểu thêm về địa điểm.'
        },
        {
            icon: <BiRotateRight className='text-4xl text-blue-500' />,
            text: 'Kéo chuột để xoay góc nhìn 360° của môi trường 3D.'
        }
    ];

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            size="lg"
            centered
            classNames={{
                content: 'glassmorphism-modal',
                header: 'glassmorphism-modal-header'
            }}
            withCloseButton={false}
        >
            <div className="text-blue-900 flex flex-col">
                <div className='py-6 text-center font-bold text-2xl px-6 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-t-xl shadow-lg flex items-center justify-center gap-4 -m-4 mb-4'>
                    <FiMap size={30} />
                    HƯỚNG DẪN THAM QUAN
                </div>
                <div className='p-4 flex-1 overflow-y-auto custom-scrollbar max-h-96'>
                    <div className="flex flex-col gap-4">
                        {tutorialItems.map((item, index) => (
                            <div key={index} className='glass-card p-4 flex items-center gap-4 hover:bg-white/10 transition-all duration-300'>
                                <div className="flex items-center justify-center min-w-[60px]">
                                    {item.icon}
                                </div>
                                <span className='text-white text-lg'>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default HelpModal;
