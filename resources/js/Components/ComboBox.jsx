import React, { useState, useEffect, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";
import FloatInputText from "./FloatInputText";

const Combobox = ({
    options,
    label,
    value,
    onChange,
    inputError,
    className = "",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleOptionClick = (optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    const handleOptionSelect = (option) => {
        onChange(option.value);
        setIsOpen(false);
    };

    const handleMouseEnter = (index) => {
        setFocusedIndex(index);
    };

    const handleMouseLeave = () => {
        setFocusedIndex(-1);
    };

    return (
        <div ref={wrapperRef} className={`relative ${className}`}>
            <FloatInputText
                label={label || "Select an option"}
                type="text"
                id="list-input"
                value={
                    options.find((option) => option.value === value)?.label ||
                    ""
                }
                readOnly
                onClick={() => setIsOpen(!isOpen)}
                inputError={inputError}
                className="w-full px-4 py-2 text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-green-500 focus:outline-none focus:ring-0 focus:border-green-600"
            />
            <FaChevronDown
                onClick={() => setIsOpen(!isOpen)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
                    isOpen ? "rotate-180 duration-1000" : ""
                } focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-green-500`}
            />
            {isOpen && (
                <div className="mt-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg">
                    <ul className="py-1 max-h-60 overflow-auto focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        {options.map((option, index) => (
                            <li
                                key={option.value}
                                onClick={() => handleOptionSelect(option)}
                                onMouseEnter={() => handleMouseEnter(index)}
                                onMouseLeave={handleMouseLeave}
                                className={`px-4 py-2 text-sm cursor-pointer ${
                                    focusedIndex === index
                                        ? "dark:text-white  text-green-800 hover:bg-gray-100 dark:hover:bg-gray-600"
                                        : "bg-green-100 dark:bg-green-300 dark:text-gray-800 dark:hover:text-white text-green-800"
                                }  hover:bg-gray-100 dark:hover:bg-gray-600`}
                            >
                                {option.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {inputError && (
                <div className="text-red-500 text-sm">{inputError}</div>
            )}
        </div>
    );
};

export default Combobox;
