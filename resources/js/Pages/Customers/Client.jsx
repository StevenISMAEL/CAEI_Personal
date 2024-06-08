import { useState } from "react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import Header from "@/Components/Header";
import { Head, useForm } from "@inertiajs/react";
import Box from "@/Layouts/Box";
import { AddButton, DeleteButton } from "@/Components/CustomButtons";
import SearchBar from "@/Components/SearchBar";
import ModalCreate from "@/Components/ModalCreate";
import InputError from "@/Components/InputError";
import TablePagination from "@/Components/TableCustom";
import Tab from "@/Layouts/TabLayout";

import { IoPeopleSharp } from "react-icons/io5";
import { FaPhone } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { FaMapMarked } from "react-icons/fa";
import { PiCityFill } from "react-icons/pi";

const Client = ({ auth }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        cedula: "",
        id_direccion: "",
        nombres_cliente: "",
        correo_cliente: "",
    });

    const [showCreate, setShowCreate] = useState(false);
    const closeModalCreate = () => {
        setShowCreate(false);
    };
    const openCreateModal = () => {
        setShowCreate(true);
    };

    const handleSubmitAdd = (e) => {
        e.preventDefault();

        post(route("customers.store"), {
            preserveScroll: true,
            onSuccess: () => closeModalCreate(),
            onError: (error) => console.log(error),
            onFinish: () => reset(),
        });
    };

    const inputs = [
        {
            label: "Cedula",
            id: "cedula",
            type: "text",
            name: "cedula",
            value: data.cedula,
            isFocused: true,
            onChange: (e) => setData("cedula", e.target.value),
            inputError: <InputError message={errors.cedula} className="mt-2" />,
        },
        {
            label: "ID Direccion",
            id: "id_direccion",
            type: "text",
            name: "id_direccion",
            value: data.email,
            onChange: (e) => setData("id_direccion", e.target.value),
            inputError: (
                <InputError message={errors.id_direccion} className="mt-2" />
            ),
        },
        {
            label: "Nombres Cliente",
            id: "nombres_cliente",
            type: "text",
            name: "nombres_cliente",
            value: data.nombres_cliente,
            onChange: (e) => setData("nombres_cliente", e.target.value),
            inputError: (
                <InputError message={errors.nombres_cliente} className="mt-2" />
            ),
        },
        {
            label: "Correo Cliente",
            id: "correo_cliente",
            type: "email",
            name: "correo_cliente",
            value: data.correo_cliente,
            onChange: (e) => setData("correo_cliente", e.target.value),
            inputError: (
                <InputError message={errors.correo_cliente} className="mt-2" />
            ),
        },
    ];

    const tabs = [
        {
            name: "Clientes",
            route: "clients",
            icon: IoPeopleSharp,
        },
        // {
        //     name: "Telefonos",
        //     route: "customers.phones",
        //     icon: FaPhone,
        // },
        // {
        //     name: "Direcciones",
        //     route: "customers",
        //     icon: FaHome,
        // },
        // {
        //     name: "Parroquias",
        //     route: "customers",
        //     icon: FaMapMarked,
        // },
        {
            name: "Cantones",
            route: "cantons",
            icon: PiCityFill,
        },
    ];

    return (
        <Authenticated
            user={auth.user}
            header={<Header subtitle={"Manage Customers"} />}
        >
            <Head title="Clientes" />
            <Tab tabs={tabs}>
                <Box>
                    <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                        <div className="w-full sm:w-auto flex flex-wrap justify-between gap-2">
                            <AddButton onClick={openCreateModal} />
                            <DeleteButton disabled={true} />
                        </div>
                        <SearchBar />
                    </div>
                </Box>
                <ModalCreate
                    showCreate={showCreate}
                    closeModalCreate={closeModalCreate}
                    title={"Add Customer"}
                    inputs={inputs}
                    processing={processing}
                    handleSubmitAdd={handleSubmitAdd}
                />
                {/* <Box className="pt-6">
                    <TablePagination />
                </Box> */}
            </Tab>
        </Authenticated>
    );
};

export default Client;
