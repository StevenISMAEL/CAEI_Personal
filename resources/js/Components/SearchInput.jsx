import React, { useState, useRef, useEffect } from "react";
import { FaSearch, FaChevronDown } from "react-icons/fa";
import FloatInputText from "./FloatInputText";

const SearchDropdown = ({
    options,
    labelKey,
    valueKey,
    onSelect,
    placeholder,
    className = "",
}) => {
    const [search, setSearch] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);
    const optionsRefs = useRef([]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                !inputRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef, inputRef]);

    useEffect(() => {
        if (isDropdownOpen) {
            setFocusedIndex(0);
        } else {
            setFocusedIndex(-1);
        }
    }, [isDropdownOpen]);

    useEffect(() => {
        if (focusedIndex >= 0 && optionsRefs.current[focusedIndex]) {
            optionsRefs.current[focusedIndex].scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }
    }, [focusedIndex]);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        setIsDropdownOpen(true);
        if (!value) {
            setSelectedOption(null);
        }
    };

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        setIsDropdownOpen(false);
        setSearch(option[labelKey]);
        onSelect(option[valueKey]);
        inputRef.current.blur();
    };

    const handleInputFocus = () => {
        setIsDropdownOpen(true);
    };

    const handleKeyDown = (e) => {
        if (!isDropdownOpen) {
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                e.preventDefault();
                setIsDropdownOpen(true);
            }
            return;
        }

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setFocusedIndex((prev) =>
                    prev < filteredOptions.length - 1 ? prev + 1 : prev,
                );
                break;
            case "ArrowUp":
                e.preventDefault();
                setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
                break;
            case "Enter":
                if (focusedIndex >= 0) {
                    handleOptionSelect(filteredOptions[focusedIndex]);
                }
                break;
            case "Escape":
                setIsDropdownOpen(false);
                inputRef.current.focus();
                break;
            default:
                break;
        }
    };

    const filteredOptions = options.filter(
        (option) =>
            option[valueKey]
                .toString()
                .toLowerCase()
                .includes(search.toLowerCase()) ||
            option[labelKey].toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <div className="relative">
                <FloatInputText
                    label={placeholder || "Buscar"}
                    ref={inputRef}
                    value={search}
                    onChange={handleSearch}
                    onKeyDown={handleKeyDown}
                    onFocus={handleInputFocus}
                    placeholder={placeholder || "Buscar..."}
                    className="w-full"
                />
                <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-green-500"
                >
                    <FaChevronDown
                        className={`text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
                            isDropdownOpen ? "rotate-180 duration-1000" : ""
                        }`}
                    />
                </button>
            </div>

            {isDropdownOpen && (
                <div className="mt-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg">
                    <ul className="py-1 max-h-60 overflow-auto focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option, index) => (
                                <li
                                    key={option[valueKey]}
                                    ref={(el) =>
                                        (optionsRefs.current[index] = el)
                                    }
                                    onClick={() => handleOptionSelect(option)}
                                    className={`px-4 py-2 text-sm dark:text-gray-50 cursor-pointer ${
                                        index === focusedIndex
                                            ? "bg-green-100 dark:bg-green-300 dark:text-gray-800 dark:hover:text-white text-green-800"
                                            : "text-gray-700"
                                    } hover:bg-gray-100 dark:hover:bg-gray-600`}
                                >
                                    {option[labelKey]}
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                No se encontraron resultados.
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchDropdown;
