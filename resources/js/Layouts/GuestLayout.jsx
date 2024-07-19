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
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gradient-to-b from-violet-500 dark:from-violet-950 dark:bg-gray-900">
            <div>
                <button onClick={toggleDarkMode}>
                    <ApplicationLogo className="w-40 h-40" />
                </button>
            </div>

            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
