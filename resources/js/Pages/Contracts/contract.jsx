import { useState, useEffect } from "react";
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
import { useNotify } from "@/Components/Toast";

const Contract = ({
    auth,
    Clients,
    Plans,
    Olts,
    LastMiles,
    Distributions,
    Ips,
    Status,
    Discounts,
    Contracts,
}) => {
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
        client_id: "",
        contract_num: "",
        contract_id: "",
        installation_date: "",
        maximum_date: "",
        plan_id: "",
        plan_name: "",
        client_name: "",
        client_email: "",
        address: "",
        reference: "",
        phone_number: "",
        olt_id: "",
        olt_name: "",
        distribution_nap_id: "",
        distribution_nap_name: "",
        last_mile_nap_id: "",
        last_mile_nap_name: "",
        ip_address: "",
        discount_id: "",
        discount_name: "",
        status_id: "",
        status_name: "",
        ids: [],
    });
    const [showCreate, setShowCreate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editData, setEditData] = useState(null);
    const [dataToDelete, setDataToDelete] = useState(null);
    const [selectedContracts, setSelectedContracts] = useState([]);
    //napdistribution
    const [selectedOlt, setSelectedOlt] = useState("");
    const [filteredDistributionNaps, setFilteredDistributionNaps] = useState(
        [],
    );
    const [filteredLastMileNaps, setFilteredLastMileNaps] = useState([]);
    const [filteredIps, setFilteredIps] = useState([]);

    const [selectedOption, setSelectedOption] = useState("");

    const handleOltChange = (id) => {
        setSelectedOlt(id);
        const filteredNaps = Distributions.filter((nap) => nap.olt_id === id);
        setFilteredDistributionNaps(filteredNaps);
        setFilteredLastMileNaps([]);
        setFilteredIps([]);
        setData("distribution_nap_id", "");
        setData("last_mile_nap_id", "");
        setData("ip_address", "");
    };

    const handleDistributionNapChange = (id) => {
        setData("distribution_nap_id", id);

        // Filtrar las NAPs de Última Milla basadas en la NAP de Distribución seleccionada
        const filteredLastMileNaps = LastMiles.filter(
            (nap) => nap.distribution_nap_id === id,
        );
        setFilteredLastMileNaps(filteredLastMileNaps);

        // Filtrar las direcciones IP basadas en la NAP de Distribución seleccionada
        const filteredIps = Ips.filter(
            (ip) => ip.distribution_nap_id === id && ip.ip_status === 0,
        );
        setFilteredIps(filteredIps);

        // Limpiar selección previa de NAP de Última Milla y Dirección IP
        setData("last_mile_nap_id", "");
        setData("ip_address", "");
    };

    const handleLastMileNapChange = (id) => {
        setData("distribution_nap_id", id);

        setData("ip_address", "");
    };
    const notify = useNotify();

    const closeModalCreate = () => {
        clearErrors();
        setShowCreate(false);
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

    const openEditModal = (contract) => {
        // Encontrar el cliente asociado al contrato
        const client = Clients.find(
            (client) => client.client_id === contract.client_id,
        );
        const ip = Ips.find((ip) => ip.ip_address === contract.ip_address);

        // Encontrar la NAP de Última Milla asociada a la IP
        const lastMileNap = LastMiles.find(
            (nap) => nap.last_mile_nap_id === ip.last_mile_nap_id,
        );
        const distributionNap = Distributions.find(
            (nap) => nap.distribution_nap_id === ip.distribution_nap_id,
        );

        // Encontrar el OLT asociado a la NAP de Última Milla
        const olt = Olts.find((olt) => olt.olt_id === distributionNap.olt_id);

        console.log("Datos del contrato para e:0r:", olt);
        setShowEdit(true);
        setEditData(contract);

        const newData = {
            contract_num: contract.contract_num,
            installation_date: contract.installation_date,
            maximum_date: contract.maximum_date,
            client_id: client?.client_id,
            client_name: client?.client_name,
            client_email: client?.client_email,
            address: client?.address,
            reference: client?.reference,
            phone_number: client?.phone_number,
            plan_name: contract.plan_name,

            ip_address: contract.ip_address,

            olt_id: olt?.olt_id,
            olt_name: olt?.olt_name,

            last_mile_nap_id: lastMileNap?.last_mile_nap_id,
            last_mile_nap_name: lastMileNap?.last_mile_nap_name,

            distribution_nap_id: distributionNap?.distribution_nap_id,
            distribution_nap_name: distributionNap?.distribution_nap_name,

            discount_id: contract.discount_id,
            discount_name: contract.discount_name,
            status_id: contract.status_id,
            status_name: contract.status_name,
        };

        setData(newData);
        setSelectedOption(contract.maximum_date);
    };

    // Usar un useEffect para realizar una acción después de que `data` se haya actualizado
    useEffect(() => {
        console.log("Datos del contrato para editar:", data);
    }, [data]);

    const handleSubmitAdd = (e) => {
        e.preventDefault();
        console.log("Datos enviados:", data);

        post(route("contracts.store"), {
            preserveScroll: true,
            onSuccess: () => {
                closeModalCreate();
                setShowModalConfirm(true);
            },
            onError: (error) => console.error(Object.values(error).join(", ")),
        });
    };

    const handleSubmitEdit = (e) => {
        e.preventDefault();

        patch(route("contracts.update", { contract: editData.contract_num }), {
            preserveScroll: true,
            onSuccess: () => {
                closeEditModal();
                notify("success", "Contrato actualizado.");
            },
            onError: (error) => console.error(Object.values(error).join(", ")),
        });
    };

    const handleDelete = (id) => {
        if (Array.isArray(id)) {
            data.ids = id;
            destroy(route("contracts.multiple.destroy"), {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedContracts([]);
                    closeDeleteModal();
                    notify("success", "Contratos eliminados.");
                },
                onError: (error) =>
                    console.error(Object.values(error).join(", ")),
            });
        } else {
            destroy(route("contracts.destroy", { id }), {
                preserveScroll: true,
                onSuccess: () => {
                    closeDeleteModal();
                    notify("success", "Contrato eliminado.");
                },
                onError: (error) =>
                    console.error(Object.values(error).join(", ")),
            });
        }
    };
    const handleClientIdChange = (id) => {
        setData("client_id", id);
        const client = Clients.find((client) => client.client_id === id);
        if (client) {
            setData({
                ...data,
                client_id: client.client_id,
                client_name: client.client_name,
                client_email: client.client_email,
                address: client.address,
                reference: client.reference,
                phone_number: client.phone_number,
            });
        }
    };
    const handleChange = (value) => {
        setSelectedOption(value); // Actualiza el estado cuando cambia la selección
        setData("maximum_date", value); // Asegura que movement_type también se actualice
    };
    const inputs = [
        {
            placeholder: "Cédula",
            type: "select",
            labelKey: "client_id",
            valueKey: "client_id",
            options: Clients,
            onSelect: handleClientIdChange,
            onChange: (e) => setData("client_id", e.target.value),
            inputError: (
                <InputError message={errors.client_id} className="mt-2" />
            ),
            defaultValue: data.client_id,
        },
        {
            placeholder: "Planes",
            type: "select",
            labelKey: "plan_name",
            valueKey: "plan_id",
            options: Plans,
            onSelect: (id) => setData("plan_id", id),
            inputError: (
                <InputError message={errors.plan_id} className="mt-2" />
            ),
            defaultValue: data.plan_name,
        },
        {
            placeholder: "Descuentos",
            type: "select",
            labelKey: "discount_name",
            valueKey: "discount_id",
            options: Discounts,
            onSelect: (id) => setData("discount_id", id),
            inputError: (
                <InputError message={errors.discount_id} className="mt-2" />
            ),
            defaultValue: data.discount_name,
        },
        {
            placeholder: "Estados",
            type: "select",
            labelKey: "status_name",
            valueKey: "status_id",
            options: Status,
            onSelect: (id) => setData("status_id", id),
            inputError: (
                <InputError message={errors.status_id} className="mt-2" />
            ),
            defaultValue: data.status_name,
        },
        {
            label: "Nombres",
            id: "client_name",
            type: "text",
            name: "client_name",
            value: data.client_name,
            disabled: true,
            inputError: (
                <InputError message={errors.client_name} className="mt-1" />
            ),
        } /*
        {
            label: "Email",
            id: "client_email",
            type: "email",
            name: "client_email",
            value: data.client_email,
            disabled: true,

            inputError: (
                <InputError message={errors.client_email} className="mt-1" />
            ),
            defaultValue: data.client_email,
        },
        {
            label: "Dirección",
            id: "address",
            type: "text",
            name: "address",
            value: data.address,
            disabled: true,
            inputError: (
                <InputError message={errors.address} className="mt-1" />
            ),
            defaultValue: data.address,
        },*/,
        {
            label: "Referencia",
            id: "reference",
            type: "text",
            name: "reference",
            value: data.reference,
            disabled: true,

            inputError: (
                <InputError message={errors.reference} className="mt-1" />
            ),
            defaultValue: data.reference,
        },

        {
            placeholder: "OLT",
            type: "select",
            labelKey: "olt_name",
            valueKey: "olt_id",
            options: Olts,
            value: selectedOlt,
            onSelect: handleOltChange,
            inputError: <InputError message={errors.olt_id} className="mt-2" />,
            defaultValue: data.olt_name,
        },

        {
            placeholder: "Nap de Distribución",
            type: "select",
            labelKey: "distribution_nap_name",
            valueKey: "distribution_nap_id",
            options: filteredDistributionNaps,
            value: data.distribution_nap_id,
            inputError: (
                <InputError
                    message={errors.distribution_nap_id}
                    className="mt-2"
                />
            ),
            onSelect: handleDistributionNapChange,
            disabled: !selectedOlt,
            defaultValue: data.distribution_nap_name,
        },
        {
            placeholder: "Nap de Ultima Milla",
            type: "select",
            labelKey: "last_mile_nap_name",
            valueKey: "last_mile_nap_id",
            options: filteredLastMileNaps,
            value: data.last_mile_nap_id,
            inputError: (
                <InputError
                    message={errors.last_mile_nap_id}
                    className="mt-2"
                />
            ),
            onSelect: handleLastMileNapChange,
            disabled: !selectedOlt,
            defaultValue: data.last_mile_nap_name,
        },
        {
            placeholder: "Ips",
            type: "select",
            labelKey: "ip_address",
            valueKey: "ip_address",
            options: filteredIps,
            value: data.ip_address,
            onChange: (e) => setData("ip_address", e.target.value),
            onSelect: (id) => setData("ip_address", id),
            defaultValue: data.ip_address,
        },
        {
            label: "Fecha de la instalación ",
            id: "installation_date",
            type: "date",
            name: "installation_date",
            value: data.installation_date,
            onChange: (e) => setData("installation_date", e.target.value),
            inputError: (
                <InputError
                    message={errors.installation_date}
                    className="mt-2"
                />
            ),
            defaultValue: data.installation_date,
        },
        {
            type: "combobox",
            label: "Dia Maximo",
            options: [
                { value: "5", label: "5" },
                { value: "15", label: "15" },
                { value: "25", label: "25" },
            ],
            value: selectedOption,
            onChange: handleChange,
            inputError: (
                <InputError message={errors.maximum_date} className="mt-2" />
            ),
            defaultValue: data.maximum_date,
        },
    ];

    const theaders = ["Id Contrato", "Cliente", "Plan", "Ip", "Estado"];
    const searchColumns = [
        "contract_num",
        "client_name",
        "plan_name",
        "ip_address",
        "status_name",
    ];

    const handleCheckboxChange = (id) => {
        setSelectedContracts((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((item) => item !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedContracts.length === Contracts.length) {
            setSelectedContracts([]);
        } else {
            setSelectedContracts(
                Contracts.map((contract) => contract.contract_num),
            );
        }
    };

    const openDeleteModalForSelected = () => {
        setShowDelete(true);
        setDataToDelete(selectedContracts);
    };

    return (
        <Authenticated
            user={auth.user}
            header={<Header subtitle="Administrar Contratos" />}
        >
            <Head title="Contratos" />
            <Tab tabs={tabs}>
                <Box>
                    <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                        <div className="w-full sm:w-auto flex flex-wrap justify-center gap-2">
                            <AddButton onClick={openCreateModal} />
                            <DeleteButton
                                disabled={selectedContracts.length === 0}
                                onClick={openDeleteModalForSelected}
                            />
                        </div>
                        <ExportData
                            data={Contracts}
                            searchColumns={searchColumns}
                            headers={theaders}
                            fileName="Contratos"
                        />
                    </div>
                </Box>
                <ModalCreate
                    showCreate={showCreate}
                    closeModalCreate={closeModalCreate}
                    title={"Añadir Contratos"}
                    inputs={inputs}
                    processing={processing}
                    handleSubmitAdd={handleSubmitAdd}
                />
                <DeleteModal
                    showDelete={showDelete}
                    closeDeleteModal={closeDeleteModal}
                    title={"Borrar Contratos"}
                    handleDelete={() => handleDelete(dataToDelete)}
                    processing={processing}
                />
                <ModalEdit
                    title="Editar Contratos"
                    showEdit={showEdit}
                    closeEditModal={closeEditModal}
                    inputs={inputs}
                    processing={processing}
                    handleSubmitEdit={handleSubmitEdit}
                />

                <Box className="mt-3 hidden md:block">
                    <TableCustom
                        headers={theaders}
                        data={Contracts}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="contract_num"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedContracts}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
                <Box className="mt-3  md:hidden">
                    <CardsCustom
                        headers={theaders}
                        data={Contracts}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="contract_num"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedContracts}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
            </Tab>
        </Authenticated>
    );
};

export default Contract;
