import { useState, useEffect } from "react";
import { CgUnavailable } from "react-icons/cg";
import { RiArrowUpDownFill } from "react-icons/ri";
import FloatInputText from "@/Components/FloatInputText";
import { FaArrowDownShortWide, FaArrowUpShortWide } from "react-icons/fa6";
import {
    ViewCircleButton,
    DeleteCircleButton,
} from "@/Components/CustomButtons";
import SecondaryButton from "@/Components/SecondaryButton";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import Checkbox from "@/Components/Checkbox";
import Modal from "@/Components/Modal";

const CardsCustom = ({
    headers,
    data,
    searchColumns,
    onDelete,
    idKey,
    onSelectChange,
    selectedItems,
    onSelectAll,
    onViewPdf,

}) => {
    const styles =
        "text-blue-600 shadow-sm focus:ring-blue-500 dark:focus:ring-blue-600";
    const [searchValue, setSearchValue] = useState("");
    const [filteredData, setFilteredData] = useState(data);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setFilteredData(data);
    }, [data]);

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchValue(value);
        const filtered = data.filter((item) => {
            return searchColumns.some((column) => {
                if (column === "roles" && Array.isArray(item[column])) {
                    return item[column].some((role) =>
                        role.role_name.toLowerCase().includes(value),
                    );
                }
                const fieldValue = String(item[column]).toLowerCase();
                return fieldValue.includes(value);
            });
        });
        setFilteredData(filtered);
        setCurrentPage(1);
    };

 


    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1);
    };

    const handleNextPage = () => {
        if (currentPage * itemsPerPage < filteredData.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);
    const currentData = filteredData.slice(startIndex, endIndex);


    const renderFieldValue = (item, column) => {
        if (column === "roles") {
            if (Array.isArray(item[column]) && item[column].length > 0) {
                return item[column].map((role) => role.role_name).join(", ");
            } else {
                return "Sin Rol";
            }
        }
        return String(item[column]);
    };

    return (
        <>
            {data.length > 0 ? (
                <>
                    <nav className="flex flex-wrap justify-between pb-3">
                        <div className="flex items-center gap-2 my-3">
                            <select
                                onChange={handleItemsPerPageChange}
                                value={itemsPerPage}
                                className="bg-white dark:bg-gray-800 rounded-md border-gray-300 dark:border-gray-700 shadow-md focus:ring-blue-500 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                            </select>
                            <span>
                                {startIndex + 1}-{endIndex} de{" "}
                                {filteredData.length} registros
                            </span>
                        </div>
                        <FloatInputText
                            label="Buscar..."
                            onChange={handleSearch}
                            value={searchValue}
                            className="my-3"
                        />
                        <div className="flex items-center my-3">
                            <Checkbox
                                className={styles}
                                checked={selectedItems.length === data.length}
                                onChange={onSelectAll}
                                id="checkbox-all"
                            />
                            <label htmlFor="checkbox-all" className="ml-2">
                                Seleccionar todo
                            </label>
                        </div>
                    </nav>
                    {filteredData.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {currentData.map((item) => (
                                <div
                                    key={item[idKey]}
                                    className={`border rounded-lg p-4 shadow-md dark:border-gray-700 dark:bg-gray-800 ${
                                        selectedItems.includes(item[idKey])
                                            ? "bg-blue-100 dark:bg-blue-900"
                                            : "bg-white dark:bg-gray-800"
                                    }`}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <Checkbox
                                            className={styles}
                                            checked={selectedItems.includes(
                                                item[idKey],
                                            )}
                                            onChange={() =>
                                                onSelectChange(item[idKey])
                                            }
                                        />
                                        <div className="flex gap-2">
                                        <ViewCircleButton
                                                    onClick={() =>
                                                        onViewPdf(item)
                                                    }
                                                    className="text-blue-500 hover:text-blue-700"
                                                />
                                            
                                            <DeleteCircleButton
                                                onClick={() =>
                                                    onDelete(item[idKey])
                                                }
                                            />
                                        </div>
                                    </div>
                                    {searchColumns.map((column, idx) => (
                                        <div
                                            key={idx}
                                            className="mb-2 whitespace-pre-wrap truncate"
                                        >
                                            <strong>{headers[idx]}: </strong>
                                            {renderFieldValue(item, column)}
                                        </div>
                                    ))}
                                   
                                </div>
                            ))}
                        </div>
                    ) : (
                        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-500 dark:text-gray-400">
                            No se han encontrado resultados
                            <CgUnavailable className="text-red-500 text-xl" />
                        </h2>
                    )}
                    <div className="flex justify-between gap-3 py-3 items-center sm:justify-center">
                        <SecondaryButton
                            className="px-3 py-1 flex items-center gap-1 bg-gray-200 dark:bg-gray-600"
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                        >
                            <IoIosArrowBack />
                            Prev
                        </SecondaryButton>
                        <span>
                            Página {currentPage} de{" "}
                            {Math.ceil(filteredData.length / itemsPerPage)}
                        </span>
                        <SecondaryButton
                            className="px-3 py-1 flex items-center gap-1 bg-gray-200 dark:bg-gray-600"
                            onClick={handleNextPage}
                            disabled={
                                currentPage * itemsPerPage >=
                                filteredData.length
                            }
                        >
                            Next
                            <IoIosArrowForward />
                        </SecondaryButton>
                    </div>
                
                </>
            ) : (
                <h2 className="flex items-center gap-2 text-lg font-bold text-gray-500 dark:text-gray-400">
                    No hay registros disponibles
                    <CgUnavailable className="text-red-500 text-xl" />
                </h2>
            )}
        </>
    );
};

export default CardsCustom;
