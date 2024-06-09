import { useState, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import Header from "@/Components/Header";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import Tab from "@/Layouts/TabLayout";
import {
    AddButton,
    DeleteButton,
    ExportButton,
    EditCircleButton,
    DeleteCircleButton,
} from "@/Components/CustomButtons";
import InputError from "@/Components/InputError";
import ModalCreate from "@/Components/ModalCreate";
import Box from "@/Layouts/Box";

import tabs from "./tabs";
import Checkbox from "@/Components/Checkbox";
import DeleteModal from "@/Components/DeleteModal";

const Canton = ({ auth, Provinces, Cantons }) => {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        delete: destroy,
    } = useForm({
        province_id: "",
        canton_name: "",
        ids: [],
        numbers: [],
    });

    const [showCreate, setShowCreate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [dataToDelete, setDataToDelete] = useState(null);
    const [selectedCantons, setSelectedCantons] = useState([]);

    const closeModalCreate = () => setShowCreate(false);
    const openCreateModal = () => setShowCreate(true);

    const closeDeleteModal = () => {
        setShowDelete(false);
        setDataToDelete(null);
    };
    const openDeleteModal = (id) => {
        setShowDelete(true);
        setDataToDelete(id);
    };

    const handleSubmitAdd = (e) => {
        e.preventDefault();

        post(route("cantons.store"), {
            preserveScroll: true,
            onSuccess: () => closeModalCreate(),
            onError: (error) => console.log(error),
            onFinish: () => reset(),
        });
    };

    const handleDelete = (id) => {
        if (Array.isArray(id)) {
            data.ids = id;
            destroy(route("cantons.multiple.destroy"), {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedCantons([]);
                    closeDeleteModal();
                },
                onError: (error) => console.error(error),
                onFinish: () => reset(),
            });
        } else {
            destroy(route("cantons.destroy", { id }), {
                preserveScroll: true,
                onSuccess: () => closeDeleteModal(),
                onError: (error) => console.error(error),
                onFinish: () => reset(),
            });
        }
    };

    const inputs = [
        {
            placeholder: "Provincia",
            type: "select",
            labelKey: "province_name",
            valueKey: "province_id",
            options: Provinces,
            onSelect: (id) => setData("province_id", id),
            inputError: (
                <InputError message={errors.province_id} className="mt-2" />
            ),
        },
        {
            label: "Nombre del Canton",
            id: "canton_name",
            type: "text",
            name: "canton_name",
            value: data.canton_name,
            onChange: (e) => setData("canton_name", e.target.value),
            inputError: (
                <InputError message={errors.canton_name} className="mt-2" />
            ),
        },
    ];

    const theaders = ["ID", "Provincia", "Canton"];
    const searchColumns = ["canton_id", "province_name", "canton_name"];

    const handleCheckboxChange = (id) => {
        setSelectedCantons((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((item) => item !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedCantons.length === Cantons.length) {
            setSelectedCantons([]);
        } else {
            setSelectedCantons(Cantons.map((canton) => canton.canton_id));
        }
    };

    const openDeleteModalForSelected = () => {
        setShowDelete(true);
        setDataToDelete(selectedCantons);
    };

    return (
        <Authenticated
            user={auth.user}
            header={<Header subtitle="Manage Cantons" />}
        >
            <Head title="Cantones" />
            <Tab tabs={tabs}>
                <Box>
                    <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                        <div className="w-full sm:w-auto flex flex-wrap justify-center gap-2">
                            <AddButton onClick={openCreateModal} />
                            <DeleteButton
                                disabled={selectedCantons.length === 0}
                                onClick={openDeleteModalForSelected}
                            />
                        </div>
                        <ExportButton disabled={false} />
                    </div>
                </Box>
                <ModalCreate
                    showCreate={showCreate}
                    closeModalCreate={closeModalCreate}
                    title={"Add Cantons"}
                    inputs={inputs}
                    processing={processing}
                    handleSubmitAdd={handleSubmitAdd}
                />
                <DeleteModal
                    showDelete={showDelete}
                    closeDeleteModal={closeDeleteModal}
                    title={"Delete Cantons"}
                    handleDelete={() => handleDelete(dataToDelete)}
                    processing={processing}
                />

                <Box className="mt-3 hidden md:block">
                    <TableCustom
                        Headers={theaders}
                        Data={Cantons}
                        openDeleteModal={openDeleteModal}
                        selectedCantons={selectedCantons}
                        handleCheckboxChange={handleCheckboxChange}
                        handleSelectAll={handleSelectAll}
                        searchColumns={searchColumns}
                    ></TableCustom>
                </Box>
                <Box className="mt-3 md:hidden">
                    <h2>Card</h2>
                </Box>
            </Tab>
        </Authenticated>
    );
};

export default Canton;

import { CgUnavailable } from "react-icons/cg";
import { RiArrowUpDownFill } from "react-icons/ri";
import FloatInputText from "@/Components/FloatInputText";
import { FaArrowDownShortWide, FaArrowUpShortWide } from "react-icons/fa6";
import SecondaryButton from "@/Components/SecondaryButton";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

function TableCustom({
    Headers,
    Data,
    openDeleteModal,
    selectedCantons,
    handleCheckboxChange,
    handleSelectAll,
    searchColumns,
}) {
    const styles =
        "text-violet-600 shadow-sm focus:ring-violet-500 dark:focus:ring-violet-600";
    const [searchValue, setSearchValue] = useState("");
    const [filteredData, setFilteredData] = useState(Data);
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "asc",
    });
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setFilteredData(Data);
    }, [Data]);

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchValue(value);
        const filtered = Data.filter((data) => {
            return searchColumns.some((column) => {
                const fieldValue = data[column].toString().toLowerCase();
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
            {Data.length > 0 ? (
                <>
                    <nav className="flex justify-between pb-3">
                        <div className="flex items-center gap-2">
                            <select
                                onChange={handleItemsPerPageChange}
                                value={itemsPerPage}
                                className="bg-white dark:bg-gray-800  rounded border-gray-300 dark:border-gray-700 shadow-sm focus:ring-violet-500 dark:focus:ring-violet-600 dark:focus:ring-offset-gray-800 "
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
                                                        selectedCantons.length ===
                                                        Data.length
                                                    }
                                                    onChange={handleSelectAll}
                                                />
                                                <label
                                                    htmlFor="checkbox-all"
                                                    className="sr-only"
                                                >
                                                    checkbox
                                                </label>
                                            </div>
                                        </th>
                                        {Headers.map((header, index) => (
                                            <th
                                                key={index}
                                                scope="col"
                                                className="px-6 py-3"
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
                                    {currentData.map((data, index) => (
                                        <tr
                                            key={index}
                                            className={`border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 ${
                                                selectedCantons.includes(
                                                    data.canton_id,
                                                )
                                                    ? "bg-violet-100 dark:bg-violet-900"
                                                    : "bg-white dark:bg-gray-800"
                                            }`}
                                        >
                                            <td className="w-4 p-4">
                                                <div className="flex items-center">
                                                    <Checkbox
                                                        className={styles}
                                                        checked={selectedCantons.includes(
                                                            data.canton_id,
                                                        )}
                                                        onChange={() =>
                                                            handleCheckboxChange(
                                                                data.canton_id,
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
                                            <td className="px-6 py-4">
                                                {data.canton_id}
                                            </td>
                                            <td className="px-6 py-4">
                                                {data.province_name}
                                            </td>
                                            <td className="px-6 py-4">
                                                {data.canton_name}
                                            </td>
                                            <td className="flex items-center px-6 py-4 gap-1">
                                                <EditCircleButton />
                                                <DeleteCircleButton
                                                    onClick={() =>
                                                        openDeleteModal(
                                                            data.canton_id,
                                                        )
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
                                    Prev
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
                                    Next
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
                </>
            ) : (
                <h2 className="flex items-center gap-2 text-lg font-bold text-gray-500 dark:text-gray-400">
                    No hay registros disponibles
                    <CgUnavailable className="text-red-500 text-xl" />
                </h2>
            )}
        </>
    );
}
