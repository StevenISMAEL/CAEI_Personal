import React, { useState, useEffect } from "react";
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

const Movement = ({ auth, Products, Movements }) => {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        delete: destroy,
        patch,
    } = useForm({
        product_id: "",
        movement_date: "",
        movement_quantity: "",
        movement_total: "",
        movement_type: "",
        ids: [],
    });

    const [showCreate, setShowCreate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editData, setEditData] = useState(null);
    const [dataToDelete, setDataToDelete] = useState(null);
    const [selectedMovements, setSelectedMovements] = useState([]);
    const [productQuantity, setProductQuantity] = useState(0);
    const [showQuantityError, setShowQuantityError] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");

    useEffect(() => {
        // Reset product quantity and error state whenever product changes
        setProductQuantity(0);
        setShowQuantityError(false);
    }, [data.product_id]);

    const closeModalCreate = () => {
        setShowCreate(false);
        reset();
    };
    const openCreateModal = () => {
        reset();
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
        setShowEdit(false);
        setEditData(null);
    };
    const openEditModal = (movement) => {
        setShowEdit(true);
        setEditData(movement);
        setData({
            product_id: movement.product_id,
            movement_date: movement.movement_date,
            movement_quantity: movement.movement_quantity,
            movement_total: movement.movement_total,
            movement_type: movement.movement_type,
        });
        setSelectedOption(movement.movement_type);
    };

    const handleQuantityChange = (e) => {
        const quantity = parseFloat(e.target.value);
        const selectedProduct = Products.find(
            (product) => product.product_id === data.product_id,
        );

        if (selectedProduct) {
            if (
                data.movement_type === "Salida" &&
                quantity > selectedProduct.product_quantity
            ) {
                setShowQuantityError(true);
                setData((prevData) => ({
                    ...prevData,
                    movement_quantity: quantity,
                    movement_total: "",
                }));
            } else {
                setShowQuantityError(false);
                setData((prevData) => ({
                    ...prevData,
                    movement_quantity: quantity,
                    movement_total: parseFloat(
                        (quantity * selectedProduct.product_price).toFixed(2),
                    ),
                }));
            }
            setProductQuantity(selectedProduct.product_quantity);
        }
    };

    const handleSubmitAdd = (e) => {
        e.preventDefault();

        post(route("movements.store"), {
            preserveScroll: true,
            onSuccess: () => closeModalCreate(),
            onError: (error) => console.log(error),
            onFinish: () => reset(),
        });
    };

    const handleSubmitEdit = (e) => {
        e.preventDefault();

        patch(route("movements.update", { id: editData.movement_id }), {
            preserveScroll: true,
            onSuccess: () => closeEditModal(),
            onError: (error) => console.log(error),
            onFinish: () => reset(),
        });
    };

    const handleDelete = (id) => {
        if (Array.isArray(id)) {
            data.ids = id;
            destroy(route("movements.multiple.destroy"), {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedMovements([]);
                    closeDeleteModal();
                },
                onError: (error) => console.error(error),
                onFinish: () => reset(),
            });
        } else {
            destroy(route("movements.destroy", { id }), {
                preserveScroll: true,
                onSuccess: () => closeDeleteModal(),
                onError: (error) => console.error(error),
                onFinish: () => reset(),
            });
        }
    };

    const handleChange = (value) => {
        setSelectedOption(value); // Actualiza el estado cuando cambia la selección
        setData("movement_type", value); // Asegura que movement_type también se actualice
        // Reset the quantity and total if the movement type changes
        setData((prevData) => ({
            ...prevData,
            movement_quantity: "",
            movement_total: "",
        }));
    };

    const inputs = [
        {
            placeholder: "Producto",
            type: "select",
            labelKey: "product_name",
            valueKey: "product_id",
            options: Products,
            onSelect: (id) => setData("product_id", id),
            inputError: (
                <InputError message={errors.product_id} className="mt-2" />
            ),
            defaultValue: data.product_id,
        },
        {
            label: "Fecha del movimiento",
            id: "movement_date",
            type: "date",
            name: "movement_date",
            value: data.movement_date,
            onChange: (e) => setData("movement_date", e.target.value),
            inputError: (
                <InputError message={errors.movement_date} className="mt-2" />
            ),
            defaultValue: data.movement_date,
        },
        {
            type: "combobox",
            label: "Tipo de movimiento",
            options: [
                { value: "Entrada", label: "Entrada" },
                { value: "Salida", label: "Salida" },
            ],
            value: selectedOption,
            onChange: handleChange,
            inputError: (
                <InputError message={errors.movement_type} className="mt-2" />
            ),
            defaultValue: data.movement_type,
        },
        {
            label: "Cantidad del Producto",
            id: "movement_quantity",
            type: "number",
            name: "movement_quantity",
            value: data.movement_quantity,
            onChange: handleQuantityChange,
            inputError: showQuantityError && (
                <InputError
                    message={`La cantidad no puede ser mayor que ${productQuantity}`}
                    className="mt-2"
                />
            ),
            defaultValue: data.movement_quantity,
        },
        {
            label: "Total del Movimiento",
            id: "movement_total",
            type: "number",
            name: "movement_total",
            disabled: true,
            value: data.movement_total,
            onChange: (e) => setData("movement_total", e.target.value),
            inputError: (
                <InputError
                    message={errors.movement_quantity}
                    className="mt-2"
                />
            ),
            defaultValue: data.movement_total,
        },
    ];

    const theaders = [
        "ID",
        "Producto",
        "Fecha",
        "Cantidad",
        "Total",
        "Tipo de movimiento",
    ];
    const searchColumns = [
        "movement_id",
        "product_name",
        "movement_date",
        "movement_quantity",
        "movement_total",
        "movement_type",
    ];

    const handleCheckboxChange = (id) => {
        setSelectedMovements((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((item) => item !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedMovements.length === Movements.length) {
            setSelectedMovements([]);
        } else {
            setSelectedMovements(
                Movements.map((movement) => movement.movement_id),
            );
        }
    };

    const openDeleteModalForSelected = () => {
        setShowDelete(true);
        setDataToDelete(selectedMovements);
    };

    return (
        <Authenticated
            user={auth.user}
            header={<Header subtitle="Manage Movements" />}
        >
            <Head title="Movimientos de Inventario" />
            <Tab tabs={tabs}>
                <Box>
                    <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                        <div className="w-full sm:w-auto flex flex-wrap justify-center gap-2">
                            <AddButton onClick={openCreateModal} />
                            <DeleteButton
                                disabled={selectedMovements.length === 0}
                                onClick={openDeleteModalForSelected}
                            />
                        </div>
                        <ExportData
                            data={Movements}
                            searchColumns={searchColumns}
                            headers={theaders}
                        />
                    </div>
                </Box>
                <ModalCreate
                    showCreate={showCreate}
                    closeModalCreate={closeModalCreate}
                    title={"Add Movement"}
                    inputs={inputs}
                    processing={processing}
                    handleSubmitAdd={handleSubmitAdd}
                />
                <DeleteModal
                    showDelete={showDelete}
                    closeDeleteModal={closeDeleteModal}
                    title={"Delete Movement"}
                    handleDelete={() => handleDelete(dataToDelete)}
                    processing={processing}
                />
                <ModalEdit
                    title="Edit Movement"
                    showEdit={showEdit}
                    closeEditModal={closeEditModal}
                    inputs={inputs}
                    processing={processing}
                    handleSubmitEdit={handleSubmitEdit}
                />
                <Box className="mt-3 hidden md:block">
                    <TableCustom
                        headers={theaders}
                        data={Movements}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="movement_id"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedMovements}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
                <Box className="mt-3  md:hidden">
                    <CardsCustom
                        headers={theaders}
                        data={Movements}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="movement_id"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedMovements}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
            </Tab>
        </Authenticated>
    );
};

export default Movement;
