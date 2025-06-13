import { Button, useMantineTheme } from '@mantine/core'
import React from 'react'
import LOGO from '../assets/LOGO.png'
import START_BG from '../assets/START.jpg'
import { useMediaQuery } from '@mantine/hooks'
import { AiOutlineArrowRight } from 'react-icons/ai'
import { FiMap } from 'react-icons/fi'
import { PiMouseLeftClickFill } from 'react-icons/pi'
import { LuSquareMousePointer } from 'react-icons/lu'
import { FaMapMarkedAlt, FaRegBuilding, FaVrCardboard, FaInfoCircle } from 'react-icons/fa'
import { BiRotateRight } from 'react-icons/bi'
import { MdTouchApp, MdScreenRotation } from 'react-icons/md'
import { GiKeyboard, GiLockedChest } from 'react-icons/gi'
import { BsArrowsFullscreen } from 'react-icons/bs'

const IntroControl = ({ onStart }) => {
    const theme = useMantineTheme()
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)
    const isTablet = useMediaQuery(`(max-width: ${theme.breakpoints.md})`)

    const tutorialItems = [
        {
            icon: <GiKeyboard className='text-4xl text-blue-400' />,
            text: 'Di chuyển bằng các phím WASD hoặc các phím mũi tên trên bàn phím.'
        },
        {
            icon: <PiMouseLeftClickFill className='text-4xl text-blue-300' />,
            text: 'Nhấp chuột trái để tương tác với các điểm quan tâm.'
        },
        {
            icon: <MdTouchApp className='text-4xl text-blue-400' />,
            text: 'Chạm vào màn hình để di chuyển trên thiết bị di động.'
        },
        {
            icon: <FaVrCardboard className='text-4xl text-blue-300' />,
            text: 'Tương thích với kính thực tế ảo để trải nghiệm sống động.'
        },
        {
            icon: <MdScreenRotation className='text-4xl text-blue-400' />,
            text: 'Xoay thiết bị di động để quan sát xung quanh một cách tự nhiên.'
        },
        {
            icon: <BsArrowsFullscreen className='text-4xl text-blue-300' />,
            text: 'Nhấn F11 hoặc nút toàn màn hình để có trải nghiệm tốt nhất.'
        },
        {
            icon: <FaInfoCircle className='text-4xl text-blue-400' />,
            text: 'Nhấp vào biểu tượng thông tin để tìm hiểu thêm về địa điểm.'
        },
        {
            icon: <BiRotateRight className='text-4xl text-blue-300' />,
            text: 'Kéo chuột để xoay góc nhìn 360° của môi trường 3D.'
        }
    ]

    return (
        <div className='z-[2] absolute w-full h-screen bg-transparent'>
            <img
                src={START_BG}
                className='z-[-2] w-full h-full object-cover absolute top-0 left-0'
                alt="Background"
            />
            <div className='absolute top-0 z-[-1] left-0 w-full h-full bg-black/40 backdrop-blur-sm' />

            <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} justify-center items-center h-full ${isMobile ? 'gap-6 p-4' : isTablet ? 'gap-8 p-6' : 'gap-16 p-8'}`}>
                {/* Left side - Logo and controls */}
                <div className={`glass-intro-container p-8 max-w-md w-full ${!isMobile ? (isTablet ? 'h-[50vh]' : 'h-[60vh]') : ''} flex flex-col justify-center`}>
                    <div className="flex justify-center w-full mb-8">
                        <img src={LOGO} className="h-auto max-h-32 md:max-h-40 w-auto object-contain drop-shadow-lg" alt="Logo" />
                    </div>

                    {/* Stats cards */}
                    <div className="grid grid-cols-2 gap-4 mb-8 w-full">
                        <div className="glass-intro-card p-6 flex flex-col items-center text-center gap-3">
                            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full border border-blue-400/30">
                                <FaRegBuilding size={28} className="text-blue-300" />
                            </div>
                            <div>
                                <p className="text-4xl font-bold text-white mb-1">9</p>
                                <p className="text-sm font-medium text-gray-300">Phân khu</p>
                            </div>
                        </div>
                        <div className="glass-intro-card p-6 flex flex-col items-center text-center gap-3">
                            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full border border-blue-400/30">
                                <FaMapMarkedAlt size={28} className="text-blue-300" />
                            </div>
                            <div>
                                <p className="text-4xl font-bold text-white mb-1">25</p>
                                <p className="text-sm font-medium text-gray-300">Địa chỉ đỏ</p>
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col gap-3 w-full">
                        <Button
                            size="lg"
                            radius="xl"
                            rightIcon={<AiOutlineArrowRight />}
                            onClick={onStart}
                            className="glass-intro-button glass-intro-button-primary w-full font-semibold"
                        >
                            BẮT ĐẦU
                        </Button>
                    </div>
                </div>

                {/* Right side - Tutorial (hidden on mobile) */}
                {!isMobile && (
                    <div className={`glass-intro-tutorial ${isTablet ? 'h-[50vh] w-[50vh]' : 'h-[60vh] w-[60vh]'} max-w-[600px] relative flex flex-col`}>
                        <div className='glass-intro-header py-6 text-center font-bold text-2xl md:text-3xl px-6 text-white rounded-t-3xl shadow-lg flex items-center justify-center gap-4'>
                            <FiMap size={30} className="text-white" />
                            HƯỚNG DẪN THAM QUAN
                        </div>
                        <div className='p-6 flex-1 overflow-y-auto custom-scrollbar'>
                            <div className="flex flex-col gap-3">
                                {tutorialItems.map((item, index) => (
                                    <div key={index} className='glass-intro-item p-4 flex items-center gap-4'>
                                        <div className="flex items-center justify-center min-w-[50px] p-2 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg border border-blue-400/20">
                                            {item.icon}
                                        </div>
                                        <span className='text-gray-200 text-base leading-relaxed'>{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default IntroControl