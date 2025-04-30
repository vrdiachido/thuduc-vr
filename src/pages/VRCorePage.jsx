import { Button, TextInput } from '@mantine/core'
import React, { useState, useEffect, useRef } from 'react'
import { FaHome, FaMap, FaCog, FaInfoCircle, FaSearch } from 'react-icons/fa'

const VRCorePage = () => {
    const vrFrameRef = useRef(null);
    // useEffect(() => {
    //     const handleMessage = (event) => {
    //         // Validate message source for security
    //         if (vrFrameRef.current && event.source !== vrFrameRef.current.contentWindow) return;

    //         console.log('Received message from iframe:', event.data);

    //         // Handle specific message type
    //         if (event.data.type === 'VR_UPDATE') {
    //             setVrData(event.data.payload);
    //             console.log('VR data updated:', event.data.payload);
    //         }
    //     };

    //     window.addEventListener('message', handleMessage);

    //     // Set up interval to send heartbeat to iframe
    //     // const intervalId = setInterval(() => {
    //     //     if (vrFrameRef.current && vrFrameRef.current.contentWindow) {
    //     //         vrFrameRef.current.contentWindow.postMessage({
    //     //             type: 'PARENT_HEARTBEAT',
    //     //             timestamp: Date.now()
    //     //         }, '*');
    //     //     }
    //     // }, 5000);

    //     // Clean up event listener and interval when component unmounts
    //     return () => {
    //         window.removeEventListener('message', handleMessage);
    //         clearInterval(intervalId);
    //     };
    // }, []);

    return (
        <div className='relative top-0 left-0 w-full h-screen bg-black'>
            <div className='absolute top-0 left-0 right-0 h-full w-full z-[999] pointer-events-none'>

            </div>
            <div className='h-full w-full absolute top-0 left-0 z-[0]'>
                <iframe
                    ref={vrFrameRef}
                    id='vr_core'
                    className='w-full h-full'
                    src="/vr_core/index.htm">
                </iframe>
            </div>

        </div>
    )
}

export default VRCorePage
