import { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import Header from "@/Components/Header";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import Tab from "@/Layouts/TabLayout";
import { AddButton, DeleteButton } from "@/Components/CustomButtons";
import InputError from "@/Components/InputError";
import ModalCreate from "@/Components/ContractModel";
import ModalEdit from "@/Components/ContractEdit";
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
    Phones,
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
        plan_value: "",
        plan_megas: "",
        client_name: "",
        client_email: "",
        address: "",
        reference: "",
        phone_numbers: "",
        parish_name: "",
        province_name: "",
        sector_name: "",
        canton_name: "",
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
        setData((prevData) => ({
            ...prevData,
            distribution_nap_id: "", // Limpiar distribución NAP ID
            last_mile_nap_id: "", // Limpiar última milla NAP ID
            ip_address: "", // Limpiar dirección IP
        }));
        setFilteredDistributionNaps(filteredNaps);
        setFilteredLastMileNaps([]);
        setFilteredIps([]);
    };
    const handleDistributionNapChange = (id) => {
        // Actualizar el estado de data para distribution_nap_id

        setData((prevData) => ({
            ...prevData,
            distribution_nap_id: id,
        }));

        // Obtener todas las IPs asignadas a la NAP de Distribución seleccionada
        const ipsAssignedToDistributionNap = Ips.filter(
            (ip) => ip.distribution_nap_id === id,
        );

        // Filtrar las NAPs de Última Milla basadas en la NAP de Distribución seleccionada
        const filteredLastMileNaps = LastMiles.filter((nap) => {
            // Contar cuántas IPs tienen asignada esta NAP de Última Milla
            const ipsAssignedToLastMileNap =
                ipsAssignedToDistributionNap.filter(
                    (ip) => ip.last_mile_nap_id === nap.last_mile_nap_id,
                );

            // Verificar si el número de splitters asignados a esta NAP de Última Milla es menor o igual al número de IPs asignadas
            return (
                nap.distribution_nap_id === id &&
                nap.last_mile_nap_splitter >= ipsAssignedToLastMileNap.length
            );
        });
        console.log(filteredLastMileNaps);
        setFilteredLastMileNaps(filteredLastMileNaps);

        // Filtrar las direcciones IP basadas en la NAP de Distribución seleccionada y estado de IP
        const filteredIps = Ips.filter((ip) => {
            return ip.distribution_nap_id === id && ip.ip_status === 0;
        });
        setFilteredIps(filteredIps);

        // Limpiar selección previa de NAP de Última Milla y Dirección IP
        setData((prevData) => ({
            ...prevData,
            last_mile_nap_id: "",
            ip_address: "",
        }));
    };

    const handleLastMileNapChange = (id) => {
        setData("last_mile_nap_id", id);
    };
    const notify = useNotify();

    const closeModalCreate = () => {
        clearErrors();
        reset();
        setSelectedOption("");
        setShowCreate(false);
    };

    const openCreateModal = () => {
        const latestContractNum = Contracts.reduce((maxNum, contract) => {
            const numParts = contract.contract_num.split("-");
            const num = parseInt(numParts[numParts.length - 1]);
            return num > maxNum ? num : maxNum;
        }, 0);

        const nextNumber = latestContractNum + 1;
        const contractNum = `001-001-${nextNumber.toString().padStart(5, "0")}`;
        const contractId = `DEC-${nextNumber.toString().padStart(4, "0")}`;

        // Setear los valores en el formulario
        setData({
            ...data,
            contract_num: contractNum,
            contract_id: contractId,
        });
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

    const openEditModal = (contract) => {
        console.log(contract);
        const ip = Ips.find((ip) => ip.ip_address === contract.ip_address);

        // Encontrar la NAP de Última Milla asociada a la IP
        const lastMileNap = LastMiles.find(
            (nap) => nap.last_mile_nap_id === ip?.last_mile_nap_id,
        );
        const distributionNap = Distributions.find(
            (nap) => nap.distribution_nap_id === ip?.distribution_nap_id,
        );

        // Encontrar el OLT asociado a la NAP de Distribución
        const olt = Olts.find((olt) => olt.olt_id === distributionNap?.olt_id);

        const client = Clients.find(
            (client) => client.client_id === contract.client_id,
        );

        // Busca el teléfono en la lista de teléfonos
        const clientPhones = Phones.filter(
            (telefono) => telefono.client_id === contract.client_id,
        );

        // Extrae los números de teléfono y los concatena en una cadena separada por /
        const phoneNumbers = clientPhones
            .map((telefono) => telefono.phone_number)
            .join(" / ");

        const plan = Plans.find((plan) => plan.plan_id === contract.plan_id);

        const newData = {
            contract_num: contract.contract_num,
            contract_id: contract.contract_id,
            installation_date: contract.installation_date,
            maximum_date: contract.maximum_date,
            discount_id: contract.discount_id,
            discount_name: contract.discount_name,
            status_id: contract.status_id,
            status_name: contract.status_name,

            client_id: client.client_id,
            client_name: client.client_name,
            client_email: client.client_email,
            address: client.address,
            reference: client.reference,
            phone_numbers: phoneNumbers,
            sector_name: client.sector_name,
            parish_name: client.parish_name,
            canton_name: client.canton_name,
            province_name: client.province_name,

            plan_id: contract.plan_id,
            plan_name: plan.plan_name,
            plan_value: plan.plan_value,
            plan_megas: plan.plan_megas,

            ip_address: contract.ip_address,
            olt_id: olt?.olt_id,
            olt_name: olt?.olt_name,
            last_mile_nap_id: lastMileNap?.last_mile_nap_id,
            last_mile_nap_name: lastMileNap?.last_mile_nap_name,
            distribution_nap_id: distributionNap?.distribution_nap_id,
            distribution_nap_name: distributionNap?.distribution_nap_name,
        };

        setEditData(contract);
        setData(newData);

        setShowEdit(true);
        setSelectedOption(contract.maximum_date);
    };

    const handleSubmitAdd = (e) => {
        e.preventDefault();
        post(route("contracts.store"), {
            preserveScroll: true,
            onSuccess: () => {
                closeModalCreate();
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
        // Actualiza el client_id en el estado
        setData("client_id", id);

        // Busca el cliente en la lista de clientes
        const client = Clients.find((client) => client.client_id === id);

        // Si se encuentra el cliente
        if (client) {
            // Busca el teléfono en la lista de teléfonos
            const clientPhones = Phones.filter(
                (telefono) => telefono.client_id === id,
            );

            // Extrae los números de teléfono y los concatena en una cadena separada por /
            const phoneNumbers = clientPhones
                .map((telefono) => telefono.phone_number)
                .join(" / ");

            // Actualiza el estado con los datos del cliente y el teléfono
            setData({
                ...data,
                client_id: client.client_id,
                client_name: client.client_name,
                client_email: client.client_email,
                address: client.address,
                reference: client.reference,
                phone_numbers: phoneNumbers,
                sector_name: client.sector_name,
                parish_name: client.parish_name,
                canton_name: client.canton_name,
                province_name: client.province_name,
            });
        }
    };
    const handlePlanIdChange = (id) => {
        setData("plan_id", id);

        const plan = Plans.find((plan) => plan.plan_id === id);

        if (plan) {
            setData({
                ...data,
                plan_id: plan.plan_id,
                plan_name: plan.plan_name,
                plan_value: plan.plan_value,
                plan_megas: plan.plan_megas,
            });
        }
    };
    const handleChange = (value) => {
        setSelectedOption(value); // Actualiza el estado cuando cambia la selección
        setData("maximum_date", value); // Asegura que movement_type también se actualice
        console.log(data.distribution_nap_id);
    };
    const contractInputs = [
        {
            label: "Num Contrato",
            id: "contract_num",
            type: "text",
            name: "contract_num",
            value: data.contract_num,
            disabled: true,
            inputError: (
                <InputError message={errors.contract_num} className="mt-1" />
            ),
        },
        {
            label: "ID del contrato",
            id: "contract_id",
            type: "text",
            name: "contract_id",
            value: data.contract_id,
            disabled: true,
            inputError: (
                <InputError message={errors.contract_id} className="mt-1" />
            ),
        },
        {
            placeholder: "Descuentos",
            type: "select",
            labelKey: "discount_name",
            valueKey: "discount_id",
            label: "Descuento",
            value: data.discount_id,
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
            label: "Estado",
            options: Status,
            value: data.status_id,
            onSelect: (id) => setData("status_id", id),
            inputError: (
                <InputError message={errors.status_id} className="mt-2" />
            ),
            defaultValue: data.status_name,
        },
    ];
    const clientInfoInputs = [
        {
            placeholder: "Cédula",
            type: "select",
            labelKey: "client_id",
            valueKey: "client_id",
            options: Clients,
            label: "Cédula",
            value: data.client_id,
            onSelect: handleClientIdChange,
            onChange: (e) => setData("client_id", e.target.value),
            inputError: (
                <InputError message={errors.client_id} className="mt-2" />
            ),
            defaultValue: data.client_id,
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
            defaultValue: data.client_name,
        },
        {
            label: "Correo Electrónico",
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
        },
        {
            label: "Teléfonos",
            id: "phone_numbers",
            type: "text",
            name: "phone_numbers",
            value: data.phone_numbers,
            disabled: true,
            inputError: (
                <InputError message={errors.phone_numbers} className="mt-1" />
            ),
            defaultValue: data.phone_numbers,
        },
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
            label: "Sector",
            id: "sector_name",
            type: "text",
            name: "sector_name",
            value: data.sector_name,
            disabled: true,

            inputError: (
                <InputError message={errors.sector_name} className="mt-1" />
            ),
            defaultValue: data.sector_name,
        },
        {
            label: "Cantón",
            id: "canton_name",
            type: "text",
            name: "canton_name",
            value: data.canton_name,
            disabled: true,

            inputError: (
                <InputError message={errors.canton_name} className="mt-1" />
            ),
            defaultValue: data.canton_name,
        },
        {
            label: "Parroquia",
            id: "parish_name",
            type: "text",
            name: "parish_name",
            value: data.parish_name,
            disabled: true,

            inputError: (
                <InputError message={errors.parish_name} className="mt-1" />
            ),
            defaultValue: data.parish_name,
        },
        {
            label: "Provincia",
            id: "province_name",
            type: "text",
            name: "province_name",
            value: data.province_name,
            disabled: true,

            inputError: (
                <InputError message={errors.province_name} className="mt-1" />
            ),
            defaultValue: data.province_name,
        },
        {
            type: "combobox",
            label: "Fecha de pago",
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
    const technicalInfoInputs = [
        {
            placeholder: "Planes",
            type: "select",
            labelKey: "plan_name",
            valueKey: "plan_id",
            label: "Planes",
            options: Plans,
            value: data.plan_name,
            onSelect: handlePlanIdChange,
            inputError: (
                <InputError message={errors.plan_id} className="mt-2" />
            ),
            defaultValue: data.plan_name,
        },
        {
            placeholder: "OLT",
            type: "select",
            labelKey: "olt_name",
            valueKey: "olt_id",
            options: Olts,
            label: "OLT",
            value: selectedOlt,
            onSelect: handleOltChange,
            inputError: <InputError message={errors.olt_id} className="mt-2" />,
            defaultValue: data.olt_name,
        },
        {
            label: "Valor",
            id: "plan_value",
            type: "text",
            name: "plan_value",
            value: data.plan_value,
            disabled: true,
            inputError: (
                <InputError message={errors.plan_value} className="mt-1" />
            ),
            defaultValue: data.plan_value,
        },
        {
            placeholder: "Nap de Distribución",
            type: "select",
            labelKey: "distribution_nap_name",
            valueKey: "distribution_nap_id",
            options: filteredDistributionNaps,
            label: "Nap de Distribución",
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
            label: "Megas",
            id: "plan_megas",
            type: "text",
            name: "plan_megas",
            value: data.plan_megas,
            disabled: true,
            inputError: (
                <InputError message={errors.plan_megas} className="mt-1" />
            ),
            defaultValue: data.plan_megas,
        },

        {
            placeholder: "Nap de Ultima Milla",
            type: "select",
            labelKey: "last_mile_nap_name",
            valueKey: "last_mile_nap_id",
            options: filteredLastMileNaps,
            label: "última Milla",
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
            placeholder: "Ips",
            type: "select",
            labelKey: "ip_address",
            valueKey: "ip_address",
            options: filteredIps,
            label: "Dirección IP",
            value: data.ip_address,
            onChange: (e) => setData("ip_address", e.target.value),
            onSelect: (id) => setData("ip_address", id),
            defaultValue: data.ip_address,
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
                    contractInputs={contractInputs}
                    clientInfoInputs={clientInfoInputs}
                    technicalInfoInputs={technicalInfoInputs}
                    processing={processing}
                    handleSubmitAdd={handleSubmitAdd}
                    numContract={data.contract_num}
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
                    contractInputs={contractInputs}
                    clientInfoInputs={clientInfoInputs}
                    technicalInfoInputs={technicalInfoInputs}
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
