import { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import Header from "@/Components/Header";
import Authenticated from "@/Layouts/AuthenticatedLayout";
// import Tab from "@/Layouts/TabLayout";
import { AddButton, DeleteButton } from "@/Components/CustomButtons";
import InputError from "@/Components/InputError";
import ModalCreate from "@/Components/ModalCreate";
import Box from "@/Layouts/Box";
// import tabs from "./tabs";
import DeleteModal from "@/Components/DeleteModal";
import TableCustom from "@/Components/TableCustomViewOnly";
import CardsCustom from "@/Components/CardCustom";
import { useNotify } from "@/Components/Toast";

const Notificaciones = ({ auth, Notificacion, Tramites }) => {

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        delete: destroy,
        clearErrors,
    } = useForm({
        id_tramite: "",
        id_notificacion: "",
        estado: "",
        propietario: "",
        correo_electronico: "",
        fecha_envio: "",
        estado_tramite: "",
        ids: [],
    });

    const [showCreate, setShowCreate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [dataToDelete, setDataToDelete] = useState(null);
    const [selectedNotificacion, setSelectedNotificacion] = useState([]);
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

    const handleSubmitAdd = (e) => {
        e.preventDefault();

        post(route("notificaciones.store"), {
            preserveScroll: true,
            onSuccess: () => {
                closeModalCreate();
            },
            onError: (error) => console.error(Object.values(error).join(", ")),
        });
    };

    const handleDelete = (id) => {
        if (Array.isArray(id)) {
            data.ids = id;
            destroy(route("notificaciones.multiple.destroy"), {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedNotificacion([]);
                    closeDeleteModal();
                    notify("success", "Notificaciones eliminadas.");
                },
                onError: (error) =>
                    console.error(Object.values(error).join(", ")),
            });
        } else {
            destroy(route("notificaciones.destroy", id), {
                preserveScroll: true,
                onSuccess: () => {
                    closeDeleteModal();
                    notify("success", "Notificaciones eliminada.");
                },
                onError: (error) =>
                    console.error(Object.values(error).join(", ")),
            });
        }
    };


    const handleTramiteChange = (id) => {

        const tramite = Tramites.find((t) => t.id_tramite === id);

        if (tramite) {
            setData ({
                estado: tramite.estado_tramite, 
                estado_tramite: tramite.estado_tramite,
                id_tramite: id,
                correo_electronico: tramite.correo_electronico,
                tramite: tramite.tramite,
                propietario: tramite.propietario,
            });
        }
    };

    const inputs = [
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
            label: "Estado de trámite",
            id: "estado",
            type: "text",
            name: "estado",
            value: data.estado_tramite,
            onChange: (e) => setData("estado", e.target.value),
            inputError: <InputError message={errors.estado} className="mt-2" />,
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
            readOnly: true,
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
            readOnly: true,
        },
    ];

    const theaders = [
        "Tramite",
        "Propietario",
        "Estado enviado",
        "Fecha envio",
    ];
    const searchColumns = ["tramite", "propietario", "estado", "fecha_envio"];

    const handleCheckboxChange = (id) => {
        setSelectedNotificacion((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((item) => item !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedNotificacion.length === Notificacion.length) {
            setSelectedNotificacion([]);
        } else {
            setSelectedNotificacion(
                Notificacion.map((notificaciones) => notificaciones.id_notificacion),
            );
        }
    };

    const openDeleteModalForSelected = () => {
        setShowDelete(true);
        setDataToDelete(selectedNotificacion);
    };

    return (
        <Authenticated
            user={auth.user}
            header={<Header subtitle="Administrar Notificaciones" />}
            roles={auth.user.roles.map((role) => role.name)}
        >
            <Head title="Notificaciones" />
            {/* <Tab tabs={tabs}> */}
            <Box>
                <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                    <div className="w-full sm:w-auto flex flex-wrap justify-center gap-2">
                        <AddButton onClick={openCreateModal} />
                        <DeleteButton
                            disabled={selectedNotificacion.length === 0}
                            onClick={openDeleteModalForSelected}
                        />
                    </div>
                </div>
            </Box>
            <ModalCreate
                showCreate={showCreate}
                closeModalCreate={closeModalCreate}
                title={"Enviar correo electrónico"}
                inputs={inputs}
                processing={processing}
                handleSubmitAdd={handleSubmitAdd}
            />
            <DeleteModal
                showDelete={showDelete}
                closeDeleteModal={closeDeleteModal}
                title={"Borrar notificación"}
                handleDelete={() => handleDelete(dataToDelete)}
                processing={processing}
            />
            <Box className="mt-3 hidden md:block">
                <TableCustom
                    headers={theaders}
                    data={Notificacion}
                    searchColumns={searchColumns}
                    onDelete={openDeleteModal}
                    idKey="id_notificacion"
                    onSelectChange={handleCheckboxChange}
                    selectedItems={selectedNotificacion}
                    onSelectAll={handleSelectAll}
                />
            </Box>
            <Box className="mt-3 md:hidden">
                <CardsCustom
                    headers={theaders}
                    data={Notificacion}
                    searchColumns={searchColumns}
                    onDelete={openDeleteModal}
                    idKey="id_notificacion"
                    onSelectChange={handleCheckboxChange}
                    selectedItems={selectedNotificacion}
                    onSelectAll={handleSelectAll}
                />
            </Box>
            {/* </Tab> */}
        </Authenticated>
    );
};

export default Notificaciones;
