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
import TableCustom from "@/Components/TableCustomDocuments";
import CardsCustom from "@/Components/CardsCustomDocuments";
import { useNotify } from "@/Components/Toast";

const Documentos = ({ auth, Documentacion, Tramites }) => {
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
        tipo_documento: "",
        archivo: "",
        observacion: "",
        ids: [],
    });

    const [showCreate, setShowCreate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [dataToDelete, setDataToDelete] = useState(null);
    const [selectTipodocumentacion, setSelectTipodocumentacion] = useState("");

    const [selectedDocumentacion, setSelectedDocumentacion] = useState([]);
    const notify = useNotify();

    const closeModalCreate = () => {
        clearErrors();
        setShowCreate(false);
        reset();
    };

    const openCreateModal = () =>{
        setData("tipo_documento", "");
        setSelectTipodocumentacion("");
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

    const handleChangetipodocumentacion = (value) => {
        setSelectTipodocumentacion(value); // Actualiza el estado
        setData("tipo_documento", value);
    };
  
    const transformForCombobox = (arrays) => {
        return arrays.map((array) => ({
            value: array,
            label: `${array}`,
        }));
    };
    const comboboxTipo = transformForCombobox([
        "Planos arquitectónicos",
        "CD formato AutoCAD",
        "Otros",
    ]);

    const handleSubmitAdd = (e) => {
        e.preventDefault();

        post(route("documentaciones.store"), {
            preserveScroll: true,
            onSuccess: () => {
                closeModalCreate();
                notify("success", "Documentación agregada.");
            },
            onError: (error) => console.error(Object.values(error).join(", ")),
        });
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setData("archivo", e.target.files[0]);
        }
    };

    const handleDelete = (id) => {
        if (Array.isArray(id)) {
            data.ids = id;
            destroy(route("documentaciones.multiple.destroy"), {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedDocumentacion([]);
                    closeDeleteModal();
                    notify("success", "Documentaciones eliminadas.");
                },
                onError: (error) =>
                    console.error(Object.values(error).join(", ")),
            });
        } else {
            destroy(route("documentaciones.destroy", id), {
                preserveScroll: true,
                onSuccess: () => {
                    closeDeleteModal();
                    notify("success", "Documentación eliminada.");
                },
                onError: (error) =>
                    console.error(Object.values(error).join(", ")),
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
            onSelect: (id) => setData("id_tramite", id),
            inputError: (
                <InputError message={errors.id_tramite} className="mt-2" />
            ),
        },
        {
            id: "tipo_documento",
            type: "combobox",
            label: "Tipo de documento",
            options: comboboxTipo,
            value: selectTipodocumentacion,
            onChange: handleChangetipodocumentacion,
            inputError: (
                <InputError message={errors.tipo_documento} className="mt-2" />
            ),
            defaultValue: data.tipo_documento,
        },
        {
            label: "Observación",
            id: "observacion",
            type: "text",
            name: "observacion",
            value: data.observacion,
            onChange: (e) => setData("observacion", e.target.value),
            inputError: (
                <InputError message={errors.observacion} className="mt-2" />
            ),
        },
        {
            label: "Archivo",
            id: "archivo",
            type: "file",
            name: "archivo",
            onChange: handleFileChange,
            inputError: (
                <InputError message={errors.archivo} className="mt-2" />
            ),
        },
    ];

    const theaders = ["Tramite", "Tipo de documento", "Archivo"];
    const searchColumns = ["tramite", "tipo_documento", "archivo"];

    const handleCheckboxChange = (id) => {
        setSelectedDocumentacion((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((item) => item !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedDocumentacion.length === Documentacion.length) {
            setSelectedDocumentacion([]);
        } else {
            setSelectedDocumentacion(
                Documentacion.map((documentos) => documentos.id_documento),
            );
        }
    };

    const openDeleteModalForSelected = () => {
        setShowDelete(true);
        setDataToDelete(selectedDocumentacion);
    };

    const handleViewPdf = (item) => {
        const url = route("documentaciones.showWithFileName", [
            item.id_documento,
            item.archivo,
        ]);
        const fileName = item.archivo;

        const newTab = window.open(url, "_blank");
        newTab.onload = () => {
            newTab.document.title = fileName;
        };
    };
    return (
        <Authenticated
            user={auth.user}
            header={<Header subtitle="Administrar Documentación" />}
            roles={auth.user.roles.map((role) => role.name)}
        >
            <Head title="Documentación" />
            {/* <Tab tabs={tabs}> */}
            <Box>
                <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                    <div className="w-full sm:w-auto flex flex-wrap justify-center gap-2">
                        <AddButton onClick={openCreateModal} />
                        <DeleteButton
                            disabled={selectedDocumentacion.length === 0}
                            onClick={openDeleteModalForSelected}
                        />
                    </div>
                </div>
            </Box>
            <ModalCreate
                showCreate={showCreate}
                closeModalCreate={closeModalCreate}
                title={"Añadir Documentación"}
                inputs={inputs}
                processing={processing}
                handleSubmitAdd={handleSubmitAdd}
            />
            <DeleteModal
                showDelete={showDelete}
                closeDeleteModal={closeDeleteModal}
                title={"Borrar Documentación"}
                handleDelete={() => handleDelete(dataToDelete)}
                processing={processing}
            />
            <Box className="mt-3 hidden md:block">
                <TableCustom
                    headers={theaders}
                    data={Documentacion}
                    searchColumns={searchColumns}
                    onDelete={openDeleteModal}
                    idKey="id_documento"
                    onSelectChange={handleCheckboxChange}
                    selectedItems={selectedDocumentacion}
                    onSelectAll={handleSelectAll}
                    onViewPdf={handleViewPdf}
                />
            </Box>
            <Box className="mt-3 md:hidden">
                <CardsCustom
                    headers={theaders}
                    data={Documentacion}
                    searchColumns={searchColumns}
                    onDelete={openDeleteModal}
                    idKey="id_documento"
                    onSelectChange={handleCheckboxChange}
                    selectedItems={selectedDocumentacion}
                    onSelectAll={handleSelectAll}
                    onViewPdf={handleViewPdf}
                />
            </Box>
            {/* </Tab> */}
        </Authenticated>
    );
};

export default Documentos;
