import { useState } from "react";
import { IoMdSunny } from "react-icons/io";
import { MdDarkMode } from "react-icons/md";

const DarkModeToggle = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle("dark");
    };

    return (
        <button
            type="button"
            className="flex items-center justify-center p-2 rounded-full transition duration-300 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={toggleDarkMode}
        >
            {isDarkMode ? (
                <IoMdSunny className="w-6 h-6 text-yellow-500" />
            ) : (
                <MdDarkMode className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            )}
        </button>
    );
};

export default DarkModeToggle;
