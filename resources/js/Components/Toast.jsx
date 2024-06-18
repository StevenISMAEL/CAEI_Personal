// import { useContext } from "react";
// import { toast } from "react-toastify";
// import { DarkModeContext } from "@/Components/DarkModeContext";

// const useNotify = () => {
//     const { isDarkMode } = useContext(DarkModeContext);
//     const theme = isDarkMode ? "dark" : "light";

//     const notify = (type, mensaje) => {
//         switch (type) {
//             case "success":
//                 toast.success(mensaje, {
//                     pauseOnFocusLoss: false,
//                     icon: "👌",
//                     theme,
//                 });
//                 break;
//             case "error":
//                 toast.error(mensaje, {
//                     pauseOnFocusLoss: false,
//                     icon: "❌",
//                     theme,
//                 });
//                 break;
//             case "info":
//                 toast.info(mensaje, {
//                     pauseOnFocusLoss: false,
//                     icon: "ℹ",
//                     theme,
//                 });
//                 break;
//             default:
//                 console.warn(`Tipo de notificación desconocido: ${type}`);
//                 break;
//         }
//     };

//     return notify;
// };

// export { useNotify };
