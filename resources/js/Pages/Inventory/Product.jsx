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

const Product = ({ auth, Products }) => {
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
        product_name: "",
        product_description: "",
        product_price: "",
        product_quantity: "",
        product_brand: "",
        product_vat: "",
        ids: [],
    });

    const [showCreate, setShowCreate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editData, setEditData] = useState(null);
    const [dataToDelete, setDataToDelete] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);

    const closeModalCreate = () => setShowCreate(false);
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
        setShowEdit(false);
        setEditData(null);
    };
    const openEditModal = (product) => {
        setShowEdit(true);
        setEditData(product);
        setData({
            product_name: product.product_name,
            product_description: product.product_description,
            product_price: product.product_price,
            product_quantity: product.product_quantity,
            product_brand: product.product_brand,
            product_vat: product.product_vat,
        });
    };

    const handleSubmitAdd = (e) => {
        e.preventDefault();

        post(route("products.store"), {
            preserveScroll: true,
            onSuccess: () => closeModalCreate(),
            onError: (error) => console.log(error),
            onFinish: () => reset(),
        });
    };

    const handleSubmitEdit = (e) => {
        e.preventDefault();

        patch(route("products.update", { id: editData.product_id }), {
            preserveScroll: true,
            onSuccess: () => closeEditModal(),
            onError: (error) => console.log(error),
            onFinish: () => reset(),
        });
    };

    const handleDelete = (id) => {
        if (Array.isArray(id)) {
            data.ids = id;
            destroy(route("products.multiple.destroy"), {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedProducts([]);
                    closeDeleteModal();
                },
                onError: (error) => console.error(error),
                onFinish: () => reset(),
            });
        } else {
            destroy(route("products.destroy", { id }), {
                preserveScroll: true,
                onSuccess: () => closeDeleteModal(),
                onError: (error) => console.error(error),
                onFinish: () => reset(),
            });
        }
    };

    const inputs = [
        {
            label: "Nombre",
            id: "product_name",
            type: "text",
            name: "product_name",
            value: data.product_name,
            onChange: (e) => setData("product_name", e.target.value),
            inputError: (
                <InputError message={errors.product_name} className="mt-2" />
            ),
            defaultValue: data.product_name,
        },
        {
            label: "Descripción",
            id: "product_description",
            type: "text",
            name: "product_description",
            value: data.product_description,
            onChange: (e) => setData("product_description", e.target.value),
            inputError: (
                <InputError
                    message={errors.product_description}
                    className="mt-2"
                />
            ),
            defaultValue: data.product_description,
        },
        {
            label: "Precio",
            id: "product_price",
            type: "number",
            name: "product_price",
            value: data.product_price,
            onChange: (e) => setData("product_price", e.target.value),
            inputError: (
                <InputError message={errors.product_price} className="mt-2" />
            ),
            defaultValue: data.product_price,
        },
        {
            label: "Cantidad",
            id: "product_quantity",
            type: "number",
            name: "product_quantity",
            value: data.product_quantity,
            onChange: (e) => setData("product_quantity", e.target.value),
            inputError: (
                <InputError
                    message={errors.product_quantity}
                    className="mt-2"
                />
            ),
            defaultValue: data.product_quantity,
        },
        {
            label: "Marca",
            id: "product_brand",
            type: "text",
            name: "product_brand",
            value: data.product_brand,
            onChange: (e) => setData("product_brand", e.target.value),
            inputError: (
                <InputError message={errors.product_brand} className="mt-2" />
            ),
            defaultValue: data.product_brand,
        },
        {
            label: "Iva",
            id: "product_vat",
            type: "number",
            name: "product_vat",
            value: data.product_vat,
            onChange: (e) => setData("product_vat", e.target.value),
            inputError: (
                <InputError message={errors.product_vat} className="mt-2" />
            ),
            defaultValue: data.product_vat,
        },
    ];

    const theaders = ["ID", "Nombre", "Precio", "Cantidad", "Marca", "Iva"];
    const searchColumns = [
        "product_id",
        "product_name",
        "product_price",
        "product_quantity",
        "product_brand",
        "product_vat",
    ];

    const handleCheckboxChange = (id) => {
        setSelectedProducts((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((item) => item !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedProducts.length === Products.length) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(Products.map((product) => product.product_id));
        }
    };

    const openDeleteModalForSelected = () => {
        setShowDelete(true);
        setDataToDelete(selectedProducts);
    };

    return (
        <Authenticated
            user={auth.user}
            header={<Header subtitle="Manage Products" />}
        >
            <Head title="Productos" />
            <Tab tabs={tabs}>
                <Box>
                    <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                        <div className="w-full sm:w-auto flex flex-wrap justify-center gap-2">
                            <AddButton onClick={openCreateModal} />
                            <DeleteButton
                                disabled={selectedProducts.length === 0}
                                onClick={openDeleteModalForSelected}
                            />
                        </div>
                        <ExportData
                            data={Products}
                            searchColumns={searchColumns}
                            headers={theaders}
                        />
                    </div>
                </Box>
                <ModalCreate
                    showCreate={showCreate}
                    closeModalCreate={closeModalCreate}
                    title={"Add Products"}
                    inputs={inputs}
                    processing={processing}
                    handleSubmitAdd={handleSubmitAdd}
                />
                <DeleteModal
                    showDelete={showDelete}
                    closeDeleteModal={closeDeleteModal}
                    title={"Delete Products"}
                    handleDelete={() => handleDelete(dataToDelete)}
                    processing={processing}
                />
                <ModalEdit
                    title="Edit Product"
                    showEdit={showEdit}
                    closeEditModal={closeEditModal}
                    inputs={inputs}
                    processing={processing}
                    handleSubmitEdit={handleSubmitEdit}
                />
                <Box className="mt-3 hidden md:block">
                    <TableCustom
                        headers={theaders}
                        data={Products}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="product_id"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedProducts}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
                <Box className="mt-3  md:hidden">
                    <CardsCustom
                        headers={theaders}
                        data={Products}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="product_id"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedProducts}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
            </Tab>
        </Authenticated>
    );
};

export default Product;
