import { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import Header from "@/Components/Header";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import Tab from "@/Layouts/TabLayout";
import { AddButton, DeleteButton } from "@/Components/CustomButtons";
import InputError from "@/Components/InputError";
import ModalCreate from "@/Components/TramiteModal";
import ModalEdit from "@/Components/ModalEdit";
import Box from "@/Layouts/Box";
import ExportData from "@/Components/ExportData";
import tabs from "./tabs";
import DeleteModal from "@/Components/DeleteModal";
import TableCustom from "@/Components/TableCustom";
import CardsCustom from "@/Components/CardCustom";
import { useNotify } from "@/Components/Toast";

const Tramite = ({ auth, Tramites, TiposTramite, Usuarios }) => {
    console.log(Tramites);
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
        nombre_usuario:"",
        id_tipotramite: "",
        nombre_tipotramite:"",
        tramite: "",
        propietario: "",
        detalle: "",
        fecha_ingreso: "",
        fecha_salida : "",
        informe: "",
        entregado: "",
        fecha_entrega : "",
        reasignado : "",
        fecha_reasignacion : "",
        estado_ingreso: "",
        estado_tramite: "",
        ids: [],
    });

    const [showCreate, setShowCreate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editData, setEditData] = useState(null);
    const [dataToDelete, setDataToDelete] = useState(null);
    const [selectedTramites, setSelectedTramites] = useState([]);
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


    const openEditModal = (tramite) => {
        setEditData(tramite);
        const user = Usuarios.find((user) => user.id === tramite.id_usuario);
        setData({
            id_usuario: tramite.id_usuario,
            nombre_usuario: user? user.name: "",
            id_tipotramite: tramite.id_tipotramite,
            nombre_tipotramite: tramite.nombre_tipotramite,
            tramite: tramite.tramite,
            propietario: tramite.propietario,
            detalle: tramite.detalle,
            fecha_ingreso: tramite.fecha_ingreso,
            estado_ingreso: tramite.estado_ingreso,
            estado_tramite: tramite.estado_tramite,
            fecha_salida: tramite.fecha_salida,
            reasignado: tramite.reasignado,
            fecha_reasignacion: tramite.fecha_reasignacion,
            informe: tramite.informe,
            entregado: tramite.entregado,
            fecha_entrega: tramite.fecha_entrega,

        });
        setShowEdit(true);
    };

    const handleSubmitAdd = (e) => {
        e.preventDefault();

        post(route("tramite.store"), {
            preserveScroll: true,
            onSuccess: () => {
                closeModalCreate();
                notify("success", "Trámite agregado.");
            },
            onError: (error) => console.error(Object.values(error).join(", ")),
        });
    };

    const handleSubmitEdit = (e) => {
        e.preventDefault();

        patch(route("tramite.update", { id: editData.id_tramite }), {
            preserveScroll: true,
            onSuccess: () => {
                closeEditModal();
                notify("success", "Trámite actualizado.");
            },
            onError: (error) => console.error(Object.values(error).join(", ")),
        });
    };

    const handleDelete = (id) => {
        if (Array.isArray(id)) {
            data.ids = id;
            destroy(route("tramite.multiple.destroy"), {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedTramites([]);
                    closeDeleteModal();
                    notify("success", "Trámites eliminados.");
                },
                onError: (error) =>
                    console.error(Object.values(error).join(", ")),
            });
        } else {
            destroy(route("tramite.destroy", { id }), {
                preserveScroll: true,
                onSuccess: () => {
                    closeDeleteModal();
                    notify("success", "Trámite eliminado.");
                },
                onError: (error) =>
                    console.error(Object.values(error).join(", ")),
            });
        }
    };

    const inputstramite = [
        {
            label: "Trámite",
            id: "tramite",
            type: "text",
            name: "tramite",
            value: data.tramite|| "",
            onChange: (e) => setData("tramite", e.target.value),
            inputError: (
                <InputError message={errors.tramite} className="mt-2" />
            ),
        },
        {
            label: "Estado de Ingreso",
            id: "estado_ingreso",
            type: "text",
            name: "estado_ingreso",
            value: data.estado_ingreso|| "",
            onChange: (e) => setData("estado_ingreso", e.target.value),
            inputError: (
                <InputError message={errors.estado_ingreso} className="mt-2" />
            ),
        },
        {
            placeholder: "Tipo de Trámite",
            type: "select",
            labelKey: "nombre",
            valueKey: "id_tipotramite",
            options: TiposTramite,
            onSelect: (id) => setData("id_tipotramite", id),
            inputError: (
                <InputError message={errors.id_tipotramite} className="mt-2" />
            ),
            defaultValue: data.nombre_tipotramite,
        },
        {
            label: "Propietario",
            id: "propietario",
            type: "text",
            name: "propietario",
            value: data.propietario|| "",
            onChange: (e) => setData("propietario", e.target.value),
            inputError: (
                <InputError message={errors.propietario} className="mt-2" />
            ),
        },
         {
            placeholder: "Usuario",
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
            label: "Detalle",
            id: "detalle",
            type: "text",
            name: "detalle",
            value: data.detalle|| "",
            onChange: (e) => setData("detalle", e.target.value),
            inputError: (
                <InputError message={errors.detalle} className="mt-2" />
            ),
        },
        {
            label: "Fecha de Ingreso",
            id: "fecha_ingreso",
            type: "date",
            name: "fecha_ingreso",
            value: data.fecha_ingreso|| "",
            onChange: (e) => setData("fecha_ingreso", e.target.value),
            inputError: (
                <InputError message={errors.fecha_ingreso} className="mt-2" />
            ),
        },
        {
            label: "Fecha de salida",
            id: "fecha_salida",
            type: "date",
            name: "fecha_salida",
            value: data.fecha_salida|| "",
            onChange: (e) => setData("fecha_salida", e.target.value),
            inputError: (
                <InputError message={errors.fecha_salida} className="mt-2" />
            ),
        },
        {
            label: "Estado del Trámite",
            id: "estado_tramite",
            type: "text",
            name: "estado_tramite",
            value: data.estado_tramite|| "",
            onChange: (e) => setData("estado_tramite", e.target.value),
            inputError: (
                <InputError message={errors.estado_tramite} className="mt-2" />
            ),
        },
        
    ];
    const inputsclaves =[
         
        {
            label: "informe",
            id: "informe",
            type: "text",
            name: "informe",
            value: data.informe|| "",
            onChange: (e) => setData("informe", e.target.value),
            inputError: (
                <InputError message={errors.informe} className="mt-2" />
            ),
        },
        {
            label:"Entregado",
            id: "entregado",
            type: "text",
            name: "entregado",
            value: data.entregado|| "",
            onChange: (e) => setData("entregado", e.target.value),
            inputError: (
                <InputError message={errors.entregado} className="mt-2" />
            ),
        },
        {
            label: "Fecha de entrega",
            id: "fecha_entrega",
            type: "date",
            name: "fecha_entrega",
            value: data.fecha_entrega|| "",
            onChange: (e) => setData("fecha_entrega", e.target.value),
            inputError: (
                <InputError message={errors.fecha_entrega} className="mt-2" />
            ),
        },
        {
            label:"Reasignado",
            id: "reasignado",
            type: "text",
            name: "reasignado",
            value: data.reasignado|| "",
            onChange: (e) => setData("reasignado", e.target.value),
            inputError: (
                <InputError message={errors.reasignado} className="mt-2" />
            ),
        },
        {
            label: "Fecha de reasignación",
            id: "fecha_reasignacion",
            type: "date",
            name: "fecha_reasignacion",
            value: data.fecha_reasignacion|| "",
            onChange: (e) => setData("fecha_reasignacion", e.target.value),
            inputError: (
                <InputError message={errors.fecha_reasignacion} className="mt-2" />
            ),
        },
    ];

    const theaders = [ "Trámite",  "Arquiecto R", "Tipo de Trámite", "Propietario", "Fecha de Ingreso", "Estado"];
    const searchColumns = [ "tramite","nombre_usuario", "nombre_tipotramite",  "propietario", "fecha_ingreso", "estado_tramite"];

    const handleCheckboxChange = (id) => {
        setSelectedTramites((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((item) => item !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedTramites.length === Tramites.length) {
            setSelectedTramites([]);
        } else {
            setSelectedTramites(Tramites.map((tramite) => tramite.id_tramite));
        }
    };

    const openDeleteModalForSelected = () => {
        setShowDelete(true);
        setDataToDelete(selectedTramites);
    };

    return (
        <Authenticated
            user={auth.user}
            header={<Header subtitle="Administrar Trámites" />}
            roles={auth.user.roles.map((role) => role.name)}
        >
            <Head title="Trámites" />
            <Tab tabs={tabs}>
                <Box>
                    <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                        <div className="w-full sm:w-auto flex flex-wrap justify-center gap-2">
                            <AddButton onClick={openCreateModal} />
                            <DeleteButton
                                disabled={selectedTramites.length === 0}
                                onClick={openDeleteModalForSelected}
                            />
                        </div>
                        <ExportData
                            data={Tramites}
                            searchColumns={searchColumns}
                            headers={theaders}
                            fileName="Tramites"
                        />
                    </div>
                </Box>
                <ModalCreate
                    showCreate={showCreate}
                    closeModalCreate={closeModalCreate}
                    title={"Añadir Trámite"}
                    inputsclaves={inputsclaves}
                    inputstramite={inputstramite}
                    processing={processing}
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
                    title="Editar Trámite"
                    showEdit={showEdit}
                    closeEditModal={closeEditModal}
                    inputs={inputstramite}
                    processing={processing}
                    handleSubmitEdit={handleSubmitEdit}
                />
                <Box className="mt-3 hidden md:block">
                    <TableCustom
                        headers={theaders}
                        data={Tramites}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="id_tramite"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedTramites}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
                <Box className="mt-3  md:hidden">
                    <CardsCustom
                        headers={theaders}
                        data={Tramites}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="id_tramite"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedTramites}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
            </Tab>
        </Authenticated>
    );
};

export default Tramite;