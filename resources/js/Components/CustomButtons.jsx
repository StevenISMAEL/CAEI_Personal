import { FaPlusCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const AddButton = ({ className = "", disabled, ...props }) => {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center w-32 gap-2 px-4 py-2 bg-green-400 dark:bg-green-200 border border-transparent rounded-md font-semibold text-md text-white dark:text-gray-800 uppercase tracking-widest hover:bg-green-500 dark:hover:bg-green-300 focus:bg-green-500 dark:focus:bg-green-300 active:bg-green-600 dark:active:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-green-400 transition ease-in-out duration-150 ${
                    disabled && "opacity-35"
                } ` + className
            }
            disabled={disabled}
        >
            <FaPlusCircle /> New
        </button>
    );
};

const DeleteButton = ({ className = "", disabled, ...props }) => {
    return (
        <button
        
            {...props}
            className={
                `inline-flex items-center justify-center w-32 gap-2 px-4 py-2 bg-red-400 dark:bg-red-200 border border-transparent rounded-md font-semibold text-md text-white dark:text-gray-800 uppercase tracking-widest hover:bg-red-500 dark:hover:bg-red-300 focus:bg-red-500 dark:focus:bg-red-300 active:bg-red-600 dark:active:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-red-400 transition ease-in-out duration-150 ${
                    disabled && "opacity-35"
                } ` + className
            }
            disabled={disabled}
        >
            <MdDelete /> Delete
        </button>
    );
};

export { AddButton, DeleteButton };
