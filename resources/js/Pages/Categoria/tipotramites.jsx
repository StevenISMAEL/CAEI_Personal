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
import { useNotify } from "@/Components/Toast";

const tipoTramite = ({ auth, TipoTramites, Categorias }) => {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        delete: destroy,
        patch,
        clearErrors,
    } = useForm({
        nombre: "",
        id_categoria: "",
        id_tipotramite:"",
        nombrecategoria:"",
        ids: [],
    });

    const [showCreate, setShowCreate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editData, setEditData] = useState(null);
    const [dataToDelete, setDataToDelete] = useState(null);
    const [selectedtypeprocess, setSelectedtypeprocess] = useState([]);
    const notify = useNotify();

    const closeModalCreate = () => {
        clearErrors();
        setShowCreate(false);
        reset();
    };

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
        clearErrors();
        setShowEdit(false);
        setEditData(null);
        reset();
    };

    const openEditModal = (tipotramite) => {
        setEditData(tipotramite);
        
        setData({
            nombre: tipotramite.nombre,
            id_categoria: tipotramite.id_categoria,
            id_tipotramite: tipotramite.id_tipotramite,
            nombrecategoria: tipotramite.nombrecategoria,

        });
        setShowEdit(true);
    };
    const handleSubmitAdd = (e) => {
        e.preventDefault();

        post(route("tipotramite.store"), {
            preserveScroll: true,
            onSuccess: () => {
                closeModalCreate();
                notify("success", "Tipo de tramite agregado.");
            },
            onError: (error) => console.error(Object.values(error).join(", ")),
        });
    };

    const handleSubmitEdit = (e) => {
        e.preventDefault();

        patch(route("tipotramite.update", { id: editData.id_tipotramite }), {
            preserveScroll: true,
            onSuccess: () => {
                closeEditModal();
                notify("success", "Tipo de trámite actualizado.");
            },
            onError: (error) => console.error(Object.values(error).join(", ")),
        });
    };

    const handleDelete = (id) => {
        if (Array.isArray(id)) {
            data.ids = id;
            destroy(route("tipotramite.multiple.destroy"), {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedtypeprocess([]);
                    closeDeleteModal();
                    notify("success", "Tipo de trámite eliminados.");
                },
                onError: (error) =>
                    console.error(Object.values(error).join(", ")),
            });
        } else {
            destroy(route("tipotramite.destroy", { id }), {
                preserveScroll: true,
                onSuccess: () => {
                    closeDeleteModal();
                    notify("success", "Tipo de trámite eliminado.");
                },
                onError: (error) =>
                    console.error(Object.values(error).join(", ")),
            });
        }
    };

    const inputs = [
       
        {
            placeholder: "Categoría",
            type: "select",
            labelKey: "nombre",
            valueKey: "id_categoria",
            options: Categorias,
            onSelect: (id) => setData("id_categoria", id),
            inputError: (
                <InputError message={errors.id_categoria} className="mt-2" />
            ),
            defaultValue: data.nombrecategoria,
        },
        {
            label: "Nombre",
            id: "nombre",
            type: "text",
            name: "nombre",
            value: data.nombre,
            onChange: (e) => setData("nombre", e.target.value),
            inputError: (
                <InputError message={errors.nombre} className="mt-2" />
            ),
            defaultValue: data.nombre,
        },
    ];

    const theaders = ["Nombre de la Categoria", "Tipo de trámite"];
    const searchColumns = ["nombrecategoria", "nombre"];

    const handleCheckboxChange = (id) => {
        setSelectedtypeprocess((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((item) => item !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedtypeprocess.length === TipoTramites.length) {
            setSelectedtypeprocess([]);
        } else {
            setSelectedtypeprocess(TipoTramites.map((tipotramite) => tipotramite.id_tipotramite));
        }
    };

    const openDeleteModalForSelected = () => {
        setShowDelete(true);
        setDataToDelete(selectedtypeprocess);
    };

    return (
        <Authenticated
            user={auth.user}
            header={<Header subtitle="Administrar Tipos de Trámites" />}
            roles={auth.user.roles.map((role) => role.name)}
        >
            <Head title="Tipos de Trámites" />
            <Tab tabs={tabs}>
                <Box>
                    <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                        <div className="w-full sm:w-auto flex flex-wrap justify-center gap-2">
                            <AddButton onClick={openCreateModal} />
                            <DeleteButton
                                disabled={selectedtypeprocess.length === 0}
                                onClick={openDeleteModalForSelected}
                            />
                        </div>
                        <ExportData
                            data={TipoTramites}
                            searchColumns={searchColumns}
                            headers={theaders}
                            fileName="Tipos de Trámites"
                        />
                    </div>
                </Box>
                <ModalCreate
                    showCreate={showCreate}
                    closeModalCreate={closeModalCreate}
                    title={"Añadir Tipo de Trámites"}
                    inputs={inputs}
                    processing={processing}
                    handleSubmitAdd={handleSubmitAdd}
                />
                <DeleteModal
                    showDelete={showDelete}
                    closeDeleteModal={closeDeleteModal}
                    title={"Borrar Tipo de Trámites"}
                    handleDelete={() => handleDelete(dataToDelete)}
                    processing={processing}
                />
                <ModalEdit
                    title="Editar Tipo de Trámite"
                    showEdit={showEdit}
                    closeEditModal={closeEditModal}
                    inputs={inputs}
                    processing={processing}
                    handleSubmitEdit={handleSubmitEdit}
                />
                <Box className="mt-3 hidden md:block">
                    <TableCustom
                        headers={theaders}
                        data={TipoTramites}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="id_tipotramite"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedtypeprocess}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
                <Box className="mt-3  md:hidden">
                    <CardsCustom
                        headers={theaders}
                        data={TipoTramites}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="id_tipotramite"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedtypeprocess}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
            </Tab>
        </Authenticated>
    );
};

export default tipoTramite;