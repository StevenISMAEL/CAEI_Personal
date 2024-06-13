import { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import Header from "@/Components/Header";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import Tab from "@/Layouts/TabLayout";
import { AddButton, DeleteButton } from "@/Components/CustomButtons";
import InputError from "@/Components/InputError";
import ModalCreate from "@/Components/ModalCreate";
import ModalEdit from "@/Components/ModalEdit";
import Box from "@/Layouts/Box";
import ExportData from "@/Components/ExportData";
import tabs from "./tabs";
import DeleteModal from "@/Components/DeleteModal";
import TableCustom from "@/Components/TableCustom";
import CardsCustom from "@/Components/CardCustom";

const distributionNap = ({ auth, Olts, DistributionNaps }) => {
    console.log(Olts);
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        delete: destroy,
        patch,
    } = useForm({
        olt_id: "",
        distribution_nap_name: "",
        distribution_nap_address: "",
        distribution_nap_coordx: "",
        distribution_nap_coordy: "",
        distribution_nap_splitter: "",
        ids: [],
    });

    const [showCreate, setShowCreate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editData, setEditData] = useState(null);
    const [dataToDelete, setDataToDelete] = useState(null);
    const [selectedDistributionNaps, setSelectedDistributionNaps] = useState([], );

    const closeDeleteModal = () => {
        setShowDelete(false);
        setDataToDelete(null);
    };
    const openDeleteModal = (id) => {
        setShowDelete(true);
        setDataToDelete(id);
    };
    const openCreateModal = () => {
        reset();
        setShowCreate(true);
    };
    const closeModalCreate = () => {
        setShowCreate(false);
        reset();
    };
    const closeEditModal = () => {
        setShowEdit(false);
        setEditData(null);
    };
    const openEditModal = (distributionNap) => {
        setShowEdit(true);
        setEditData(distributionNap);
        setData({
            olt_id: distributionNap.olt_id,
            distribution_nap_name: distributionNap.distribution_nap_name,
            distribution_nap_address: distributionNap.distribution_nap_address,
            distribution_nap_coordx: distributionNap.distribution_nap_coordx,
            distribution_nap_coordy: distributionNap.distribution_nap_coordy,
            distribution_nap_splitter: distributionNap.distribution_nap_splitter,
        });
    };

    const handleSubmitAdd = (e) => {
        e.preventDefault();

        post(route("distributionNaps.store"), {
            preserveScroll: true,
            onSuccess: () => closeModalCreate(),
            onError: (error) => console.log(error),
            onFinish: () => reset(),
        });
    };

    const handleSubmitEdit = (e) => {
        e.preventDefault();

        patch(
            route("distributionNaps.update", {
                id: editData.distribution_nap_id,
            }),
            {
                preserveScroll: true,
                onSuccess: () => closeEditModal(),
                onError: (error) => console.log(error),
                onFinish: () => reset(),
            },
        );
    };

    const handleDelete = (id) => {
        if (Array.isArray(id)) {
            data.ids = id;
            destroy(route("distributionNaps.multiple.destroy"), {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedDistributionNaps([]);
                    closeDeleteModal();
                },
                onError: (error) => console.error(error),
                onFinish: () => reset(),
            });
        } else {
            destroy(route("distributionNaps.destroy", { id }), {
                preserveScroll: true,
                onSuccess: () => closeDeleteModal(),
                onError: (error) => console.error(error),
                onFinish: () => reset(),
            });
        }
    };

    const inputs = [
        {
            placeholder: "Olt",
            type: "select",
            labelKey: "olt_name",
            valueKey: "olt_id",
            options: Olts,
            value:Olts.olt_name,
            onSelect: (id) => setData("olt_id", id),
            inputError: (
                <InputError message={errors.olt_id} className="mt-2" />
            ),
            defaultValue: data.olt_id,
        },
        {
            label: "Nombre de la NAP de Distribución",
            id: "distribution_nap_name",
            type: "text",
            name: "distribution_nap_name",
            value: data.distribution_nap_name,
            onChange: (e) => setData("distribution_nap_name", e.target.value),
            inputError: (
                <InputError
                    message={errors.distribution_nap_name}
                    className="mt-2"
                />
            ),
            defaultValue: data.distribution_nap_name,
        },
        {
            label: "Dirección de la NAP de Distribución",
            id: "distribution_nap_address",
            type: "text",
            name: "distribution_nap_address",
            value: data.distribution_nap_address,
            onChange: (e) =>
                setData("distribution_nap_address", e.target.value),
            inputError: (
                <InputError
                    message={errors.distribution_nap_address}
                    className="mt-2"
                />
            ),
            defaultValue: data.distribution_nap_address,
        },
        {
            label: "NAP Coordenada X",
            id: "distribution_nap_coordx",
            type: "text",
            name: "distribution_nap_coordx",
            value: data.distribution_nap_coordx,
            onChange: (e) => {
                const inputValue = e.target.value;
                const onlyNumbers = inputValue.replace(/[^0-9]/g, ''); // Eliminar todo lo que no sea número
                setData("distribution_nap_coordx", onlyNumbers);
            },
            inputError: (
                <InputError message={errors.distribution_nap_coordx} className="mt-2" />
            ),
            defaultValue: data.distribution_nap_coordx,
        },
        {
            label: "NAP Coordenada Y",
            id: "distribution_nap_coordy",
            type: "text",
            name: "distribution_nap_coordy",
            value: data.distribution_nap_coordy,
            onChange: (e) => {
                const inputValue = e.target.value;
                const onlyNumbers = inputValue.replace(/[^0-9]/g, ''); 
                setData("distribution_nap_coordy", onlyNumbers);
            },
            inputError: (
                <InputError message={errors.distribution_nap_coordy} className="mt-2" />
            ),
            defaultValue: data.distribution_nap_coordy,
        },
        {
            label: "NAP Splitter",
            id: "distribution_nap_splitter",
            type: "number",
            name: "distribution_nap_splitter",
            value: data.distribution_nap_splitter,
            onChange: (e) => setData("distribution_nap_splitter", e.target.value),
             min: "1",
             max: "24",
            inputError: (
                <InputError message={errors.distribution_nap_splitter} className="mt-2" />
            ),
            defaultValue: data.distribution_nap_splitter,
        },
       
    ];

    const theaders = ["ID", "OLT", "Nombre de la NAP", "Dirección", "Coord X", "Coord Y", "Splitter"];
    const searchColumns = ["distribution_nap_id", "olt_name", "distribution_nap_name", "distribution_nap_address", "distribution_nap_coordx", "distribution_nap_coordy", "distribution_nap_splitter"];


    const handleCheckboxChange = (id) => {
        setSelectedDistributionNaps((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((item) => item !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedDistributionNaps.length === DistributionNaps.length) {
            setSelectedDistributionNaps([]);
        } else {
            setSelectedDistributionNaps(
                DistributionNaps.map(
                    (nap) => nap.distribution_nap_id
                ),
            );
        }
    };

    const openDeleteModalForSelected = () => {
        setShowDelete(true);
        setDataToDelete(selectedDistributionNaps);
    };

    return (
        <Authenticated
            user={auth.user}
            header={<Header subtitle="Administrar Naps de Distribución" />}
        >
            <Head title="distribucion de Naps" />
            <Tab tabs={tabs}>
                <Box>
                    <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                        <div className="w-full sm:w-auto flex flex-wrap justify-center gap-2">
                            <AddButton onClick={openCreateModal} />
                            <DeleteButton
                                disabled={selectedDistributionNaps.length === 0}
                                onClick={openDeleteModalForSelected}
                            />
                        </div>
                        <ExportData
                            data={DistributionNaps}
                            searchColumns={searchColumns}
                            headers={theaders}
                        />
                    </div>
                </Box>
                <ModalCreate
                    showCreate={showCreate}
                    closeModalCreate={closeModalCreate}
                    title={"Agregar Nap de Distribución"}
                    inputs={inputs}
                    processing={processing}
                    handleSubmitAdd={handleSubmitAdd}
                />
                <DeleteModal
                    showDelete={showDelete}
                    closeDeleteModal={closeDeleteModal}
                    title={"Eliminar Nap de distribución"}
                    handleDelete={() => handleDelete(dataToDelete)}
                    processing={processing}
                />
                <ModalEdit
                    title="Editar Nap de Distribución"
                    showEdit={showEdit}
                    closeEditModal={closeEditModal}
                    inputs={inputs}
                    processing={processing}
                    handleSubmitEdit={handleSubmitEdit}
                />
                <Box className="mt-3 hidden md:block">
                    <TableCustom
                        headers={theaders}
                        data={DistributionNaps}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="distribution_nap_id"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedDistributionNaps}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
                <Box className="mt-3  md:hidden">
                    <CardsCustom
                        headers={theaders}
                        data={DistributionNaps}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="distribution_nap_id"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedDistributionNaps}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
            </Tab>
        </Authenticated>
    );
};

export default distributionNap;
