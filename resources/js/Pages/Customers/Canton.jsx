import { useState } from "react";
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
    });

    const [showCreate, setShowCreate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [dataToDelete, setDataToDelete] = useState(null);

    const closeModalCreate = () => setShowCreate(false);
    const openCreateModal = () => setShowCreate(true);

    const closeDeleteModal = () => setShowDelete(false);
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
        destroy(route("cantons.destroy", { id: id }), {
            preserveScroll: true,
            onSuccess: () => closeDeleteModal(),
            onError: (error) => console.error(error),
            onFinish: () => reset(),
        });
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
                            <DeleteButton disabled={true} />
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

function TableCustom({ Headers, Data, openDeleteModal, handleDelete }) {
    const styles =
        "text-violet-600 shadow-sm focus:ring-violet-500 dark:focus:ring-violet-600";

    return (
        <div className="relative overflow-x-scroll shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="p-4">
                            <div className="flex items-center">
                                <Checkbox className={styles} />
                                <label
                                    htmlFor="checkbox-all"
                                    className="sr-only"
                                >
                                    checkbox
                                </label>
                            </div>
                        </th>
                        {Headers.map((header, index) => (
                            <th key={index} scope="col" className="px-6 py-3">
                                <div className="flex items-center">
                                    {header}
                                    <a href="#">
                                        <RiArrowUpDownFill />
                                    </a>
                                </div>
                            </th>
                        ))}
                        <th scope="col" className="px-6 py-3 items-center">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {Data.map((data, index) => (
                        <tr
                            key={index}
                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                            <td className="w-4 p-4">
                                <div className="flex items-center">
                                    <Checkbox className={styles} />
                                    <label
                                        htmlFor="checkbox-table-search-1"
                                        className="sr-only"
                                    >
                                        checkbox
                                    </label>
                                </div>
                            </td>
                            <td className="px-6 py-4">{data.canton_id}</td>
                            <td className="px-6 py-4">{data.province_name}</td>
                            <td className="px-6 py-4">{data.canton_name}</td>
                            <td className="flex items-center px-6 py-4 gap-1">
                                <EditCircleButton />
                                <DeleteCircleButton
                                    onClick={() =>
                                        openDeleteModal(data.canton_id)
                                    }
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
