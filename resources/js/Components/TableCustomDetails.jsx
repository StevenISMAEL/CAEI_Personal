import { useState, useEffect } from "react";
import { CgUnavailable } from "react-icons/cg";
import { RiArrowUpDownFill } from "react-icons/ri";
import FloatInputText from "@/Components/FloatInputText";
import { FaArrowDownShortWide, FaArrowUpShortWide } from "react-icons/fa6";
import {
    EditCircleButton,
    DeleteCircleButton,
    DetailsCircleButton,
} from "@/Components/CustomButtons";
import SecondaryButton from "@/Components/SecondaryButton";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import Checkbox from "@/Components/Checkbox";
import Modal from "@/Components/Modal";

const TableCustom = ({
    headers,
    data,
    searchColumns,
    columnasdetalles,
    theadersdetalles,
    onDelete,
    onEdit,
    idKey,
    onSelectChange,
    selectedItems,
    onSelectAll,
}) => {
    const styles =
        "text-indigo-600 shadow-sm focus:ring-blue-500 dark:focus:ring-blue-600";
    const [searchValue, setSearchValue] = useState("");
    const [filteredData, setFilteredData] = useState(data);
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "asc",
    });
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setFilteredData(data);
    }, [data]);

    const closeModal = () => {
        setIsModalOpen(false);
        setModalData(null);
    };

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
    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchValue(value);
        const filtered = data.filter((item) => {
            return searchColumns.some((column) => {
                if (column === "roles") {
                    return item[column].some((role) =>
                        role.role_name.toLowerCase().includes(value),
                    );
                }
                const fieldValue = item[column].toString().toLowerCase();
                return fieldValue.includes(value);
            });
        });
        setFilteredData(filtered);
        setCurrentPage(1);
    };

    const handleSort = (columnKey) => {
        let direction = "asc";
        if (sortConfig.key === columnKey && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key: columnKey, direction });
        const sortedData = [...filteredData].sort((a, b) => {
            if (columnKey === "roles") {
                const rolesA = a[columnKey]
                    .map((role) => role.role_name)
                    .join(", ");
                const rolesB = b[columnKey]
                    .map((role) => role.role_name)
                    .join(", ");
                return direction === "asc"
                    ? rolesA.localeCompare(rolesB)
                    : rolesB.localeCompare(rolesA);
            }
            if (a[columnKey] < b[columnKey]) {
                return direction === "asc" ? -1 : 1;
            }
            if (a[columnKey] > b[columnKey]) {
                return direction === "asc" ? 1 : -1;
            }
            return 0;
        });
        setFilteredData(sortedData);
    };

    const renderSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) {
            return <RiArrowUpDownFill />;
        }
        if (sortConfig.direction === "asc") {
            return <FaArrowUpShortWide />;
        }
        return <FaArrowDownShortWide />;
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);
    const handleViewDetails = (item) => {
        if (item) {
            setModalData(item);
            setIsModalOpen(true);
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

    return (
        <>
            {data.length > 0 ? (
                <>
                    <nav className="flex justify-between pb-3">
                        <div className="flex items-center gap-2">
                            <select
                                onChange={handleItemsPerPageChange}
                                value={itemsPerPage}
                                className="bg-white dark:bg-gray-800 rounded-md border-gray-300 dark:border-gray-700 shadow-md focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
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
                            id="search-button"
                            onChange={handleSearch}
                            value={searchValue}
                        />
                    </nav>
                    {filteredData.length > 0 ? (
                        <div className="relative overflow-x-scroll shadow-md sm:rounded-lg">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="p-4">
                                            <div className="flex items-center">
                                                <Checkbox
                                                    className={styles}
                                                    checked={
                                                        selectedItems.length ===
                                                        data.length
                                                    }
                                                    onChange={onSelectAll}
                                                />
                                                <label
                                                    htmlFor="checkbox-all"
                                                    className="sr-only"
                                                >
                                                    checkbox
                                                </label>
                                            </div>
                                        </th>
                                        {headers.map((header, index) => (
                                            <th
                                                key={index}
                                                scope="col"
                                                className="px-6 py-3 truncate"
                                            >
                                                <button
                                                    className="flex items-center gap-2"
                                                    onClick={() =>
                                                        handleSort(
                                                            searchColumns[
                                                                index
                                                            ],
                                                        )
                                                    }
                                                >
                                                    {header}
                                                    {renderSortIcon(
                                                        searchColumns[index],
                                                    )}
                                                </button>
                                            </th>
                                        ))}
                                        <th
                                            scope="col"
                                            className="px-6 py-3 items-center"
                                        >
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentData.map((item, index) => (
                                        <tr
                                            key={item[idKey]}
                                            className={`border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 ${
                                                selectedItems.includes(
                                                    item[idKey],
                                                )
                                                    ? "bg-blue-100 dark:bg-blue-100"
                                                    : "bg-white dark:bg-gray-800"
                                            }`}
                                        >
                                            <td className="w-4 p-4">
                                                <div className="flex items-center">
                                                    <Checkbox
                                                        className={styles}
                                                        checked={selectedItems.includes(
                                                            item[idKey],
                                                        )}
                                                        onChange={() =>
                                                            onSelectChange(
                                                                item[idKey],
                                                            )
                                                        }
                                                    />
                                                    <label
                                                        htmlFor="checkbox-table-search-1"
                                                        className="sr-only"
                                                    >
                                                        checkbox
                                                    </label>
                                                </div>
                                            </td>
                                            {searchColumns.map(
                                                (column, idx) => (
                                                    <td
                                                        key={idx}
                                                        className="px-6 py-4 whitespace-pre-wrap truncate"
                                                    >
                                                        {column === "roles"
                                                            ? item[column]
                                                                  .length > 0
                                                                ? item[column]
                                                                      .map(
                                                                          (
                                                                              role,
                                                                          ) =>
                                                                              role.role_name,
                                                                      )
                                                                      .join(
                                                                          ", ",
                                                                      )
                                                                : "Sin Rol"
                                                            : item[column]}
                                                    </td>
                                                ),
                                            )}
                                            <td className="flex items-center px-6 py-4 gap-1">
                                                <EditCircleButton
                                                    onClick={() => onEdit(item)}
                                                />
                                                <DeleteCircleButton
                                                    onClick={() =>
                                                        onDelete(item[idKey])
                                                    }
                                                />
                                                <DetailsCircleButton
                                                    onClick={() =>
                                                        handleViewDetails(item)
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="flex justify-center gap-3 items-center p-4">
                                <SecondaryButton
                                    className="px-3 py-1 flex items-center gap-1 bg-gray-200 dark:bg-gray-600"
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1}
                                >
                                    <IoIosArrowBack />
                                    Atras
                                </SecondaryButton>
                                <span>
                                    Página {currentPage} de{" "}
                                    {Math.ceil(
                                        filteredData.length / itemsPerPage,
                                    )}
                                </span>
                                <SecondaryButton
                                    className="px-3 py-1 flex items-center gap-1 bg-gray-200 dark:bg-gray-600"
                                    onClick={handleNextPage}
                                    disabled={
                                        currentPage * itemsPerPage >=
                                        filteredData.length
                                    }
                                >
                                    Siguiente
                                    <IoIosArrowForward />
                                </SecondaryButton>
                            </div>
                        </div>
                    ) : (
                        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-500 dark:text-gray-400">
                            No se han encontrado resultados
                            <CgUnavailable className="text-red-500 text-xl" />
                        </h2>
                    )}
                    {isModalOpen && modalData && (
                        <Modal show={isModalOpen} onClose={closeModal}>
                            <div className="p-6">
                                <h2 className="text-2xl font-bold mb-3 dark:text-white">
                                    Detalles
                                </h2>

                                {columnasdetalles.map((column, idx) => (
                                    <div
                                        key={idx}
                                        className="mb-2 dark:text-white"
                                    >
                                        <strong className="font-bold">
                                            {theadersdetalles[idx]}:{" "}
                                        </strong>
                                        {/* Verificamos si el valor es null, undefined o vacío, y si es así, mostramos un espacio */}
                                        {modalData[column] !== undefined &&
                                        modalData[column] !== null &&
                                        modalData[column] !== ""
                                            ? renderFieldValue(
                                                  modalData,
                                                  column,
                                              ) // Muestra el valor si existe
                                            : " "}{" "}
                                        {/* Muestra un espacio si el valor no está disponible */}
                                    </div>
                                ))}

                                <div className="mt-6 flex justify-end">
                                    <SecondaryButton onClick={closeModal}>
                                        Cerrar
                                    </SecondaryButton>
                                </div>
                            </div>
                        </Modal>
                    )}
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

export default TableCustom;
