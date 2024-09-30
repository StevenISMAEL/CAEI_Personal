import { useState, useEffect } from "react";
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

const Trabajo = ({ auth, Tramites, Trabajosv, Usuarios }) => {
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
        id_trabajov: "",
        uso_suelo: "",
        direccion: "",
        clave_catastral: "",
        arquitecto_responsable: "",
        id_tramite: "",
        correo_electronico: "",
        num_observaciones: "",
        created_at: "",
        ids: [],
    });

    const [showCreate, setShowCreate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editData, setEditData] = useState(null);
    const [dataToDelete, setDataToDelete] = useState(null);
    const [selectedTrabajov, setSelectedTrabajov] = useState([]);
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

    const openEditModal = (trabajov) => {
        setEditData(trabajov);
        const user = Usuarios.find((user) => user.id === trabajov.id_usuario);
        setData({
            id_usuario: trabajov.id_usuario,
            nombre_usuario: user ? user.name : "",
            id_tipotramite: trabajov.id_tipotramite,
            nombre_tipotramite: trabajov.nombre_tipotramite,
            tramite: trabajov.tramite,
            propietario: trabajov.propietario,
            fecha_ingreso: trabajov.fecha_ingreso,
            fecha_salida: trabajov.fecha_salida,
            estado_tramite: trabajov.estado_tramite,
            uso_suelo: trabajov.uso_suelo,
            clave_catastral: trabajov.clave_catastral,
            arquitecto_responsable: trabajov.arquitecto_responsable,
            direccion: trabajov.direccion,

        });
        setShowEdit(true);
    };

    const handleSubmitAdd = (e) => {
        e.preventDefault();

        post(route("trabajosvar.store"), {
            preserveScroll: true,
            onSuccess: () => {
                closeModalCreate();
                notify("success", "Trabajo Vario agregado.");
            },
            onError: (error) => console.error(Object.values(error).join(", ")),
        });
    };


    const handleSubmitEdit = (e) => {
        e.preventDefault();

        patch(route("trabajosvar.update", { id: editData.id_trabajov }), {
            preserveScroll: true,
            onSuccess: () => {
                closeEditModal();
                notify("success", "Trabajo vario actualizado.");
            },
            onError: (error) => console.error(Object.values(error).join(", ")),
        });
    };

    const handleDelete = (id) => {
        if (Array.isArray(id)) {
            data.ids = id;
            destroy(route("trabajosvar.multiple.destroy"), {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedTrabajov([]);
                    closeDeleteModal();
                    notify("success", "Trabajos varios eliminados.");
                },
                onError: (error) =>
                    console.error(Object.values(error).join(", ")),
            });
        } else {
            destroy(route("trabajosvar.destroy", { id }), {
                preserveScroll: true,
                onSuccess: () => {
                    closeDeleteModal();
                    notify("success", "Trabajo vario eliminado.");
                },
                onError: (error) =>
                    console.error(Object.values(error).join(", ")),
            });
        }
    };

    
    // const handleSubmitEmail = (e) => {
    //     console.log("entrre");
    //     e.preventDefault();
    //     const detalles = {
    //         tramite: data.tramite,
    //         propietario: data.propietario,
    //         estado: data.estado_tramite,
    //         correo_electronico: data.correo_electronico,
    //     };
    //     console.log(detalles);

    //     post("/administrar-tramites/tramite/send-email", detalles, {

    //         preserveScroll: true,
    //         onError: (error) => console.error(Object.values(error).join(", ")),
    //     });
    // };


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
    ];

    const theaders = [
        "Trámite",
        "Arquitecto Resp",
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
        "Fecha de Ingreso",
        "Fecha de Salida",
        "Estado",
        "Arquitecto a cargo",
        "Dirección",
        "Uso suelo",
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
        "num_observaciones",
        "created_at",

    ];

    const handleCheckboxChange = (id) => {
        setSelectedTrabajov((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((item) => item !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedTrabajov.length === Trabajosv.length) {
            setSelectedTrabajov([]);
        } else {
            setSelectedTrabajov(
                Trabajosv.map((trabajov) => trabajov.id_trabajov),
            );
        }
    };

    const openDeleteModalForSelected = () => {
        setShowDelete(true);
        setDataToDelete(selectedTrabajov);
    };

    return (
        <Authenticated
            user={auth.user}
            header={<Header subtitle="Administrar Trabajos Varios" />}
            roles={auth.user.roles.map((role) => role.name)}
        >
            <Head title="Trabajos varios" />
            <Tab tabs={tabs}>
            <Box>
                <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                    <div className="w-full sm:w-auto flex flex-wrap justify-center gap-2">
                        <AddButton onClick={openCreateModal} />
                        <DeleteButton
                            disabled={selectedTrabajov.length === 0}
                            onClick={openDeleteModalForSelected}
                        />
                    </div>
                    <ExportData
                        data={Trabajosv}
                        searchColumns={columnasexportar}
                        headers={theadersexsportar}
                        fileName="Trabajos Varios"
                    />
                </div>
            </Box>
            <ModalCreate
                showCreate={showCreate}
                closeModalCreate={closeModalCreate}
                title={"Añadir trabajo vario"}
                name={"Trabajo Vario"}
                inputs={inputstramite}
                processing={processing}
                //   handleSubmitEmail= {handleSubmitEmail}
                handleSubmitAdd={handleSubmitAdd}
            />
            <DeleteModal
                showDelete={showDelete}
                closeDeleteModal={closeDeleteModal}
                title={"Borrar trabajos varios"}
                handleDelete={() => handleDelete(dataToDelete)}
                processing={processing}
            />
            <ModalEdit
                title="Editar trabajo vario"
                showEdit={showEdit}
                closeEditModal={closeEditModal}
                name={"Trabajo Vario"}
                inputs={inputstramite}
                processing={processing}
                handleSubmitEdit={handleSubmitEdit}
            />
            <Box className="mt-3 hidden md:block">
                <TableCustom
                    headers={theaders}
                    data={Trabajosv}
                    searchColumns={searchColumns}
                    columnasdetalles={columnasexportar}
                    theadersdetalles={theadersexsportar}
                    onDelete={openDeleteModal}
                    onEdit={openEditModal}
                    idKey="id_trabajov"
                    onSelectChange={handleCheckboxChange}
                    selectedItems={selectedTrabajov}
                    onSelectAll={handleSelectAll}
                />
            </Box>
            <Box className="mt-3  md:hidden">
                <CardsCustom
                    headers={theaders}
                    data={Trabajosv}
                    searchColumns={searchColumns}
                    onDelete={openDeleteModal}
                    onEdit={openEditModal}
                    idKey="id_trabajov"
                    onSelectChange={handleCheckboxChange}
                    selectedItems={selectedTrabajov}
                    onSelectAll={handleSelectAll}
                />
            </Box>
            </Tab>
        </Authenticated>
    );
};

export default Trabajo;
