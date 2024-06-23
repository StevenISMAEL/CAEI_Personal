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

const Address = ({ auth, Parishes, Addresses }) => {
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
        parish_id: "",
        address: "",
        reference: "",
        neighborhood: "",
        ids: [],
    });

    const [showCreate, setShowCreate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editData, setEditData] = useState(null);
    const [dataToDelete, setDataToDelete] = useState(null);
    const [selectedAddresses, setSelectedAddresses] = useState([]);

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
    const openEditModal = (address) => {
        setShowEdit(true);
        setEditData(address);
        setData({
            parish_id: address.parish_id,
            address: address.address,
            reference: address.reference,
            neighborhood: address.neighborhood,
        });
    };

    const handleSubmitAdd = (e) => {
        e.preventDefault();

        post(route("addresses.store"), {
            preserveScroll: true,
            onSuccess: () => closeModalCreate(),
            onError: (error) => console.log(error),
            onFinish: () => reset(),
        });
    };

    const handleSubmitEdit = (e) => {
        e.preventDefault();

        patch(route("addresses.update", { id: editData.address_id }), {
            preserveScroll: true,
            onSuccess: () => closeEditModal(),
            onError: (error) => console.log(error),
            onFinish: () => reset(),
        });
    };

    const handleDelete = (id) => {
        if (Array.isArray(id)) {
            data.ids = id;
            destroy(route("addresses.multiple.destroy"), {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedAddresses([]);
                    closeDeleteModal();
                },
                onError: (error) => console.error(error),
                onFinish: () => reset(),
            });
        } else {
            destroy(route("addresses.destroy", { id }), {
                preserveScroll: true,
                onSuccess: () => closeDeleteModal(),
                onError: (error) => console.error(error),
                onFinish: () => reset(),
            });
        }
    };

    const inputs = [
        {
            label: "Dirección",
            id: "address",
            type: "text",
            name: "address",
            value: data.address,
            onChange: (e) => setData("address", e.target.value),
            inputError: (
                <InputError message={errors.address} className="mt-2" />
            ),
            defaultValue: data.address,
        },
        {
            placeholder: "Parroquia",
            type: "select",
            labelKey: "parish_name",
            valueKey: "parish_id",
            options: Parishes,
            onSelect: (id) => setData("parish_id", id),
            inputError: (
                <InputError message={errors.parish_id} className="mt-2" />
            ),
            defaultValue: data.parish_id,
        },
        {
            label: "Referencia",
            id: "reference",
            type: "text",
            name: "reference",
            value: data.reference,
            onChange: (e) => setData("reference", e.target.value),
            inputError: (
                <InputError message={errors.reference} className="mt-2" />
            ),
            defaultValue: data.reference,
        },
        {
            label: "Vecindario",
            id: "neighborhood",
            type: "text",
            name: "neighborhood",
            value: data.neighborhood,
            onChange: (e) => setData("neighborhood", e.target.value),
            inputError: (
                <InputError message={errors.neighborhood} className="mt-2" />
            ),
            defaultValue: data.neighborhood,
        },
    ];

    const theaders = [
        "ID",
        "Direccion",
        "Parroquia",
        "Referencias",
        "Vecindario",
    ];
    const searchColumns = [
        "address_id",
        "address",
        "parish_name",
        "reference",
        "neighborhood",
    ];

    const handleCheckboxChange = (id) => {
        setSelectedAddresses((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((item) => item !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedAddresses.length === Addresses.length) {
            setSelectedAddresses([]);
        } else {
            setSelectedAddresses(Addresses.map((address) => address.address_id));
        }
    };

    const openDeleteModalForSelected = () => {
        setShowDelete(true);
        setDataToDelete(selectedAddresses);
    };

    return (
        <Authenticated
            user={auth.user}
            header={<Header subtitle="Manage Addresses" />}
            roles={auth.user.roles.map((role) => role.name)}
        >
            <Head title="Direcciones" />
            <Tab tabs={tabs}>
                <Box>
                    <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                        <div className="w-full sm:w-auto flex flex-wrap justify-center gap-2">
                            <AddButton onClick={openCreateModal} />
                            <DeleteButton
                                disabled={selectedAddresses.length === 0}
                                onClick={openDeleteModalForSelected}
                            />
                        </div>
                        <ExportData
                            data={Addresses}
                            searchColumns={searchColumns}
                            headers={theaders}
                        />
                    </div>
                </Box>
                <ModalCreate
                    showCreate={showCreate}
                    closeModalCreate={closeModalCreate}
                    title={"Add Addresses"}
                    inputs={inputs}
                    processing={processing}
                    handleSubmitAdd={handleSubmitAdd}
                />
                <DeleteModal
                    showDelete={showDelete}
                    closeDeleteModal={closeDeleteModal}
                    title={"Delete Addresses"}
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
                        data={Addresses}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="address_id"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedAddresses}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
                <Box className="mt-3  md:hidden">
                    <CardsCustom
                        headers={theaders}
                        data={Addresses}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="address_id"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedAddresses}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
            </Tab>
        </Authenticated>
    );
};

export default Address;
