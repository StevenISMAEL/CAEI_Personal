import { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import Header from "@/Components/Header";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import Tab from "@/Layouts/TabLayout";
import { AddButton, DeleteButton } from "@/Components/CustomButtons";
import InputError from "@/Components/InputError";
import ModalCreate from "@/Components/ModalCreateTypes";
import ModalEdit from "@/Components/ModalEditType";
import Box from "@/Layouts/Box";
import ExportData from "@/Components/ExportData";
import tabs from "./tabs";
import DeleteModal from "@/Components/DeleteModal";
import TableCustom from "@/Components/TableCustomDetails";
import CardsCustom from "@/Components/CardCustomDetails";
import { useNotify } from "@/Components/Toast";

const fraccionamientosu = ({ auth, Tramites, Fraccionamientos, Usuarios }) => {
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
        id_usuario: "",
        nombre_usuario: "",
        id_tipotramite: "",
        nombre_tipotramite: "",
        tramite: "",
        propietario: "",
        fecha_ingreso: "",
        fecha_salida: "",
        estado_tramite: "",
        id_fraccionamiento: "",
        uso_suelo: "",
        direccion: "",
        area_aprobada: "",
        clave_catastral: "",
        arquitecto_responsable: "",
        id_tramite: "",
        correo_electronico: "",
        ids: [],
    });

    const [showCreate, setShowCreate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editData, setEditData] = useState(null);
    const [dataToDelete, setDataToDelete] = useState(null);
    const [selectedFraccionamiento, setSelectedFraccionamiento] = useState([]);
    const notify = useNotify();

    const handleChangeEstado = (value) => {
        setData((prevData) => ({
            ...prevData,
            estado_tramite: value,
        }));
    };
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

    const openEditModal = (fracciona) => {
        setEditData(fracciona);
        const user = Usuarios.find((user) => user.id === fracciona.id_usuario);
        setData({
            id_usuario: fracciona.id_usuario,
            nombre_usuario: user ? user.name : "",
            id_tipotramite: fracciona.id_tipotramite,
            nombre_tipotramite: fracciona.nombre_tipotramite,
            tramite: fracciona.tramite,
            propietario: fracciona.propietario,
            fecha_ingreso: fracciona.fecha_ingreso,
            fecha_salida: fracciona.fecha_salida,
            estado_tramite: fracciona.estado_tramite,
            uso_suelo: fracciona.uso_suelo,
            area_aprobada: fracciona.area_aprobada,
            clave_catastral: fracciona.clave_catastral,
            arquitecto_responsable: fracciona.arquitecto_responsable,
            direccion: fracciona.direccion,
        });
        setShowEdit(true);
    };

    const handleSubmitAdd = (e) => {
        e.preventDefault();

        post(route("fraccionamiento.store"), {
            preserveScroll: true,
            onSuccess: () => {
                closeModalCreate();
                notify("success", "Fraccionamiento agregado.");
            },
            onError: (error) => console.error(Object.values(error).join(", ")),
        });
    };
    const handleSubmitEdit = (e) => {
        e.preventDefault();

        patch(
            route("fraccionamiento.update", {
                id: editData.id_fraccionamiento,
            }),
            {
                preserveScroll: true,
                onSuccess: () => {
                    closeEditModal();
                    notify("success", "Fraccionamiento actualizado.");
                },
                onError: (error) =>
                    console.error(Object.values(error).join(", ")),
            },
        );
    };

    const handleDelete = (id) => {
        if (Array.isArray(id)) {
            data.ids = id;
            destroy(route("fraccionamiento.multiple.destroy"), {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedFraccionamiento([]);
                    closeDeleteModal();
                    notify("success", "Fraccionamiento eliminados.");
                },
                onError: (error) =>
                    console.error(Object.values(error).join(", ")),
            });
        } else {
            destroy(route("fraccionamiento.destroy", { id }), {
                preserveScroll: true,
                onSuccess: () => {
                    closeDeleteModal();
                    notify("success", "Fraccionamiento eliminado.");
                },
                onError: (error) =>
                    console.error(Object.values(error).join(", ")),
            });
        }
    };

    const transformForCombobox = (arrays) => {
        return arrays.map((array) => ({
            value: array,
            label: `${array}`,
        }));
    };
    const comboboxestado = transformForCombobox([
        "Revisión",
        "Observación",
        "Negado",
        "Aprobado",
    ]);
    
    const handleTramiteChange = (id) => {
        
        const tramite = Tramites.find((t) => t.id_tramite === id);
        
        if (tramite) {
            const user = Usuarios.find((u) => u.id === tramite.id_usuario);
            const newData = {
                estado_tramite: tramite.estado_tramite,
                id_tramite: id,
                id_usuario: tramite.id_usuario,
                nombre_usuario: user ? user.name : "",
                id_tipotramite: tramite.id_tipotramite,
                nombre_tipotramite: tramite.nombre_tipotramite,
                tramite: tramite.tramite,
                propietario: tramite.propietario,
                fecha_ingreso: tramite.fecha_ingreso,
                fecha_salida: tramite.fecha_salida,
            };
            setData(newData);
        }

    };
  

    const inputstramite = [
        {
            placeholder: "Trámite",
            type: "select",
            labelKey: "tramite",
            valueKey: "id_tramite",
            options: Tramites,
            id: "id_tramite",
            value: data.id_tramite,
            onSelect: handleTramiteChange,
            inputError: (
                <InputError message={errors.id_tramite} className="mt-2" />
            ),
            defaultValue: data.tramite,
        },
        {
            type: "combobox",
            label: "Estado del Trámite",
            id: "estado_tramite",
            options: comboboxestado,
            value: data.estado_tramite,
            onChange: handleChangeEstado,
            inputError: (
                <InputError message={errors.estado_tramite} className="mt-2" />
            ),
            defaultValue: data.estado_tramite,
        },
        {
            label: "Fecha de Ingreso",
            id: "fecha_ingreso",
            type: "date",
            name: "fecha_ingreso",
            disabled: true,
            value: data.fecha_ingreso || "",
            onChange: (e) => setData("fecha_ingreso", e.target.value),
            inputError: (
                <InputError message={errors.fecha_ingreso} className="mt-2" />
            ),
            defaultValue: data.fecha_ingreso,
        },
        {
            placeholder: "Arquitecto Revisor",
            type: "select",
            labelKey: "name",
            valueKey: "id",
            options: Usuarios,
            onSelect: (id) => setData("id_usuario", id),

            inputError: (
                <InputError message={errors.id_usuario} className="mt-2" />
            ),
            defaultValue: data.nombre_usuario,
        },
        {
            label: "Propietario",
            id: "propietario",
            type: "text",
            name: "propietario",
            value: data.propietario || "",
            onChange: (e) => setData("propietario", e.target.value),
            inputError: (
                <InputError message={errors.propietario} className="mt-2" />
            ),

            defaultValue: data.propietario,
        },
        {
            label: "Arquitecto Responsable",
            id: "arquitecto_responsable",
            type: "text",
            name: "arquitecto_responsable",
            value: data.arquitecto_responsable || "",
            onChange: (e) => setData("arquitecto_responsable", e.target.value),
            inputError: (
                <InputError
                    message={errors.arquitecto_responsable}
                    className="mt-2"
                />
            ),
        },
        {
            label: "Fecha de salida",
            id: "fecha_salida",
            type: "date",
            name: "fecha_salida",
            value: data.fecha_salida || "",
            onChange: (e) => setData("fecha_salida", e.target.value),
            inputError: (
                <InputError message={errors.fecha_salida} className="mt-2" />
            ),
            defaultValue: data.fecha_salida,
        },
        {
            label: "Clave Catastral",
            id: "clave_catastral",
            type: "text",
            name: "clave_catastral",
            value: data.clave_catastral || "",
            onChange: (e) => setData("clave_catastral", e.target.value),
            inputError: (
                <InputError message={errors.clave_catastral} className="mt-2" />
            ),
        },
        {
            label: "Dirección",
            id: "direccion",
            type: "text",
            name: "direccion",
            value: data.direccion || "",
            onChange: (e) => setData("direccion", e.target.value),
            inputError: (
                <InputError message={errors.direccion} className="mt-2" />
            ),
        },
        {
            label: "Uso suelo",
            id: "uso_suelo",
            type: "text",
            name: "uso_suelo",
            value: data.uso_suelo || "",
            onChange: (e) => setData("uso_suelo", e.target.value),
            inputError: (
                <InputError message={errors.uso_suelo} className="mt-2" />
            ),
        },
        {
            label: "Area aprobada",
            id: "area_aprobada",
            type: "text",
            name: "area_aprobada",
            value: data.area_aprobada || "",
            onChange: (e) => setData("area_aprobada", e.target.value),
            inputError: (
                <InputError message={errors.area_aprobada} className="mt-2" />
            ),
        },
    ];

    const theaders = [
        "Trámite",
        "Propietario",
        "Fecha de Ingreso",
        "Uso suelo",
    ];
    const searchColumns = [
        "tramite",
        "propietario",
        "fecha_ingreso",
        "uso_suelo",
    ];
    const theadersexsportar = [
        "Trámite",
        "Arquitecto R",
        "Clave Catastral",
        "Propietario",
        "Fecha de Ingreso",
        "Fecha de Salida",
        "Estado",
        "Arquitecto a cargo",
        "Dirección",
        "Uso suelo",
        "Area aprobada",
    ];
    const columnasexportar = [
        "tramite",
        "nombre_usuario",
        "clave_catastral",
        "propietario",
        "fecha_ingreso",
        "fecha_salida",
        "estado_tramite",
        "arquitecto_responsable",
        "direccion",
        "uso_suelo",
        "area_aprobada",
    ];

    const handleCheckboxChange = (id) => {
        setSelectedFraccionamiento((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((item) => item !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedFraccionamiento.length === Fraccionamientos.length) {
            setSelectedFraccionamiento([]);
        } else {
            setSelectedFraccionamiento(
                Fraccionamientos.map(
                    (fraccionsuelo) => fraccionsuelo.id_fraccionamiento,
                ),
            );
        }
    };

    const openDeleteModalForSelected = () => {
        setShowDelete(true);
        setDataToDelete(selectedFraccionamiento);
    };

    return (
        <Authenticated
            user={auth.user}
            header={<Header subtitle="Administrar Fraccionamientos" />}
            roles={auth.user.roles.map((role) => role.name)}
        >
            <Head title="Fraccionamientos" />
            <Tab tabs={tabs}>
                <Box>
                    <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                        <div className="w-full sm:w-auto flex flex-wrap justify-center gap-2">
                            <AddButton onClick={openCreateModal} />
                            <DeleteButton
                                disabled={selectedFraccionamiento.length === 0}
                                onClick={openDeleteModalForSelected}
                            />
                        </div>
                        <ExportData
                            data={Fraccionamientos}
                            searchColumns={columnasexportar}
                            headers={theadersexsportar}
                            fileName="Fraccionamientos"
                        />
                    </div>
                </Box>
                <ModalCreate
                    showCreate={showCreate}
                    closeModalCreate={closeModalCreate}
                    title={"Añadir Fraccionamiento"}
                    name={"Fraccionamiento"}
                    inputs={inputstramite}
                    processing={processing}
                    handleSubmitAdd={handleSubmitAdd}
                />
                <DeleteModal
                    showDelete={showDelete}
                    closeDeleteModal={closeDeleteModal}
                    title={"Borrar Fraccionamientos"}
                    handleDelete={() => handleDelete(dataToDelete)}
                    processing={processing}
                />
                <ModalEdit
                    title="Editar Fraccionamiento"
                    showEdit={showEdit}
                    closeEditModal={closeEditModal}
                    name={"Fraccionamiento"}
                    inputs={inputstramite}
                    processing={processing}
                    handleSubmitEdit={handleSubmitEdit}
                />
                <Box className="mt-3 hidden md:block">
                    <TableCustom
                        headers={theaders}
                        data={Fraccionamientos}
                        searchColumns={searchColumns}
                        columnasdetalles={columnasexportar}
                        theadersdetalles={theadersexsportar}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="id_fraccionamiento"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedFraccionamiento}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
                <Box className="mt-3  md:hidden">
                    <CardsCustom
                        headers={theaders}
                        data={Fraccionamientos}
                        searchColumns={searchColumns}
                        columnasexportar={columnasexportar}
                        theadersexsportar={theadersexsportar}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="id_fraccionamiento"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedFraccionamiento}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
            </Tab>
        </Authenticated>
    );
};

export default fraccionamientosu;
