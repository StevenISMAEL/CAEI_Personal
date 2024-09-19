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

const planosarq = ({ auth, Tramites, Planos, Usuarios }) => {
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
        id_planosarq: "",
        anteproyecto: "",
        definitivo: "",
        modificatorio: "",
        ampliatorio: "",
        uso_suelo: "",
        area_construccion: "",
        area_construccion2: "",
        direccion: "",
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
    const [selectedplanoArq, setSelectedPlanoArq] = useState([]);
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

    const openEditModal = (planoarqui) => {
        setEditData(planoarqui);
        const user = Usuarios.find((user) => user.id === planoarqui.id_usuario);
        setData({
            id_usuario: planoarqui.id_usuario,
            nombre_usuario: user ? user.name : "",
            id_tipotramite: planoarqui.id_tipotramite,
            nombre_tipotramite: planoarqui.nombre_tipotramite,
            tramite: planoarqui.tramite,
            propietario: planoarqui.propietario,
            fecha_ingreso: planoarqui.fecha_ingreso,
            fecha_salida: planoarqui.fecha_salida,
            estado_tramite: planoarqui.estado_tramite,
            anteproyecto: planoarqui.anteproyecto,
            definitivo: planoarqui.definitivo,
            modificatorio: planoarqui.modificatorio,
            ampliatorio: planoarqui.ampliatorio,
            uso_suelo: planoarqui.uso_suelo,
            area_construccion: planoarqui.area_construccion,
            area_construccion2: planoarqui.area_construccion2,
            arquitecto_responsable: planoarqui.arquitecto_responsable,
            clave_catastral: planoarqui.clave_catastral,
            direccion: planoarqui.direccion,

        });
        setShowEdit(true);
    };

    const handleSubmitAdd = (e) => {
        e.preventDefault();

        post(route("planoarq.store"), {
            preserveScroll: true,
            onSuccess: () => {
                closeModalCreate();
                notify("success", "Tramite PA agregado.");
            },
            onError: (error) => console.error(Object.values(error).join(", ")),
        });
    };
    const handleSubmitEdit = (e) => {
        e.preventDefault();

        patch(route("planoarq.update", { id: editData.id_planosarq }), {
            preserveScroll: true,
            onSuccess: () => {
                closeEditModal();
                notify("success", "Plano arquitectónico actualizado.");
            },
            onError: (error) => console.error(Object.values(error).join(", ")),
        });
    };

    const handleDelete = (id) => {
        if (Array.isArray(id)) {
            data.ids = id;
            destroy(route("planoarq.multiple.destroy"), {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedPlanoArq([]);
                    closeDeleteModal();
                    notify("success", "Trámites PA eliminados.");
                },
                onError: (error) =>
                    console.error(Object.values(error).join(", ")),
            });
        } else {
            destroy(route("planoarq.destroy", { id }), {
                preserveScroll: true,
                onSuccess: () => {
                    closeDeleteModal();
                    notify("success", "Trámite PA eliminado.");
                },
                onError: (error) =>
                    console.error(Object.values(error).join(", ")),
            });
        }
    };

    
    const handleSubmitEmail = (e) => {
        console.log("entrre");
        e.preventDefault();
        const detalles = {
            tramite: data.tramite,
            propietario: data.propietario,
            estado: data.estado_tramite,
            correo_electronico: data.correo_electronico,
        };
        console.log(detalles);

        post("/administrar-tramites/tramite/send-email", detalles, {

            preserveScroll: true,
            onError: (error) => console.error(Object.values(error).join(", ")),
        });
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
            console.log(tramite);
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
            label: "Ampliatorio",
            id: "ampliatorio",
            type: "checkbox",
            name: "ampliatorio",
            checked: data.ampliatorio || false,
            onChange: (e) => setData("ampliatorio", e.target.checked ? 1 : 0),
            inputError: (
                <InputError message={errors.ampliatorio} className="mt-2" />
            ),
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
            label: "Anteproyecto",
            id: "anteproyecto",
            type: "checkbox",
            name: "anteproyecto",
            checked: data.anteproyecto || false,
            onChange: (e) => setData("anteproyecto", e.target.checked ? 1 : 0),
            inputError: (
                <InputError message={errors.anteproyecto} className="mt-2" />
            ),
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
            label: "Definitivo",
            id: "definitivo",
            type: "checkbox",
            name: "definitivo",
            checked: data.definitivo || false,
            onChange: (e) => setData("definitivo", e.target.checked ? 1 : 0),
            inputError: (
                <InputError message={errors.definitivo} className="mt-2" />
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
            label: "Modificatorio",
            id: "modificatorio",
            type: "checkbox",
            name: "modificatorio",
            checked: data.modificatorio || false,
            onChange: (e) => setData("modificatorio", e.target.checked ? 1 : 0),
            inputError: (
                <InputError message={errors.modificatorio} className="mt-2" />
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
            label: "Area construcción (opcional)",
            id: "area_construccion",
            type: "text",
            name: "area_construccion2",
            value: data.area_construccion2 || "",
            onChange: (e) => setData("area_construccion2", e.target.value),
            inputError: (
                <InputError
                    message={errors.area_construccion2}
                    className="mt-2"
                />
            ),
        },
    ];

    const theaders = [
        "Trámite",
        "Arquitecto R",
        // "Clave Catastral",
        "Propietario",
        "Fecha de Ingreso",
        "Estado",
        // "Arquitecto a cargo",
    ];
    const searchColumns = [
        "tramite",
        "nombre_usuario",
        // "clave_catastral",
        "propietario",
        "fecha_ingreso",
        "estado_tramite",
        // "arquitecto_responsable",
    ];
    const theadersexsportar = [
        "Trámite",
        "Arquitecto R",
        "Clave Catastral",
        "Propietario",
        "Anteproyecto",
        "Definitivo",
        "Modificatorio",
        "Ampliatorio",
        "Fecha de Ingreso",
        "Fecha de Salida",
        "Estado",
        "Arquitecto a cargo",
        "Dirección",
        "Uso suelo",
        "Área de construcción",
        "Área de construcción 2",
        "Uso suelo",
    ];
    const columnasexportar = [
        "tramite",
        "nombre_usuario",
        "clave_catastral",
        "propietario",
        "anteproyecto",
        "definitivo",
        "modificatorio",
        "ampliatorio",
        "fecha_ingreso",
        "fecha_salida",
        "estado_tramite",
        "arquitecto_responsable",
        "direccion",
        "uso_suelo",
        "area_construccion",
        "area_construccion2",
        "uso_suelo",
    ];

    const handleCheckboxChange = (id) => {
        setSelectedPlanoArq((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((item) => item !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedplanoArq.length === Planos.length) {
            setSelectedPlanoArq([]);
        } else {
            setSelectedPlanoArq(
                Planos.map((planosarqui) => planosarqui.id_planosarq),
            );
        }
    };

    const openDeleteModalForSelected = () => {
        setShowDelete(true);
        setDataToDelete(selectedplanoArq);
    };

    return (
        <Authenticated
            user={auth.user}
            header={<Header subtitle="Administrar Planos Arquitectónicos" />}
            roles={auth.user.roles.map((role) => role.name)}
        >
            <Head title="Planos AR" />
            {/* <Tab tabs={tabs}> */}
            <Box>
                <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                    <div className="w-full sm:w-auto flex flex-wrap justify-center gap-2">
                        <AddButton onClick={openCreateModal} />
                        <DeleteButton
                            disabled={selectedplanoArq.length === 0}
                            onClick={openDeleteModalForSelected}
                        />
                    </div>
                    <ExportData
                        data={Planos}
                        searchColumns={columnasexportar}
                            headers={theadersexsportar}
                        fileName="Planos Arquitectónicos"
                    />
                </div>
            </Box>
            <ModalCreate
                showCreate={showCreate}
                closeModalCreate={closeModalCreate}
                title={"Añadir Trámite"}
                name={"Plano Arquitectónico"}
                inputs={inputstramite}
                processing={processing}
                handleSubmitEmail= {handleSubmitEmail}
                handleSubmitAdd={handleSubmitAdd}
            />
            <DeleteModal
                showDelete={showDelete}
                closeDeleteModal={closeDeleteModal}
                title={"Borrar Trámites"}
                handleDelete={() => handleDelete(dataToDelete)}
                processing={processing}
            />
            <ModalEdit
                title="Editar PA"
                showEdit={showEdit}
                closeEditModal={closeEditModal}
                name={"Plano Arquitectónico"}
                inputs={inputstramite}
                processing={processing}
                handleSubmitEdit={handleSubmitEdit}
            />
            <Box className="mt-3 hidden md:block">
                <TableCustom
                    headers={theaders}
                    data={Planos}
                    searchColumns={searchColumns}
                    columnasdetalles={columnasexportar}
                    theadersdetalles={theadersexsportar}
                    onDelete={openDeleteModal}
                    onEdit={openEditModal}
                    idKey="id_planosarq"
                    onSelectChange={handleCheckboxChange}
                    selectedItems={selectedplanoArq}
                    onSelectAll={handleSelectAll}
                />
            </Box>
            <Box className="mt-3  md:hidden">
                <CardsCustom
                    headers={theaders}
                    data={Planos}
                    searchColumns={searchColumns}
                    onDelete={openDeleteModal}
                    onEdit={openEditModal}
                    idKey="id_planosarq"
                    onSelectChange={handleCheckboxChange}
                    selectedItems={selectedplanoArq}
                    onSelectAll={handleSelectAll}
                />
            </Box>
            {/* </Tab> */}
        </Authenticated>
    );
};

export default planosarq;
