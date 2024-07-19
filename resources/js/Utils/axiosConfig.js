// Utils/axiosConfig.js
import axios from "axios";

// Configurar el interceptor sin notificaciones
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 429) {
            error.customMessage =
                "Demasiadas peticiones, por favor espera un minuto.";
        }
        return Promise.reject(error);
    },
);

export default axios;
