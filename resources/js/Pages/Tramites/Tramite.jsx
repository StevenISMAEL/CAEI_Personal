import { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import Header from "@/Components/Header";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import Tab from "@/Layouts/TabLayout";
import { AddButton, DeleteButton } from "@/Components/CustomButtons";
import InputError from "@/Components/InputError";
import ModalCreate from "@/Components/TramiteModal";
import ModalEdit from "@/Components/ModalEditPA";
import Box from "@/Layouts/Box";
import ExportData from "@/Components/ExportData";
import tabs from "./tabs";
import DeleteModal from "@/Components/DeleteModal";
import TableCustom from "@/Components/TableCustomDetails";
import CardsCustom from "@/Components/CardCustom";
import { useNotify } from "@/Components/Toast";

const Tramite = ({ auth, Tramites, TiposTramite, Usuarios, Categorias }) => {
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
        id_tramite: "",
        nombre_usuario: "",
        id_tipotramite: "",
        nombre_tipotramite: "",
        tramite: "",
        propietario: "",
        fecha_ingreso: "",
        fecha_salida: "",
        informe: "",
        entregado: "",
        fecha_entrega: "",
        reasignado: "",
        fecha_reasignacion: "",
        estado_ingreso: "",
        estado_tramite: "",
        correo_electronico: "",
        nombre_categoria: "",
        id_categoria: "",
        ids: [],
    });

    const [showCreate, setShowCreate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editData, setEditData] = useState(null);
    const [dataToDelete, setDataToDelete] = useState(null);
    const [selectedTramites, setSelectedTramites] = useState([]);
    const [selectedingreso, setSelectedIngreso] = useState("");
    const [selectedestado, setSelectedEstado] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [filteredTypes, setFilteredTypes] = useState([]);

    const notify = useNotify();

    const closeModalCreate = () => {
        clearErrors();
        setShowCreate(false);
        reset();
    };

    const openCreateModal = () => {
        setData("estado_ingreso", "");
        setData("id_categoria", "");
        setShowCreate(true);
    };

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
        // Si ya tienes el id_tipotramite, buscar el tipo de trámite
        const tipoTramite = TiposTramite.find(
            (tipo) => tipo.id_tipotramite === tramite.id_tipotramite,
        );

        // Si el tipo de trámite existe, buscar la categoría por el id_categoria del tipo de trámite
        const categoria = tipoTramite
            ? Categorias.find(
                  (categoria) =>
                      categoria.id_categoria === tipoTramite.id_categoria,
              )
            : null;

            console.log(categoria);
        setData({
            id_tramite: tramite.id_tramite,
            id_usuario: tramite.id_usuario,
            nombre_usuario: user ? user.name : "",
            id_tipotramite: tramite.id_tipotramite,
            nombre_tipotramite: tramite.nombre_tipotramite,
            nombre_categoria: categoria ? categoria.nombre : "",
            tramite: tramite.tramite,
            propietario: tramite.propietario,
            fecha_ingreso: tramite.fecha_ingreso,
            id_categoria: categoria ? categoria.id_categoria : "",
            estado_ingreso: tramite.estado_ingreso,
            estado_tramite: tramite.estado_tramite,
            fecha_salida: tramite.fecha_salida,
            reasignado: tramite.reasignado,
            fecha_reasignacion: tramite.fecha_reasignacion,
            informe: tramite.informe,
            entregado: tramite.entregado,
            fecha_entrega: tramite.fecha_entrega,
            correo_electronico: tramite.correo_electronico,
        });
        setShowEdit(true);
        setSelectedEstado(tramite.estado_tramite);
        setSelectedIngreso(tramite.estado_ingreso); // Actualiza el estado
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
            preserveState: true,
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

    const handleSubmitEmail = (e) => {
        e.preventDefault();
        const detalles = {
            tramite: data.tramite,
            propietario: data.propietario,
            estado: data.estado_tramite,
            correo_electronico: data.correo_electronico,
        };
        post("/administrar-tramites/tramite/send-email", detalles, {
            preserveScroll: true,
            onError: (error) => console.error(Object.values(error).join(", ")),
        });
    };

    const handleCategoryChange = (id) => {
        setSelectedCategory(id);
        const filteredtypes = TiposTramite.filter(
            (tipotramite) => tipotramite.id_categoria === id,
        );
        setFilteredTypes(filteredtypes);
        setData("id_tipotramite", "");
    };
    const transformForCombobox = (arrays) => {
        return arrays.map((array) => ({
            value: array,
            label: `${array}`,
        }));
    };
    const handleChangeIngreso = (value) => {
        setSelectedIngreso(value); // Actualiza el estado
        setData("estado_ingreso", value);
    };
    const handleChangeEstado = (value) => {
        setSelectedEstado(value); // Actualiza el estado
        setData("estado_tramite", value);
    };
    const comboboxingresos = transformForCombobox(["Ingreso", "Reingreso"]);
    const comboboxestado = transformForCombobox([
        "Revisión",
        "Observación",
        "Negado",
        "Aprobado",
    ]);

    const inputstramite = [
        {
            placeholder: "Categoria",
            type: "select",
            labelKey: "nombre",
            valueKey: "id_categoria",
            options: Categorias,
            value: selectedCategory,
            onSelect: handleCategoryChange,
            inputError: (
                <InputError message={errors.id_categoria} className="mt-2" />
            ),
            defaultValue: data.nombre_categoria,
        },
        {
            id: "estado_ingreso",
            type: "combobox",
            label: "Estado de Ingreso",
            options: comboboxingresos,
            value: selectedingreso,
            onChange: handleChangeIngreso,
            inputError: (
                <InputError message={errors.estado_ingreso} className="mt-2" />
            ),
            defaultValue: data.estado_ingreso,
        },
        {
            label: "Trámite",
            id: "tramite",
            type: "text",
            name: "tramite",
            value: data.tramite || "",
            onChange: (e) => setData("tramite", e.target.value),
            inputError: (
                <InputError message={errors.tramite} className="mt-2" />
            ),
        },
        {
            placeholder: "Tipo de Trámite",
            type: "select",
            labelKey: "nombre",
            valueKey: "id_tipotramite",
            options: filteredTypes,
            value: data.id_tipotramite,
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
            value: data.propietario || "",
            onChange: (e) => setData("propietario", e.target.value),
            inputError: (
                <InputError message={errors.propietario} className="mt-2" />
            ),
        },
        {
            label: "Correo electrónico",
            id: "correo_electronico",
            type: "email",
            name: "correo_electronico",
            value: data.correo_electronico || "",
            onChange: (e) => setData("correo_electronico", e.target.value),
            inputError: (
                <InputError
                    message={errors.correo_electronico}
                    className="mt-2"
                />
            ),
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
            label: "Fecha de Ingreso",
            id: "fecha_ingreso",
            type: "date",
            name: "fecha_ingreso",
            value: data.fecha_ingreso || "",
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
            value: data.fecha_salida || "",
            onChange: (e) => setData("fecha_salida", e.target.value),
            inputError: (
                <InputError message={errors.fecha_salida} className="mt-2" />
            ),
        },
        {
            type: "combobox",
            label: "Estado del Trámite",
            id: "estado_tramite",
            options: comboboxestado,
            value: selectedestado,
            onChange: handleChangeEstado,
            inputError: (
                <InputError message={errors.estado_tramite} className="mt-2" />
            ),
            defaultValue: data.estado_tramite,
        },
    ];
    const inputsclaves = [
        {
            label: "informe",
            id: "informe",
            type: "text",
            name: "informe",
            value: data.informe || "",
            onChange: (e) => setData("informe", e.target.value),
            inputError: (
                <InputError message={errors.informe} className="mt-2" />
            ),
        },
        {
            label: "Entregado",
            id: "entregado",
            type: "text",
            name: "entregado",
            value: data.entregado || "",
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
            value: data.fecha_entrega || "",
            onChange: (e) => setData("fecha_entrega", e.target.value),
            inputError: (
                <InputError message={errors.fecha_entrega} className="mt-2" />
            ),
        },
        {
            label: "Reasignado",
            id: "reasignado",
            type: "text",
            name: "reasignado",
            value: data.reasignado || "",
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
            value: data.fecha_reasignacion || "",
            onChange: (e) => setData("fecha_reasignacion", e.target.value),
            inputError: (
                <InputError
                    message={errors.fecha_reasignacion}
                    className="mt-2"
                />
            ),
        },
    ];

    const theaders = [
        "Trámite",
        "Tipo de Trámite",
        "Propietario",
        "Fecha de Ingreso",
        "Estado",
    ];
    const searchColumns = [
        "tramite",
        "nombre_tipotramite",
        "propietario",
        "fecha_ingreso",
        "estado_tramite",
    ];
    const theadersexsportar = [
        "Estado",
        "Trámite",
        "Arquiecto R",
        "Tipo de Trámite",
        "Propietario",
        "Fecha de Ingreso",
        "Estado",
        "Fecha salida",
    ];
    const columnasexportar = [
        "estado_ingreso",
        "tramite",
        "nombre_usuario",
        "nombre_tipotramite",
        "propietario",
        "fecha_ingreso",
        "estado_tramite",
        "fecha_salida",
    ];

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
                            searchColumns={columnasexportar}
                            headers={theadersexsportar}
                            fileName="Trámites"
                        />
                    </div>
                </Box>
                <ModalCreate
                    showCreate={showCreate}
                    closeModalCreate={closeModalCreate}
                    title={"Añadir Trámite"}
                    nombre1={"Trámite"}
                    inputsclaves={inputsclaves}
                    nombre2={"Información adicional"}
                    inputstramite={inputstramite}
                    processing={processing}
                    handleSubmitEmail={handleSubmitEmail}
                    handleSubmitAdd={handleSubmitAdd}
                />
                <DeleteModal
                    showDelete={showDelete}
                    closeDeleteModal={closeDeleteModal}
                    title={"Borrar Trámite"}
                    handleDelete={() => handleDelete(dataToDelete)}
                    processing={processing}
                />
                <ModalEdit
                    title="Actualizar Trámite"
                    showEdit={showEdit}
                    closeEditModal={closeEditModal}
                    nombre1={"Actualizar Trámite"}
                    inputsclaves={inputsclaves}
                    nombre2={"Información adicional"}
                    inputstramite={inputstramite}
                    processing={processing}
                    handleSubmitEdit={handleSubmitEdit}
                    handleSubmitEmail={handleSubmitEmail}
                />
                <Box className="mt-3 hidden md:block">
                    <TableCustom
                        headers={theaders}
                        data={Tramites}
                        searchColumns={searchColumns}
                        theadersdetalles={theadersexsportar}
                        columnasdetalles={columnasexportar}
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
