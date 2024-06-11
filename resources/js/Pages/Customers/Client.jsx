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

const Client = ({ auth, Addresses, Clients }) => {
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
        client_id: "",
        address_id: "",
        client_name: "",
        client_email: "",
        ids: [],
    });

    const [showCreate, setShowCreate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editData, setEditData] = useState(null);
    const [dataToDelete, setDataToDelete] = useState(null);
    const [selectedClients, setSelectedClients] = useState([]);

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
    const openEditModal = (client) => {
        setShowEdit(true);
        setEditData(client);
        setData({
            client_id: client.client_id,
            address_id: client.address_id,
            client_name: client.client_name,
            client_email: client.client_email,
        });
    };

    const handleSubmitAdd = (e) => {
        e.preventDefault();

        post(route("clients.store"), {
            preserveScroll: true,
            onSuccess: () => closeModalCreate(),
            onError: (error) => console.log(error),
            onFinish: () => reset(),
        });
    };

    const handleSubmitEdit = (e) => {
        e.preventDefault();

        patch(route("clients.update", { id: editData.client_id }), {
            preserveScroll: true,
            onSuccess: () => closeEditModal(),
            onError: (error) => console.log(error),
            onFinish: () => reset(),
        });
    };

    const handleDelete = (id) => {
        if (Array.isArray(id)) {
            data.ids = id;
            destroy(route("clients.multiple.destroy"), {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedClients([]);
                    closeDeleteModal();
                },
                onError: (error) => console.error(error),
                onFinish: () => reset(),
            });
        } else {
            destroy(route("clients.destroy", { id }), {
                preserveScroll: true,
                onSuccess: () => closeDeleteModal(),
                onError: (error) => console.error(error),
                onFinish: () => reset(),
            });
        }
    };

    const inputs = [
        {
            label: "Cédula",
            id: "client_id",
            type: "text",
            name: "client_id",
            value: data.client_id,
            onChange: (e) => setData("client_id", e.target.value),
            inputError: (
                <InputError message={errors.client_id} className="mt-2" />
            ),
            defaultValue: data.client_id,
        },
        {
            placeholder: "Dirrecion",
            type: "select",
            labelKey: "address",
            valueKey: "address_id",
            options: Addresses,
            onSelect: (id) => setData("address_id", id),
            inputError: (
                <InputError message={errors.address_id} className="mt-2" />
            ),
            defaultValue: data.address_id,
        },
        {
            label: "Nombres",
            id: "client_name",
            type: "text",
            name: "client_name",
            value: data.client_name,
            onChange: (e) => setData("client_name", e.target.value),
            inputError: (
                <InputError message={errors.client_name} className="mt-2" />
            ),
            defaultValue: data.client_name,
        },
        {
            label: "Email",
            id: "client_email",
            type: "email",
            name: "client_email",
            value: data.client_email,
            onChange: (e) => setData("client_email", e.target.value),
            inputError: (
                <InputError message={errors.client_email} className="mt-2" />
            ),
            defaultValue: data.client_email,
        },
    ];

    const theaders = [
        "Cédula",
        "Nombres",
        "Direccion",
        "Email",
    ];
    const searchColumns = [
        "client_id",
        "client_name",
        "address",
        "client_email",
    ];

    const handleCheckboxChange = (id) => {
        setSelectedClients((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((item) => item !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedClients.length === Clients.length) {
            setSelectedClients([]);
        } else {
            setSelectedClients(Clients.map((client) => client.client_id));
        }
    };

    const openDeleteModalForSelected = () => {
        setShowDelete(true);
        setDataToDelete(selectedClients);
    };

    return (
        <Authenticated
            user={auth.user}
            header={<Header subtitle="Manage Clients" />}
        >
            <Head title="Clientes" />
            <Tab tabs={tabs}>
                <Box>
                    <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                        <div className="w-full sm:w-auto flex flex-wrap justify-center gap-2">
                            <AddButton onClick={openCreateModal} />
                            <DeleteButton
                                disabled={selectedClients.length === 0}
                                onClick={openDeleteModalForSelected}
                            />
                        </div>
                        <ExportData
                            data={Clients}
                            searchColumns={searchColumns}
                            headers={theaders}
                        />
                    </div>
                </Box>
                <ModalCreate
                    showCreate={showCreate}
                    closeModalCreate={closeModalCreate}
                    title={"Add Clients"}
                    inputs={inputs}
                    processing={processing}
                    handleSubmitAdd={handleSubmitAdd}
                />
                <DeleteModal
                    showDelete={showDelete}
                    closeDeleteModal={closeDeleteModal}
                    title={"Delete Clients"}
                    handleDelete={() => handleDelete(dataToDelete)}
                    processing={processing}
                />
                <ModalEdit
                    title="Edit Parish"
                    showEdit={showEdit}
                    closeEditModal={closeEditModal}
                    inputs={inputs}
                    processing={processing}
                    handleSubmitEdit={handleSubmitEdit}
                />
                <Box className="mt-3 hidden md:block">
                    <TableCustom
                        headers={theaders}
                        data={Clients}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="client_id"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedClients}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
                <Box className="mt-3  md:hidden">
                    <CardsCustom
                        headers={theaders}
                        data={Clients}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="client_id"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedClients}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
            </Tab>
        </Authenticated>
    );
};

export default Client;
