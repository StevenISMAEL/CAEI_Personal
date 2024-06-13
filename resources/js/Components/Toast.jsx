import { toast } from "react-toastify";

const Notify = (type, mensaje) => {
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
        default:
            break;
    }
};

export { Notify };
