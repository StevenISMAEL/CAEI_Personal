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

const lastmileNaps = ({ auth,DistributionNaps, LastMileNaps }) => {
    console.log(LastMileNaps);
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
        distribution_nap_id: "",
        last_mile_nap_name: "",
        last_mile_nap_address: "",
        last_mile_nap_coordx: "",
        last_mile_nap_coordy: "",
        last_mile_nap_splitter: "",
        ids: [],
    });

    const [showCreate, setShowCreate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editData, setEditData] = useState(null);
    const [dataToDelete, setDataToDelete] = useState(null);
    const [selectedLastMileNaps, setSelectedLastMileNaps] = useState([], );

   
    const openCreateModal = () => {
        reset();
        setShowCreate(true);
    };
    const closeModalCreate = () => {
        setShowCreate(false);
        reset();
    };
    const closeDeleteModal = () => {
        setShowDelete(false);
        setDataToDelete(null);
    };
    const openDeleteModal = (id) => {
        setShowDelete(true);
        setDataToDelete(id);
    };

    const closeEditModal = () => {
        setShowEdit(false);
        setEditData(null);
    };
 
    const openEditModal = (lastMileNap) => {
        setShowEdit(true);
        setEditData(lastMileNap);
        setData({
            distribution_nap_id: lastMileNap.distribution_nap_id,
            last_mile_nap_name: lastMileNap.last_mile_nap_name,
            last_mile_nap_address: lastMileNap.last_mile_nap_address,
            last_mile_nap_coordx: lastMileNap.last_mile_nap_coordx,
            last_mile_nap_coordy: lastMileNap.last_mile_nap_coordy,
            last_mile_nap_splitter: lastMileNap.last_mile_nap_splitter,
        });
    };
    const handleSubmitAdd = (e) => {
        e.preventDefault();

        post(route("lastmileNaps.store"), {
            preserveScroll: true,
            onSuccess: () => closeModalCreate(),
            onError: (error) => console.log(error),
            onFinish: () => reset(),
        });
    };

    const handleSubmitEdit = (e) => {
        e.preventDefault();

        patch(
            route("lastmileNaps.update", {
                id: editData.last_mile_nap_id,
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
            destroy(route("lastmileNaps.multiple.destroy"), {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedLastMileNaps([]);
                    closeDeleteModal();
                },
                onError: (error) => console.error(error),
                onFinish: () => reset(),
            });
        } else {
            destroy(route("lastmileNaps.destroy", { id }), {
                preserveScroll: true,
                onSuccess: () => closeDeleteModal(),
                onError: (error) => console.error(error),
                onFinish: () => reset(),
            });
        }
    };

    const inputs = [
        {
           
            placeholder: "Distribution Nap",
            type: "select",
            labelKey: "distribution_nap_name",
            valueKey: "distribution_nap_id",
            options: DistributionNaps,
            value: data.distribution_nap_id,  // Valor directamente ligado al estado
            onSelect: (id) => setData("distribution_nap_id", id),  // Actualización del estado
            inputError: (
                <InputError message={errors.distribution_nap_id} className="mt-2" />
            ),
        },
        {
            label: "Nombre de la NAP ",
            id: "last_mile_nap_name",
            type: "text",
            name: "last_mile_nap_name",
            value: data.last_mile_nap_name,
            onChange: (e) => setData("last_mile_nap_name", e.target.value),
            inputError: (
                <InputError
                    message={errors.last_mile_nap_name}
                    className="mt-2"
                />
            ),
            defaultValue: data.last_mile_nap_name,
        },
        {
            label: "Dirección de la NAP",
            id: "last_mile_nap_address",
            type: "text",
            name: "last_mile_nap_address",
            value: data.last_mile_nap_address,
            onChange: (e) => setData("last_mile_nap_address", e.target.value),
            inputError: (
                <InputError
                    message={errors.last_mile_nap_address}
                    className="mt-2"
                />
            ),
            defaultValue: data.last_mile_nap_address,
        },
        {label: "NAP Coordenada X",
            id: "last_mile_nap_coordx",
            type: "text",
            name: "last_mile_nap_coordx",
            value: data.last_mile_nap_coordx,
            onChange: (e) => {
                const inputValue = e.target.value;
                const onlyNumbers = inputValue.replace(/[^0-9]/g, ''); // Eliminar todo lo que no sea número
                setData("last_mile_nap_coordx", onlyNumbers);
            },
            inputError: (
                <InputError message={errors.last_mile_nap_coordx} className="mt-2" />
            ),
            defaultValue: data.last_mile_nap_coordx,
        },
        {
            label: "NAP Coordenada Y",
            id: "last_mile_nap_coordy",
            type: "text",
            name: "last_mile_nap_coordy",
            value: data.last_mile_nap_coordy,
            onChange: (e) => {
                const inputValue = e.target.value;
                const onlyNumbers = inputValue.replace(/[^0-9]/g, ''); 
                setData("last_mile_nap_coordy", onlyNumbers);
            },
            inputError: (
                <InputError message={errors.last_mile_nap_coordy} className="mt-2" />
            ),
            defaultValue: data.last_mile_nap_coordy,
        },
        {
            label: "NAP Splitter",
            id: "last_mile_nap_splitter",
            type: "number",
            name: "last_mile_nap_splitter",
            value: data.last_mile_nap_splitter,
            onChange: (e) => setData("last_mile_nap_splitter", e.target.value),
            min: "1",
            max: "24",
            inputError: (
                <InputError message={errors.last_mile_nap_splitter} className="mt-2" />
            ),
            defaultValue: data.last_mile_nap_splitter,
        },
       
    ];
    const theaders = ["ID", "NAP distribución", "Nombre de la NAP", "Dirección", "Coord X", "Coord Y", "Splitter"];
    const searchColumns = ["last_mile_nap_id", "distribution_nap_name", "last_mile_nap_name", "last_mile_nap_address", "last_mile_nap_coordx", "last_mile_nap_coordy", "last_mile_nap_splitter"];


    const handleCheckboxChange = (id) => {
        setSelectedLastMileNaps((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((item) => item !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedLastMileNaps.length === LastMileNaps.length) {
            setSelectedLastMileNaps([]);
        } else {
            setSelectedLastMileNaps(
                LastMileNaps.map(
                    (nap) => nap.last_mile_nap_id
                ),
            );
        }
    };

    const openDeleteModalForSelected = () => {
        setShowDelete(true);
        setDataToDelete(selectedLastMileNaps);
    };

    return (
        <Authenticated
            user={auth.user}
            header={<Header subtitle="Administrar Naps Ultima Milla" />}
        >
            <Head title="Naps Ultima Milla" />
            <Tab tabs={tabs}>
                <Box>
                    <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                        <div className="w-full sm:w-auto flex flex-wrap justify-center gap-2">
                            <AddButton onClick={openCreateModal} />
                            <DeleteButton
                                disabled={selectedLastMileNaps.length === 0}
                                onClick={openDeleteModalForSelected}
                            />
                        </div>
                        <ExportData
                            data={LastMileNaps}
                            searchColumns={searchColumns}
                            headers={theaders}
                        />
                    </div>
                </Box>
                <ModalCreate
                    showCreate={showCreate}
                    closeModalCreate={closeModalCreate}
                    title={"Agregar Nap Ulima Milla"}
                    inputs={inputs}
                    processing={processing}
                    handleSubmitAdd={handleSubmitAdd}
                />
                <DeleteModal
                    showDelete={showDelete}
                    closeDeleteModal={closeDeleteModal}
                    title={"Eliminar Nap "}
                    handleDelete={() => handleDelete(dataToDelete)}
                    processing={processing}
                />
                <ModalEdit
                    title="Editar Nap "
                    showEdit={showEdit}
                    closeEditModal={closeEditModal}
                    inputs={inputs}
                    processing={processing}
                    handleSubmitEdit={handleSubmitEdit}
                />
                <Box className="mt-3 hidden md:block">
                    <TableCustom
                        headers={theaders}
                        data={LastMileNaps}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="last_mile_nap_id"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedLastMileNaps}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
                <Box className="mt-3  md:hidden">
                    <CardsCustom
                        headers={theaders}
                        data={LastMileNaps}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="last_mile_nap_id"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedLastMileNaps}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
            </Tab>
        </Authenticated>
    );
};

export default lastmileNaps;
