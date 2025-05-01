/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   use3DVistaHook.jsx                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: deno <tctoan1024@gmail.com>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/05/01 11:42:05 by deno              #+#    #+#             */
/*   Updated: 2025/05/01 11:42:05 by deno             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */



import { useRef, useEffect } from 'react';

const use3DVistaHook = ({
    ref, onReadyHandler = () => {
        console.log('3DVista is ready');
    },
}) => {
    const parentWindow = window.parent;
    const eventHandlers = useRef({
        "ready": onReadyHandler
    }); // { type: [callbacks] }

    const showMedia = (mediaName) => {
        ref.current?.contentWindow?.tour?.setMediaByName(mediaName);
    };

    const sendMessage = (message) => {
        parentWindow?.postMessage(message, '*');
    };

    const registerMessageHandler = (eventType, callback) => {
        if (!eventHandlers.current[eventType]) {
            eventHandlers.current[eventType] = [];
        }
        const exists = eventHandlers.current[eventType].includes(callback);
        if (!exists) {
            eventHandlers.current[eventType].push(callback);
        }
    };

    useEffect(() => {
        const messageHandler = (event) => {
            alert('Received message from parent: ' + JSON.stringify(event.data));
            if (event.source !== parentWindow) return;
            const { type, payload } = event.data;
            const callbacks = eventHandlers.current[type];
            if (Array.isArray(callbacks)) {
                callbacks.forEach((cb) => cb(payload));
            }
        };

        window.addEventListener('message', messageHandler);
        return () => {
            window.removeEventListener('message', messageHandler);
        };
    }, []);

    return {
        showMedia,
        sendMessage,
        onMessage: registerMessageHandler,
    };
};

export default use3DVistaHook;
