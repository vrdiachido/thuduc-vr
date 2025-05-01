# use3DVistaHook

A custom React hook to integrate with a 3DVista virtual tour iframe. This hook provides functionality to send messages to the iframe, switch media by name, and listen for structured messages from the iframe parent window.

## ✅ Features

- Embed and control a 3DVista iframe
- Send messages to the parent window
- Register handlers for different message types from the parent

## 📦 Installation

Simply copy the hook code into your project (e.g., `hooks/use3DVistaHook.jsx`).

## 🚀 Usage

### 1. Import and use the hook in your component:

```jsx
import React, { useRef, useEffect } from "react";
import use3DVistaHook from "./hooks/use3DVistaHook";

const MyTour = () => {
  const vrFrameRef = useRef(null);
  const { showMedia, sendMessage, onMessage } = use3DVistaHook({ vrFrameRef });

  useEffect(() => {
    onMessage("media_loaded", (data) => {
      console.log("Media loaded:", data);
    });

    onMessage("user_action", (data) => {
      console.log("User did something:", data);
    });
  }, []);

  return (
    <iframe
      ref={vrFrameRef}
      src="https://example.com/vr-tour"
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default MyTour;
```
