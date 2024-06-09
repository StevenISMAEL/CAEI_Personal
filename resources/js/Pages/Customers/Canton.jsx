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
import SearchBar from "@/Components/SearchBar";
import InputError from "@/Components/InputError";
import ModalCreate from "@/Components/ModalCreate";
import Box from "@/Layouts/Box";

import { RiArrowUpDownFill } from "react-icons/ri";

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
import FloatInputText from "@/Components/FloatInputText";

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
    };

    return (
        <>
            {Data.length > 0 ? (
                <>
                    <nav className="flex justify-between pb-3">
                        <div>
                            <select name="" id="">
                                <option>5</option>
                                <option>10</option>
                                <option>25</option>
                            </select>
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
                                                <div className="flex items-center">
                                                    {header}
                                                    <a href="#">
                                                        <RiArrowUpDownFill />
                                                    </a>
                                                </div>
                                            </th>
                                        ))}
                                        <th
                                            scope="col"
                                            className="px-6 py-3 items-center"
                                        >
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((data, index) => (
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
