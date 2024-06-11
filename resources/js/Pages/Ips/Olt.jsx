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

const Olts = ({ auth, Olts }) => {
    const { data, setData, post, processing, errors, reset,patch, delete:destroy } = useForm({
        olt_id: "",
        olt_name: "",
        olt_address: "",
        olt_coordx: "",
        olt_coordy: "",
        olt_ports: "",
    });

    const [showCreate, setShowCreate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editData, setEditData] = useState(null);
    const [dataToDelete, setDataToDelete] = useState(null);
    const [selectedOlts, setSelectedOlts] = useState([]);

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

    const closeEditModal = () => {
        setShowEdit(false);
        setEditData(null);
    };
    const openEditModal = (olt) => {
        setShowEdit(true);
        setEditData(olt);
        setData({
            olt_id: olt.olt_id,
            olt_name: olt.olt_name,
            olt_address: olt.olt_address,
            olt_coordx: olt.olt_coordx,
            olt_coordy: olt.olt_coordy,
            olt_ports: olt.olt_ports,
        });
    };

    const handleSubmitAdd = (e) => {
        e.preventDefault();

        post(route("olts.store"), {
            preserveScroll: true,
            onSuccess: () => closeModalCreate(),
            onError: (error) => console.log(error),
            onFinish: () => reset(),
        });
    };

    const handleSubmitEdit = (e) => {
        e.preventDefault();

        patch(route("olts.update", { id: editData.olt_id }), {
            preserveScroll: true,
            onSuccess: () => closeEditModal(),
            onError: (error) => console.log(error),
            onFinish: () => reset(),
        });
    };

    const handleDelete = (id) => {
        if (Array.isArray(id)) {
            data.ids = id;
            destroy(route("olts.multiple.destroy"), {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedOlts([]);
                    closeDeleteModal();
                },
                onError: (error) => console.error(error),
                onFinish: () => reset(),
            });
        } else {
            destroy(route("olts.destroy", { id }), {
                preserveScroll: true,
                onSuccess: () => closeDeleteModal(),
                onError: (error) => console.error(error),
                onFinish: () => reset(),
            });
        }
    };

    const inputs = [
        {
            label: "OLT Nombre",
            id: "olt_name",
            type: "text",
            name: "olt_name",
            value: data.olt_name,
            onChange: (e) => setData("olt_name", e.target.value),
            inputError: (
                <InputError message={errors.olt_name} className="mt-2" />
            ),
            defaultValue: data.client_id,
        },
        {
            label: "OLT Dirección",
            id: "olt_address",
            type: "text",
            name: "olt_address",
            value: data.olt_address,
            onChange: (e) => setData("olt_address", e.target.value),
            inputError: (
                <InputError message={errors.olt_address} className="mt-2" />
            ),
            defaultValue: data.client_id,
        },
        {
            label: "OLT Coordenada X",
            id: "olt_coordx",
            type: "text",
            name: "olt_coordx",
            value: data.olt_coordx,
            onChange: (e) => setData("olt_coordx", e.target.value),
            inputError: (
                <InputError message={errors.olt_coordx} className="mt-2" />
            ),

            defaultValue: data.client_id,
        },
        {
            label: "OLT Coordenada Y",
            id: "olt_coordy",
            type: "text",
            name: "olt_coordy",
            value: data.olt_coordy,
            onChange: (e) => setData("olt_coordy", e.target.value),
            inputError: (
                <InputError message={errors.olt_coordy} className="mt-2" />
            ),
            defaultValue: data.client_id,
        },
        {
            label: "OLT Puertos",
            id: "olt_ports",
            type: "number",
            name: "olt_ports",
            value: data.olt_ports,
            onChange: (e) => setData("olt_ports", e.target.value),
            inputError: (
                <InputError message={errors.olt_ports} className="mt-2" />
            ),
            defaultValue: data.client_id,
        },
    ];


    const theaders = [
        "OLT ID",
        "OLT Nombre",
        "OLT Direccion",
        "OLT Coordenada X",
        "OLT Coordenada Y",
        "OLT Puertos",
    ];
    
    const searchColumns = [
        "olt_id",
        "olt_name",
        "olt_address",
        "olt_coordx",
        "olt_coordy",
        "olt_ports",
    ];

    const handleCheckboxChange = (id) => {
        setSelectedOlts((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((item) => item !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedOlts.length === Olts.length) {
            setSelectedOlts([]);
        } else {
            setSelectedOlts(Olts.map((olt) =>olt.olt_id));
        }
    };

    const openDeleteModalForSelected = () => {
        setShowDelete(true);
        setDataToDelete(selectedOlts);
    };

    return (
        <Authenticated
            user={auth.user}
            header={<Header subtitle="Aministrar Olts" />}
        >
            <Head title="Olts" />
            <Tab tabs={tabs}>
                <Box>
                    <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                        <div className="w-full sm:w-auto flex flex-wrap justify-center gap-2">
                            <AddButton onClick={openCreateModal} />
                            <DeleteButton
                                disabled={selectedOlts.length === 0}
                                onClick={openDeleteModalForSelected}
                            />
                        </div>
                        <ExportData
                            data={Olts}
                            searchColumns={searchColumns}
                            headers={theaders}
                        />
                    </div>
                </Box>
                <ModalCreate
                    showCreate={showCreate}
                    closeModalCreate={closeModalCreate}
                    title={"Agregar Olt"}
                    inputs={inputs}
                    processing={processing}
                    handleSubmitAdd={handleSubmitAdd}
                />
                <DeleteModal
                    showDelete={showDelete}
                    closeDeleteModal={closeDeleteModal}
                    title={"Eliminar Olt"}
                    handleDelete={() => handleDelete(dataToDelete)}
                    processing={processing}
                />
                <ModalEdit
                    title="Editar Olt"
                    showEdit={showEdit}
                    closeEditModal={closeEditModal}
                    inputs={inputs}
                    processing={processing}
                    handleSubmitEdit={handleSubmitEdit}
                />
                <Box className="mt-3 hidden md:block">
                    <TableCustom
                        headers={theaders}
                        data={Olts}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="olt_id"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedOlts}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
                <Box className="mt-3  md:hidden">
                    <CardsCustom
                        headers={theaders}
                        data={Olts}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="olt_id"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedOlts}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
            </Tab>
        </Authenticated>
    );
};

export default Olts;
