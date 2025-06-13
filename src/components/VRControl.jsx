import { useDisclosure } from '@mantine/hooks';
import { Drawer, Button, Modal, ActionIcon, Popover, Text, MenuDropdown } from '@mantine/core';

import GalleryModal from './GalleryModal';
import HelpModal from './HelpModal';
import { LuMapPinCheck } from "react-icons/lu";
import { IoInformationCircle, IoLocationSharp, IoImages } from "react-icons/io5";

import MAP from '../constants/MAP'

import React, { useState, useEffect, useRef } from 'react'
import { FaHome, FaMap, FaCog, FaInfoCircle, FaSearch, FaMicroblog, FaImage, FaMarker, FaMapMarkedAlt, FaRobot, FaQuestion, FaPhone } from 'react-icons/fa'

import use3DVistaHook from "../hooks/use3DVistaHook";
import HotspotSearch from '../components/HotspotSearch';
import useHotspotStore from '../store/hotspot.store';
import InfoModal from '../components/InfoModal';
import { getHotspotById } from '../services/hotspots.service';
import SettingsModal from '../components/SettingsModal';
import MapModal from '../components/MapModal';
import { HiInformationCircle, HiPhone } from 'react-icons/hi';
import PanoramaSelector from './PanoramaSelector';

const VRControl = (
    {
        showNavbar, openHotspotSearchDrawer,
        navButtons = [],
        showMedia
    }
) => {
    const [galleryModalOpened, { open: openGalleryModal, close: closeGalleryModal }] = useDisclosure(false);
    const [helpModalOpened, { open: openHelpModal, close: closeHelpModal }] = useDisclosure(false);

    return (<div className={`absolute transition-all duration-500 ${showNavbar ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-0'} top-0 left-0 right-0 h-full w-full flex z-[2] pointer-events-none`}>
        {/* Bottom navigation */}
        <div className={`absolute bottom-0 left-0 right-0 mx-auto mb-4 max-w-md pointer-events-auto`}>
            <div className='glass-card rounded-2xl mx-4 p-3 shadow-xl'>
                <div className='flex items-center justify-between gap-2'>
                    {navButtons.map((button) => (<button
                        key={button.id}
                        onClick={() => {
                            button?.onClick()
                        }}
                        className={`glass-button flex flex-col items-center justify-center  flex-1 py-4 px-3 rounded-[1rem] transition-all duration-300 cursor-pointer text-gray-700 shadow-lg ${showNavbar ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <button.icon className="text-2xl mb-2" />
                        <span className="text-sm font-medium">{button.label}</span>
                    </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Left side buttons */}
        <div className='absolute top-1/2 left-0 -translate-y-1/2 ml-4 flex flex-col gap-3 pointer-events-auto'>

            <div className=' relative flex  gap-2'>
                <Popover width={500} offset={10} position="right" withArrow shadow="md">
                    <Popover.Target>
                        <ActionIcon
                            onClick={() => setLocationModalOpen(true)}
                            className="glass-button text-gray-700"
                            size={60}
                            radius={"xl"}
                            title="Danh sách địa điểm"
                        >
                            <IoLocationSharp className="text-2xl" />
                        </ActionIcon>
                    </Popover.Target>
                    <Popover.Dropdown className='glass-card p-4'>
                        <PanoramaSelector showMedia={showMedia} />
                    </Popover.Dropdown>
                </Popover>
            </div>
            <ActionIcon
                onClick={() => openGalleryModal()}
                className="glass-button text-gray-700"
                size={60}
                radius={"xl"}
                title="Thư viện hình ảnh"
            >
                <HiInformationCircle className="text-2xl" />
            </ActionIcon>
        </div>

        {/* Top right buttons */}
        <div className='absolute top-0 right-0 mt-4 mr-4 flex gap-2 pointer-events-auto'>
            <div
                onClick={openHotspotSearchDrawer}
                className='glass-button flex items-center justify-center px-5 py-3 gap-3 rounded-full transition-all duration-300 shadow-lg cursor-pointer'>
                <FaSearch className="text-xl" />
                <span className="text-base font-medium">Tìm kiếm</span>
            </div>

        </div>

        {/* Bottom right buttons */}
        <div className='absolute bottom-0 right-0 mb-4 mr-4 flex flex-col gap-2 pointer-events-auto'>

            <ActionIcon
                onClick={openHelpModal}
                className="glass-button text-gray-700"
                size={60}
                radius={"xl"}
                title="Hướng dẫn tham quan"
            >
                <FaQuestion className="text-2xl" />
            </ActionIcon>
        </div>


        <GalleryModal
            galleryModalOpened={galleryModalOpened}

            closeGalleryModal={() => closeGalleryModal()}
        />

        <HelpModal
            opened={helpModalOpened}
            onClose={closeHelpModal}
        />
    </div>
    )
}

export default VRControl