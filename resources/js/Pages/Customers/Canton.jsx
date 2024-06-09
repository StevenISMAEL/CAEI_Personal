import { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import Header from "@/Components/Header";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import Tab from "@/Layouts/TabLayout";
import { AddButton, DeleteButton } from "@/Components/CustomButtons";
import SearchBar from "@/Components/SearchBar";
import InputError from "@/Components/InputError";
import ModalCreate from "@/Components/ModalCreate";
import Box from "@/Layouts/Box";

import tabs from "./tabs"

const Canton = ({ auth, Provinces }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        province_id: "",
        canton_name: "",
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

        post(route("cantons.store"), {
            preserveScroll: true,
            onSuccess: () => closeModalCreate(),
            onError: (error) => console.log(error),
            onFinish: () => reset(),
        });
    };

    const inputs = [
        {
            placeholder: "Provincia",
            type: "select",
            labelKey: "province_name",
            valueKey: "province_id",
            options: Provinces,
            onSelect: (id) => setData("province_id", id),
            inputError: (
                <InputError message={errors.province_id} className="mt-2" />
            ),
        },
        {
            label: "Nombre del Canton",
            id: "canton_name",
            type: "text",
            name: "canton_name",
            value: data.canton_name,
            onChange: (e) => setData("canton_name", e.target.value),
            inputError: (
                <InputError message={errors.canton_name} className="mt-2" />
            ),
        },
    ];

    return (
        <Authenticated
            user={auth.user}
            header={<Header subtitle="Manage Cantons" />}
        >
            <Head title="Cantones" />
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
                    title={"Add Cantons"}
                    inputs={inputs}
                    processing={processing}
                    handleSubmitAdd={handleSubmitAdd}
                />
            </Tab>
        </Authenticated>
    );
};
    
export default Canton;
