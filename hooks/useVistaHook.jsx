import React, { useRef, useEffect } from 'react';

const use3DVistaHook = () => {
    const vrFrameRef = useRef(null);
    const parentWindow = window.parent;
    const eventHandlers = useRef({}); // Store eventType => handler

    const showMedia = (mediaName) => {
        if (vrFrameRef.current) {
            vrFrameRef.current.contentWindow?.tour?.setMediaByName(mediaName);
        }
    };

    const sendMessage = (message) => {
        if (parentWindow) {
            parentWindow.postMessage(message, '*');
        }
    };

    const registerMessageHandler = (eventType, callback) => {
        eventHandlers.current[eventType] = callback;
    };

    useEffect(() => {
        const messageHandler = (event) => {
            if (event.source !== parentWindow) return;
            const { type, payload } = event.data;
            if (type && eventHandlers.current[type]) {
                eventHandlers.current[type](payload);
            }
        };

        window.addEventListener('message', messageHandler);
        return () => {
            window.removeEventListener('message', messageHandler);
        };
    }, []);

    return {
        vrFrameRef,
        showMedia,
        sendMessage,
        onMessage: registerMessageHandler,
    };
};

export default use3DVistaHook;
