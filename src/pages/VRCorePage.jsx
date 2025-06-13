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
import VRControl from '../components/VRControl';
import IntroControl from '../components/IntroControl';
import { AiFillMessage } from 'react-icons/ai';

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

    const { currentHotspot, setCurrentHotspot } = useHotspotStore(state => state);

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
            id: 'info', label: 'Trợ lý ảo', icon: AiFillMessage, onClick
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

    const [isStarted, setIsStarted] = useState(false);


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
            <MapModal
                setCurrentHotspot={setCurrentHotspot}
                currentHotspot={currentHotspot}
                showMedia={showMedia}
                opened={mapModalOpened}
                onClose={closeMapModal}

            />

            {
                !isStarted ?

                    <IntroControl
                        onStart={() => {
                            setIsStarted(true);
                            setShowNavbar(true);
                            showMedia(MAP.root.name);
                            getHotspotById(1).then((data) => {
                                setCurrentHotspot(data);
                            }
                            )
                        }}
                    /> : <VRControl
                        openHotspotSearchDrawer={openHotspotSearchDrawer}
                        showNavbar={showNavbar}
                        navButtons={navButtons}
                        showMedia={showMedia}
                    />}

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
