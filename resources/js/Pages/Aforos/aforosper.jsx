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
import CardsCustom from "@/Components/CardCustom";
import { useNotify } from "@/Components/Toast";
import React, { useEffect } from "react";

const Afoross = ({ auth, Tramites, Aforos, Usuarios }) => {
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
        id_aforo: "",
        uso_suelo: "",
        area_construccion: "",
        local_comercial: "",
        aforo_personas: "",
        inspeccion: "",
        direccion: "",
        clave_catastral: "",
        arquitecto_responsable: "",
        id_tramite: "",
        correo_electronico: "",
        created_at: "",
        num_observaciones: "",
        ids: [],
    });

    const [showCreate, setShowCreate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editData, setEditData] = useState(null);
    const [dataToDelete, setDataToDelete] = useState(null);
    const [selectedAforos, setSelectedAforos] = useState([]);
    const notify = useNotify();
    //const [selectedestado, setSelectedEstado] = useState("");

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

    const openEditModal = (aforospersonas) => {
        setEditData(aforospersonas);
        const user = Usuarios.find((user) => user.id === aforospersonas.id_usuario);
        setData({
            id_usuario: aforospersonas.id_usuario,
            nombre_usuario: user ? user.name : "",
            id_tipotramite: aforospersonas.id_tipotramite,
            nombre_tipotramite: aforospersonas.nombre_tipotramite,
            tramite: aforospersonas.tramite,
            propietario: aforospersonas.propietario,
            fecha_ingreso: aforospersonas.fecha_ingreso,
            fecha_salida: aforospersonas.fecha_salida,
            estado_tramite: aforospersonas.estado_tramite,
            uso_suelo: aforospersonas.uso_suelo,
            area_construccion: aforospersonas.area_construccion,
            arquitecto_responsable: aforospersonas.arquitecto_responsable,
            clave_catastral: aforospersonas.clave_catastral,
            direccion: aforospersonas.direccion,
            local_comercial: aforospersonas.local_comercial,
            aforo_personas: aforospersonas.aforo_personas,
            inspeccion: aforospersonas.inspeccion,

        });
        setShowEdit(true);
    };

    const handleSubmitAdd = (e) => {
        e.preventDefault();

        post(route("aforos.store"), {
            preserveScroll: true,
            onSuccess: () => {
                closeModalCreate();
                notify("success", "Aforo agregado.");
            },
            onError: (error) => console.error(Object.values(error).join(", ")),
        });
    };
    const handleSubmitEdit = (e) => {
        e.preventDefault();

        patch(route("aforos.update", { id: editData.id_aforo }), {
            preserveScroll: true,
            onSuccess: () => {
                closeEditModal();
                notify("success", "Aforo actualizado.");
            },
            onError: (error) => console.error(Object.values(error).join(", ")),
        });
    };

    const handleDelete = (id) => {
        if (Array.isArray(id)) {
            data.ids = id;
            destroy(route("aforos.multiple.destroy"), {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedAforos([]);
                    closeDeleteModal();
                    notify("success", "Aforos eliminados.");
                },
                onError: (error) =>
                    console.error(Object.values(error).join(", ")),
            });
        } else {
            destroy(route("aforos.destroy", { id }), {
                preserveScroll: true,
                onSuccess: () => {
                    closeDeleteModal();
                    notify("success", "Aforo eliminado.");
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
    const [selectedTramiteId, setSelectedTramiteId] = useState(null);

    const handleTramiteChange = (id) => {
        setSelectedTramiteId(id);
    };
    
    useEffect(() => {
        if (selectedTramiteId) {
            const tramite = Tramites.find((t) => t.id_tramite === selectedTramiteId);
            if (tramite) {
                const user = Usuarios.find((u) => u.id === tramite.id_usuario);
                setData((prevData) => ({
                    ...prevData,
                    estado_tramite: tramite.estado_tramite,
                    id_tramite: selectedTramiteId,
                    id_usuario: tramite.id_usuario,
                    nombre_usuario: user ? user.name : "",
                    id_tipotramite: tramite.id_tipotramite,
                    nombre_tipotramite: tramite.nombre_tipotramite,
                    tramite: tramite.tramite,
                    propietario: tramite.propietario,
                    fecha_ingreso: tramite.fecha_ingreso,
                    fecha_salida: tramite.fecha_salida,
                }));
            }
        }
    }, [selectedTramiteId]);
    
  

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
            placeholder: "Arquitecto Revisor",
            type: "select",
            labelKey: "name",
            valueKey: "id",
            options: Usuarios,
            value: data.id_usuario,
            onSelect: (id) => setData("id_usuario", id),
            inputError: (
                <InputError message={errors.id_usuario} className="mt-2" />
            ),
            defaultValue: data.nombre_usuario,
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
            label: "Area contrucción",
            id: "area_construccion",
            type: "text",
            name: "area_construccion",
            value: data.area_construccion || "",
            onChange: (e) => setData("area_construccion", e.target.value),
            inputError: (
                <InputError
                    message={errors.area_construccion}
                    className="mt-2"
                />
            ),
        },
        {
            label: "Local Comercial",
            id: "local_comercial",
            type: "text",
            name: "local_comercial",
            value: data.local_comercial || "",
            onChange: (e) => setData("local_comercial", e.target.value),
            inputError: (
                <InputError
                    message={errors.local_comercial}
                    className="mt-2"
                />
            ),
        },
        {
            label: "Aforo personas",
            id: "aforo_personas",
            type: "number",
            name: "aforo_personas",
            value: data.aforo_personas || "",
            onChange: (e) => setData("aforo_personas", e.target.value),
            inputError: (
                <InputError
                    message={errors.aforo_personas}
                    className="mt-2"
                />
            ),
        },
        {
            label: "Inspección",
            id: "inspeccion",
            type: "date",
            name: "inspeccion",
            value: data.inspeccion || "",
            onChange: (e) => setData("inspeccion", e.target.value),
            inputError: (
                <InputError
                    message={errors.inspeccion}
                    className="mt-2"
                />
            ),
        },
       
    ];

    const theaders = [
        "Trámite",
        "Aforo ",
        "Propietario",
        "Fecha de Ingreso",
        "Estado",
    ];
    const searchColumns = [
        "tramite",
        "aforo_personas",
        "propietario",
        "fecha_ingreso",
        "estado_tramite",
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
        "Área de construcción",
        "Local comercial",
        "Aforo de personas",
        "Inspección",
        "# observaciones",
        "Fecha creación",
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
        "area_construccion",
        "local_comercial",
        "aforo_personas",
        "inspeccion",
        "num_observaciones",
        "created_at",
    ];

    const handleCheckboxChange = (id) => {
        setSelectedAforos((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((item) => item !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedAforos.length === Aforos.length) {
            setSelectedAforos([]);
        } else {
            setSelectedAforos(
                Aforos.map((Aforo) => Aforo.id_aforo),
            );
        }
    };

    const openDeleteModalForSelected = () => {
        setShowDelete(true);
        setDataToDelete(selectedAforos);
    };

    return (
        <Authenticated
            user={auth.user}
            header={<Header subtitle="Administrar Aforos" />}
            roles={auth.user.roles.map((role) => role.name)}
        >
            <Head title="Aforos" />
            <Tab tabs={tabs}>
            <Box>
                <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                    <div className="w-full sm:w-auto flex flex-wrap justify-center gap-2">
                        <AddButton onClick={openCreateModal} />
                        <DeleteButton
                            disabled={selectedAforos.length === 0}
                            onClick={openDeleteModalForSelected}
                        />
                    </div>
                    <ExportData
                        data={Aforos}
                        searchColumns={columnasexportar}
                            headers={theadersexsportar}
                        fileName="Aforos"
                    />
                </div>
            </Box>
            <ModalCreate
                showCreate={showCreate}
                closeModalCreate={closeModalCreate}
                title={"Añadir Aforo"}
                name={"Aforo"}
                inputs={inputstramite}
                processing={processing}
                // handleSubmitEmail= {handleSubmitEmail}
                handleSubmitAdd={handleSubmitAdd}
            />
            <DeleteModal
                showDelete={showDelete}
                closeDeleteModal={closeDeleteModal}
                title={"Borrar Aforos"}
                handleDelete={() => handleDelete(dataToDelete)}
                processing={processing}
            />
            <ModalEdit
                title="Editar PA"
                showEdit={showEdit}
                closeEditModal={closeEditModal}
                name={"Aforos"}
                inputs={inputstramite}
                processing={processing}
                handleSubmitEdit={handleSubmitEdit}
            />
            <Box className="mt-3 hidden md:block">
                <TableCustom
                    headers={theaders}
                    data={Aforos}
                    searchColumns={searchColumns}
                    columnasdetalles={columnasexportar}
                    theadersdetalles={theadersexsportar}
                    onDelete={openDeleteModal}
                    onEdit={openEditModal}
                    idKey="id_aforo"
                    onSelectChange={handleCheckboxChange}
                    selectedItems={selectedAforos}
                    onSelectAll={handleSelectAll}
                />
            </Box>
            <Box className="mt-3  md:hidden">
                <CardsCustom
                    headers={theaders}
                    data={Aforos}
                    searchColumns={searchColumns}
                    onDelete={openDeleteModal}
                    onEdit={openEditModal}
                    idKey="id_aforo"
                    onSelectChange={handleCheckboxChange}
                    selectedItems={selectedAforos}
                    onSelectAll={handleSelectAll}
                />
            </Box>
            </Tab>
        </Authenticated>
    );
};

export default Afoross;
