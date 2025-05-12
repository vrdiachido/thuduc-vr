import { useDisclosure } from '@mantine/hooks';
import { Drawer, Button, Modal, ActionIcon } from '@mantine/core';


import { LuMapPinCheck } from "react-icons/lu";

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
import { HiPhone } from 'react-icons/hi';

const VRCorePage = () => {
    const vrFrameRef = useRef(null);
    const {
        showMedia,
        sendMessage,
        onMessage: registerMessageHandler,
    } = use3DVistaHook({
        ref: vrFrameRef,
    });

    useEffect(() => {
    }, []);
    const [showNavbar, setShowNavbar] = useState(false);
    const [settingModalOpened, { open: openSettingModal, close: closeSettingModal }] = useDisclosure(false);

    const { setCurrentHotspot } = useHotspotStore(state => state);

    useEffect(() => {
        (async () => {
            getHotspotById(1).then((data) => {
                setCurrentHotspot(data);
            }

            )
        })();
        const timer = setTimeout(() => {
            setShowNavbar(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const [hotspotSearchDrawerOpened, { open: openHotspotSearchDrawer, close: closeHotspotSearchDrawer }] = useDisclosure(false);
    const [showInfoModal, { open: openInfoModal, close: closeInfoModal }] = useDisclosure(false);
    const [mapModalOpened, { open: openMapModal, close: closeMapModal }] = useDisclosure(false);


    const navButtons = [
        {
            id: 'home', label: 'Trang chủ', icon: FaHome, onClick: () => {
                showMedia(MAP.root.name);
                getHotspotById(1).then((data) => {
                    setCurrentHotspot(data);
                }
                )
            }
        },
        {
            id: 'info', label: 'Thông tin', icon: FaInfoCircle, onClick
                : () => {
                    openInfoModal()
                }
        },
        {
            id: 'map', label: 'Bản đồ', icon: FaMap, onClick: () => {
                openMapModal()
            }
        },
        {
            id: 'settings', label: 'Cài đặt', icon: FaCog, onClick: () => {
                openSettingModal()
            }
        },
    ];


    return (
        <div className='relative top-0 left-0 w-full h-screen '>
            <SettingsModal
                opened={settingModalOpened}
                onClose={closeSettingModal}
                vrHook={{
                    sendMessage,
                    showMedia
                }}
            />
            <InfoModal
                showMedia={showMedia}
                opened={showInfoModal}
                onClose={closeInfoModal}
            />

            <MapModal
                showMedia={showMedia}
                opened={mapModalOpened}
                onClose={closeMapModal}

            />

            <div className={`absolute  transition-all duration-500 ${showNavbar ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-0'} top-0 left-0 right-0 h-full w-full flex z-[2] pointer-events-none`}>
                <div className={`absolute bottom-0 left-0 right-0 mx-auto mb-4 max-w-md pointer-events-auto`}>
                    <div className='bg-white/90 backdrop-blur-md rounded-2xl mx-4 p-3 border border-gray-50 shadow-xl'>
                        <div className='flex items-center justify-between gap-2'>
                            {navButtons.map((button) => (
                                <button
                                    key={button.id}
                                    onClick={() => {
                                        button?.onClick()
                                    }}
                                    className={`flex flex-col items-center justify-center flex-1 py-3 px-2 rounded-xl transition-all duration-300 cursor-pointer bg-gray-50 text-gray-700 bg-gray-50 hover:bg-blue-500 hover:text-white shadow-md ${showNavbar ? 'opacity-100' : 'opacity-0'}`}
                                >
                                    <button.icon className="text-lg mb-1" />
                                    <span className="text-xs font-medium">{button.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className=' absolute top-0 right-0 mt-4 mr-4 flex gap-2 pointer-events-auto'>
                    <div
                        onClick={openHotspotSearchDrawer}
                        className='flex items-center justify-center px-4 py-2 gap-2 rounded-full bg-gray-50 hover:bg-blue-500 hover:text-white  transition-all duration-300 shadow-md cursor-pointer'>
                        <FaSearch className="text-lg" />
                        <span className="">Tìm kiếm</span>
                    </div>
                    <div className='flex items-center justify-center px-4 py-2 gap-2 rounded-full bg-gray-50 hover:bg-blue-500 hover:text-white   transition-all duration-300 shadow-md cursor-pointer'>
                        <LuMapPinCheck className="text-lg" />
                        <span className="">Checkin</span>
                    </div>
                </div>
                <div className='absolute bottom-0 right-0 mb-4 mr-4 flex flex-col gap-2 pointer-events-auto'>
                    <ActionIcon
                        variant='white'
                        size={"xl"}
                        radius={"xl"}
                    >
                        <FaPhone className="text-lg" />
                    </ActionIcon>
                    <ActionIcon
                        variant='white'
                        size={"xl"}
                        radius={"xl"}
                    >
                        <FaQuestion className="text-lg" />
                    </ActionIcon>
                </div>
            </div>


            <div className='h-full w-full absolute top-0 left-0 z-[0]'>
                <iframe
                    ref={vrFrameRef}
                    id='vr_core'
                    className='w-full h-full'
                    src="/vr_core/index.htm">
                </iframe>
            </div>

            <HotspotSearch
                showMedia={showMedia}
                opened={hotspotSearchDrawerOpened} onClose={closeHotspotSearchDrawer}
            />

        </div>
    )
}

export default VRCorePage
