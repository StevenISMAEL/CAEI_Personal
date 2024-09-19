import React, { useState, useEffect, useContext } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { DarkModeContext } from "@/Components/DarkModeContext";
import { useNotify } from "@/Components/Toast";
import { usePage } from "@inertiajs/react";

export default function Guest({ children }) {
    const { toggleDarkMode } = useContext(DarkModeContext);
    const { flash } = usePage().props;
    const notify = useNotify();
    const [message, setMessage] = useState(flash.message);
    const [messageType, setMessageType] = useState(flash.type);

    useEffect(() => {
        if (message) {
            notify(messageType, message, { autoClose: 5000 });
            setMessage(null);
            setMessageType(null);
        }
    }, [message, messageType]);

    useEffect(() => {
        if (flash.message) {
            setMessage(flash.message);
            setMessageType(flash.type);
        }
    }, [flash]);

    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gradient-to-b from-blue-500 dark:from-blue-950 dark:bg-gray-900">
            <div>
                <button onClick={toggleDarkMode}>
                    <img src="/images/ag2.png" alt="imagen"   style={{ 
        width: '100px',  // Ajusta el tamaño según sea necesario
        height: '100px', // Mantén la proporción o ajusta según prefieras
        objectFit: 'cover' // Opcional, para asegurar que la imagen se ajuste al tamaño
    }}  />
                </button>
            </div>

            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
