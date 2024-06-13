import React, { useContext } from "react"; // Asegúrate de importar React si estás utilizando JSX
import { toast } from "react-toastify";
import { DarkModeContext } from "@/Components/DarkModeContext"; // Ajusta la ruta de importación según la estructura de tu proyecto

const Notify = (type, mensaje) => {
    const {isDarkMode} = useContext(DarkModeContext);
    const theme = isDarkMode ? "dark" : "light"

    switch (type) {
        case "success":
            toast.success(mensaje, {
                pauseOnFocusLoss: false,
                icon: "👌",
            });
            break;
        case "error":
            toast.error(mensaje, {
                pauseOnFocusLoss: false,
                icon: "❌",
            });
            break;
        case "info":
            toast.info(mensaje, {
                pauseOnFocusLoss: false,
                icon: "ℹ️",
            });
            break;
        default:
            console.warn(`Tipo de notificación desconocido: ${type}`);
            break;
    }
};

export { Notify };
