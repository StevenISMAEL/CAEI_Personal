import { useState, useRef, useEffect } from "react";
import { FaCheck, FaChevronDown } from "react-icons/fa";
import FloatInputText from "./FloatInputText";

function SelectInput({
    data,
    labelKey,
    valueKey,
    placeholder,
    onChange,
    className = "",
}) {
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownMenuRef = useRef(null);

    const filteredItems =
        query === ""
            ? data
            : data.filter((item) => {
                  const label = item[labelKey]
                      .toString()
                      .toLowerCase()
                      .replace(/\s+/g, "");
                  const searchQuery = query.toLowerCase().replace(/\s+/g, "");
                  return label.includes(searchQuery);
              });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownMenuRef.current &&
                !dropdownMenuRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleOptionClick = (item) => {
        setSelected(item);
        setIsOpen(false);
        setQuery(""); // Limpiar la búsqueda después de seleccionar
        onChange(item[valueKey]);
    };

    return (
        <div className={`w-72 relative ${className}`} ref={dropdownMenuRef}>
            <div className="relative w-full cursor-default overflow-hidden rounded-lg pt-1 text-left shadow-md focus:outline-none sm:text-sm">
                <FloatInputText
                    className="w-full text-sm leading-5 text-gray-900"
                    value={query}
                    label={selected ? selected[labelKey] : placeholder}
                    onClick={() => setIsOpen(!isOpen)}
                    onChange={(event) => setQuery(event.target.value)}
                />
                <button
                    className="absolute inset-y-0 right-0 flex items-center pr-2"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <FaChevronDown
                        className={`h-5 w-5 text-gray-400 hover:text-gray-500 duration-500 ${isOpen ? "rotate-180" : ""}`}
                        aria-hidden="true"
                    />
                </button>
            </div>
            {isOpen && (
                <div className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredItems.length === 0 ? (
                        <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                            No results found.
                        </div>
                    ) : (
                        filteredItems.map((item) => (
                            <div
                                key={item[valueKey]}
                                className="relative cursor-pointer select-none py-2 pl-10 pr-4 text-gray-900 hover:bg-green-400 hover:text-white"
                                onClick={() => handleOptionClick(item)}
                            >
                                <span
                                    className={`block truncate ${selected === item ? "font-medium" : "font-normal"}`}
                                >
                                    {item[labelKey]}
                                </span>
                                {selected === item && (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-400">
                                        <FaCheck
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        />
                                    </span>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default SelectInput;
