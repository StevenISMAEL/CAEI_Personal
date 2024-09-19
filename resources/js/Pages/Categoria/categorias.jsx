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

const Categoria = ({ auth, Categorias }) => {
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
        ids: [],
    });

    const [showCreate, setShowCreate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editData, setEditData] = useState(null);
    const [dataToDelete, setDataToDelete] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState([]);
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

    const openEditModal = (categoria) => {
        setEditData(categoria);
        setData({
            nombre: categoria.nombre,
            id_categoria: categoria.id_categoria,
        });
        setShowEdit(true);
    };

    const handleSubmitAdd = (e) => {
        e.preventDefault();

        post(route("categoria.store"), {
            preserveScroll: true,
            onSuccess: () => {
                closeModalCreate();
                notify("success", "Categoría agregado.");
            },
            onError: (error) => console.error(Object.values(error).join(", ")),
        });
    };

    const handleSubmitEdit = (e) => {
        e.preventDefault();

        patch(route("categoria.update", { id: editData.id_categoria }), {
            preserveScroll: true,
            onSuccess: () => {
                closeEditModal();
                notify("success", "Categoría actualizado.");
            },
            onError: (error) => console.error(Object.values(error).join(", ")),
        });
    };

    const handleDelete = (id) => {
        if (Array.isArray(id)) {
            data.ids = id;
            destroy(route("categoria.multiple.destroy"), {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedCategory([]);
                    closeDeleteModal();
                    notify("success", "Categoría eliminados.");
                },
                onError: (error) =>
                    console.error(Object.values(error).join(", ")),
            });
        } else {
            destroy(route("categoria.destroy", { id }), {
                preserveScroll: true,
                onSuccess: () => {
                    closeDeleteModal();
                    notify("success", "Categoría eliminado.");
                },
                onError: (error) =>
                    console.error(Object.values(error).join(", ")),
            });
        }
    };

    const inputs = [
       
        {
            label: "Nombre de la categoría",
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

    const theaders = ["ID", "Nombre"];
    const searchColumns = ["id_categoria", "nombre"];

    const handleCheckboxChange = (id) => {
        setSelectedCategory((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((item) => item !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedCategory.length === Categorias.length) {
            setSelectedCategory([]);
        } else {
            setSelectedCategory(Categorias.map((categoria) => categoria.id_categoria));
        }
    };

    const openDeleteModalForSelected = () => {
        setShowDelete(true);
        setDataToDelete(selectedCategory);
    };

    return (
        <Authenticated
            user={auth.user}
            header={<Header subtitle="Administrar Categorías" />}
            roles={auth.user.roles.map((role) => role.name)}
        >
            <Head title="Categorías" />
            <Tab tabs={tabs}>
                <Box>
                    <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                        <div className="w-full sm:w-auto flex flex-wrap justify-center gap-2">
                            <AddButton onClick={openCreateModal} />
                            <DeleteButton
                                disabled={selectedCategory.length === 0}
                                onClick={openDeleteModalForSelected}
                            />
                        </div>
                        <ExportData
                            data={Categorias}
                            searchColumns={searchColumns}
                            headers={theaders}
                            fileName="Categorías"
                        />
                    </div>
                </Box>
                <ModalCreate
                    showCreate={showCreate}
                    closeModalCreate={closeModalCreate}
                    title={"Añadir Categoría"}
                    inputs={inputs}
                    processing={processing}
                    handleSubmitAdd={handleSubmitAdd}
                />
                <DeleteModal
                    showDelete={showDelete}
                    closeDeleteModal={closeDeleteModal}
                    title={"Borrar Categorías"}
                    handleDelete={() => handleDelete(dataToDelete)}
                    processing={processing}
                />
                <ModalEdit
                    title="Editar Categoría"
                    showEdit={showEdit}
                    closeEditModal={closeEditModal}
                    inputs={inputs}
                    processing={processing}
                    handleSubmitEdit={handleSubmitEdit}
                />
                <Box className="mt-3 hidden md:block">
                    <TableCustom
                        headers={theaders}
                        data={Categorias}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="id_categoria"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedCategory}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
                <Box className="mt-3  md:hidden">
                    <CardsCustom
                        headers={theaders}
                        data={Categorias}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="id_categoria"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedCategory}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
            </Tab>
        </Authenticated>
    );
};

export default Categoria;