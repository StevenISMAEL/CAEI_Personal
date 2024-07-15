import { useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import Header from "@/Components/Header";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import Tab from "@/Layouts/TabLayout";
import { AddButton, DeleteButton } from "@/Components/CustomButtons";
import InputError from "@/Components/InputError";
import ModalCreateOrder from "@/Components/orderModel";
import ModalEdit from "@/Components/EditWork";
import Box from "@/Layouts/Box";
import ExportData from "@/Components/ExportData";
import tabs from "./tabs";
import DeleteModal from "@/Components/DeleteModal";
import TableCustom from "@/Components/TableCustom";
import CardsCustom from "@/Components/CardCustom";
import { useNotify } from "@/Components/Toast";
import PrimaryButton from "@/Components/PrimaryButton";

const WorkOrder = ({
    auth,
    Employees,
    Clients,
    Plans,
    Olts,
    Distributions,
    LastMiles,
    Ips,
    Sector,
    TypeReports,
    TypeOrders,
    Contracts,
    Phones,
    WorkOrders,
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
        employee_id: "",
        employee_name: "",
        type_report_id: "",
        name_type_report: "",
        name_type_order: "",
        contract_num: "",
        contract_id: "",
        olt_name: "",
        olt_id: "",
        distribution_nap_name: "",
        distribution_nap_id: "",
        last_mile_nap_name: "",
        last_mile_nap_id: "",
        ip_address: "",
        address: "",
        phone_number: "",
        sector_name: "",
        type_order_id: "",
        plan_details: "",

        order_channel: "",
        issue_date: "",
        order_precedents: "",
        order_status: "",
        order_abclaim: "",
        solution_date: "",
        order_initial_abis: "",
        order_initial_potency: "",
        order_final_abis: "",
        order_initial_diagnosis: "",
        order_solution: "",
        order_final_potency: "",
        order_final_diagnosis: "",
        value_due: "",
        ids: [],
    });
    const [showCreate, setShowCreate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editData, setEditData] = useState(null);
    const [dataToDelete, setDataToDelete] = useState(null);
    const [selectedWorkOrders, setSelectedWorkOrders] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedEmploy, setSelectedEmploy] = useState("");
    const [reportsOptions, setReportsOptions] = useState([]);
    const [preceOptions, setpreceOptions] = useState([]);
    const [workOrders, setWorkOrders] = useState([]);
    const notify = useNotify();

    const closeModalCreate = () => {
        console.log("Cerrando modal de creación");

        // Reiniciar los estados relacionados con las opciones
        setReportsOptions([]);
        setpreceOptions([]);

        // Limpiar otros estados o realizar reinicios adicionales según sea necesario
        clearErrors();
        reset();
        setSelectedStatus([]);

        // Cerrar el modal de creación
        setShowCreate(false);
    };

    const openCreateModal = () => {
        // Encontrar el último número de orden de trabajo para generar el siguiente
        const latestOrder = WorkOrders.reduce((maxNum, order) => {
            const numParts = order.work_order_id.split("-");
            const num = parseInt(numParts[numParts.length - 1]);
            return num > maxNum ? num : maxNum;
        }, 0);

        const nextNumber = latestOrder + 1;
        const orderId = `ORT-${nextNumber.toString().padStart(4, "0")}`;

        // Setear los valores en el formulario
        setData({
            ...data,
            work_order_id: orderId,
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
        console.log("Cerrando modal de edición");

        // Reiniciar los estados relacionados con las opciones
        setReportsOptions([]);
        setpreceOptions([]);

        // Limpiar otros estados o realizar reinicios adicionales según sea necesario
        clearErrors();
        reset();
        setSelectedStatus("");
        setEditData(null);

        // Cerrar el modal de edición
        setShowEdit(false);
    };

    const formatDateForFrontend = (dateString) => {
        if (!dateString) return "";
        // Asumiendo que dateString está en formato "YYYY-MM-DD HH:mm:ss"
        const date = new Date(dateString.replace(" ", "T"));
        return date.toISOString().slice(0, 16);
    };

    const openEditModal = (workOrder) => {
        const contract = Contracts.find(
            (contract) => contract.contract_num === workOrder.contract_num,
        );

        if (contract) {
            const client = Clients.find(
                (client) => client.client_id === contract.client_id,
            );

            if (client) {
                const clientPhones = Phones.filter(
                    (phone) => phone.client_id === contract.client_id,
                );
                const phoneNumbers = clientPhones
                    .map((phone) => phone.phone_number)
                    .join(" / ");
                const sector = Sector.find(
                    (sector) => sector.sector_id === client.sector_id,
                );

                const plan = Plans.find(
                    (plan) => plan.plan_id === contract.plan_id,
                );
                const planDetails = plan
                    ? `${plan.plan_id} / ${plan.plan_name} / ${plan.plan_value} / ${plan.plan_megas}`
                    : "";
                const ip = Ips.find(
                    (ip) => ip.ip_address === contract.ip_address,
                );
                console.log("IP", ip);

                let oltName = "";
                let distributionNapName = "";
                let lastMileNapName = "";

                if (ip) {
                    const lastMileNap = LastMiles.find(
                        (lastMile) =>
                            ip.last_mile_nap_id === lastMile.last_mile_nap_id,
                    );
                    if (lastMileNap) {
                        lastMileNapName = lastMileNap.last_mile_nap_name;

                        const distributionNap = Distributions.find(
                            (distribution) =>
                                distribution.distribution_nap_id ===
                                lastMileNap.distribution_nap_id,
                        );
                        if (distributionNap) {
                            distributionNapName =
                                distributionNap.distribution_nap_name;

                            const olt = Olts.find(
                                (olt) => olt.olt_id === distributionNap.olt_id,
                            );
                            if (olt) {
                                oltName = olt.olt_name;
                            }
                        }
                    }
                }

                // Buscar el tipo de reporte en TypeReports por el ID almacenado en workOrder
                const typeReport = TypeReports.find(
                    (report) =>
                        report.type_report_id === workOrder.type_report_id,
                );
                let typeOrderName = "";
                let typeOrderId = "";
                if (typeReport) {
                    const typeOrder = TypeOrders.find(
                        (typeOrder) =>
                            typeOrder.type_order_id ===
                            typeReport.type_order_id,
                    );
                    if (typeOrder) {
                        typeOrderName = typeOrder.name_type_order;
                        typeOrderId = typeOrder.type_order_id;
                    }
                }

                const employeeOptions = generateEmployeeOptions();
                const selectedEmployee = employeeOptions.find(
                    (emp) => emp.id === workOrder.employee_id,
                );

                const newData = {
                    work_order_id: workOrder.work_order_id,
                    employee_id: workOrder.employee_id,
                    employee_name: selectedEmployee
                        ? selectedEmployee.name
                        : "",
                    type_report_id: workOrder.type_report_id,
                    type_order_id: typeOrderId,
                    name_type_report: typeReport
                        ? typeReport.name_type_report
                        : "", // Obtener el nombre del tipo de reporte
                    name_type_order: typeOrderName, // Obtener el nombre del tipo de orden
                    type_report_id: workOrder.type_report_id,
                    order_channel: workOrder.order_channel || "",
                    issue_date: formatDateForFrontend(workOrder.issue_date),
                    solution_date: formatDateForFrontend(
                        workOrder.solution_date,
                    ),
                    order_precedents: workOrder.order_precedents, // Condicionar los precedentes a "Sí" o "No"
                    order_status: workOrder.order_status || "",
                    order_abclaim: workOrder.order_abclaim || "",
                    order_initial_abis: workOrder.order_initial_abis || "",
                    order_initial_potency:
                        workOrder.order_initial_potency || "",
                    order_final_abis: workOrder.order_final_abis || "",
                    order_initial_diagnosis:
                        workOrder.order_initial_diagnosis || "",
                    order_solution: workOrder.order_solution || "",
                    order_final_potency: workOrder.order_final_potency || "",
                    order_final_diagnosis:
                        workOrder.order_final_diagnosis || "",
                    value_due: workOrder.value_due || "",

                    contract_num: contract.contract_num,
                    contract_id: `${contract.contract_id} - ${client.client_name}`,
                    client_id: client.client_id,
                    client_name: client.client_name,
                    address: client.address,
                    reference: client.reference,
                    phone_number: phoneNumbers,
                    sector_name: sector ? sector.sector_name : "",
                    plan_details: planDetails,
                    ip_address: contract.ip_address, // Si ya está en workOrder, no necesitas buscarlo de nuevo
                    last_mile_nap_name: lastMileNapName || "",
                    distribution_nap_name: distributionNapName || "",
                    olt_name: oltName || "",
                    status_id: workOrder.order_status,
                    order_status: workOrder.order_status,
                };

                setEditData(workOrder);
                setData(newData);
                setShowEdit(true);
                setpreceOptions(workOrder.order_precedents);
                setSelectedStatus(workOrder.order_status || "");
                setSelectedEmploy(employeeOptions);
            }
        }
    };

    const handleSubmitAdd = (e) => {
        e.preventDefault();
        console.log("Datos enviados:", data);

        post(route("workorder.store"), {
            preserveScroll: true,
            onSuccess: () => {
                closeModalCreate();
                notify("success", "Orden de trabajo creada.");
            },
            onError: (error) => console.error(Object.values(error).join(", ")),
        });
    };

    const handleSubmitEdit = (e) => {
        console.log("Intentando actualizar orden de trabajo");
        e.preventDefault();

        patch(
            route("workorder.update", { workorder: editData.work_order_id }),
            {
                preserveScroll: true,
                onSuccess: () => {
                    closeEditModal();
                    notify("success", "Orden de trabajo actualizada.");
                },
                onError: (error) =>
                    console.error(Object.values(error).join(", ")),
            },
        );
    };

    const handleDelete = (id) => {
        if (Array.isArray(id)) {
            data.ids = id;
            destroy(route("workorder.multiple.destroy"), {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedWorkOrders([]);
                    closeDeleteModal();
                    notify("success", "Ordenes de trabajo eliminadas.");
                },
                onError: (error) =>
                    console.error(Object.values(error).join(", ")),
            });
        } else {
            destroy(route("workorders.destroy", { id }), {
                preserveScroll: true,
                onSuccess: () => {
                    closeDeleteModal();
                    notify("success", "Orden de trabajo eliminada.");
                },
                onError: (error) =>
                    console.error(Object.values(error).join(", ")),
            });
        }
    };

    const handleEmployeeChange = (id) => {
        setData("employee_id", id);
    };

    const handleTypeReportChange = (id) => {
        setData("type_report_id", id);
    };
    const handleTypeOrderChange = (id) => {
        const filteredReports = TypeReports.filter(
            (report) => report.type_order_id === id,
        );

        setReportsOptions(filteredReports);
        setData({
            ...data,
            type_order_id: id,
            type_report_id: "",
        });
    };

    const handleContractIdChange = (id) => {
        const contract = Contracts.find(
            (contract) => contract.contract_num === id,
        );

        if (contract) {
            const client = Clients.find(
                (client) => client.client_id === contract.client_id,
            );

            if (client) {
                const clientPhones = Phones.filter(
                    (phone) => phone.client_id === contract.client_id,
                );
                const phoneNumbers = clientPhones
                    .map((phone) => phone.phone_number)
                    .join(" / ");
                const sector = Sector.find(
                    (sector) => sector.sector_id === client.sector_id,
                );
                let planDetails = "";

                const plan = Plans.find(
                    (plan) => plan.plan_id === contract.plan_id,
                );
                if (plan) {
                    planDetails = `${plan.plan_id} / ${plan.plan_name} / ${plan.plan_value} / ${plan.plan_megas}`;
                }

                const ip = Ips.find(
                    (ip) => ip.ip_address === contract.ip_address,
                );
                console.log("IP", ip);

                let oltName = "";
                let distributionNapName = "";
                let lastMileNapName = "";

                if (ip) {
                    const lastMileNap = LastMiles.find(
                        (lastMile) =>
                            ip.last_mile_nap_id === lastMile.last_mile_nap_id,
                    );
                    console.log(lastMileNap);
                    if (lastMileNap) {
                        lastMileNapName = lastMileNap.last_mile_nap_name;

                        const distributionNap = Distributions.find(
                            (distribution) =>
                                distribution.distribution_nap_id ===
                                lastMileNap.distribution_nap_id,
                        );
                        if (distributionNap) {
                            distributionNapName =
                                distributionNap.distribution_nap_name;

                            const olt = Olts.find(
                                (olt) => olt.olt_id === distributionNap.olt_id,
                            );
                            if (olt) {
                                oltName = olt.olt_name;
                            }
                        }
                    }
                }

                setData((prevData) => ({
                    ...prevData,
                    contract_num: contract.contract_num,
                    contract_id: `${contract.contract_id} - ${client.client_name}`,
                    client_id: client ? client.client_id : "",
                    client_name: client ? client.client_name : "",
                    address: client ? client.address : "",
                    reference: client ? client.reference : "",
                    phone_number: phoneNumbers,
                    sector_name: sector ? sector.sector_name : "",
                    plan_details: planDetails,
                    ip_address: ip ? ip.ip_address : "",
                    last_mile_nap_name: lastMileNapName || "",
                    distribution_nap_name: distributionNapName || "",
                    olt_name: oltName || "",
                }));
            }
        }
    };

    const handleChangeStatus = (value) => {
        setSelectedStatus(value);
        setData("order_status", value);
    };
    const handleChangepreceO = (value) => {
        setpreceOptions(value);
        setData("order_precedents", value);
    };

    const transformForCombobox = (arrays) => {
        return arrays.map((array) => ({
            value: array,
            label: `${array}`,
        }));
    };
    const transformCombobox = (arrays) => {
        return arrays.map((array) => ({
            value: array === "Si" ? 1 : 0,

            label: `${array}`,
        }));
    };
    const comboboxpreced = transformCombobox(["Si", "No"]);

    const comboboxstatus = transformForCombobox(["Pendiente", "Realizado"]);
    // Función para generar opciones de empleados
    const generateEmployeeOptions = () => {
        return Employees.map((employee) => ({
            id: employee.id,
            name: employee.name,
        }));
    };

    const employeesOptions = generateEmployeeOptions();

    // Función para generar opciones de contratos

    const generateContractOptions = () => {
        return Contracts.map((contract) => ({
            contract_num: contract.contract_num,
            contract_id: `${contract.contract_id} - ${Clients.find((client) => client.client_id === contract.client_id)?.client_name}`,
        }));
    };
    const contr = generateContractOptions();

    const contractInputs = [
        {
            label: "Id orden",
            id: "work_order_id",
            type: "text",
            name: "work_order_id",
            value: data.work_order_id,
            disabled: true,
            inputError: (
                <InputError message={errors.work_order_id} className="mt-1" />
            ),
        },
        {
            placeholder: "Empleado",
            label: "Empleado",
            type: "select",
            labelKey: "name",
            valueKey: "id",
            value: data.employee_id,
            options: employeesOptions,
            onSelect: handleEmployeeChange,
            inputError: (
                <InputError message={errors.employee_id} className="mt-2" />
            ),
            defaultValue: data.id,
        },
        {
            placeholder: "Contrato",
            label: "Contrato",
            type: "select",
            labelKey: "contract_id",
            valueKey: "contract_num",
            options: contr,
            value: data.contract_id,
            onSelect: handleContractIdChange,
            inputError: (
                <InputError message={errors.contract_num} className="mt-2" />
            ),
            defaultValue: data.contract_id,
        },
        {
            label: "Dirección",
            id: "address",
            type: "text",
            name: "address",
            value: data.address,
            disabled: true,
            inputError: (
                <InputError message={errors.address} className="mt-2" />
            ),
            defaultValue: data.address,
        },
        {
            label: "Sector",
            id: "sector_name",
            type: "text",
            name: "sector_name",
            value: data.sector_name,
            disabled: true,
            inputError: (
                <InputError message={errors.sector_name} className="mt-2" />
            ),
            defaultValue: data.sector_name,
        },
        {
            label: "Plan",
            id: "plan_details",
            type: "text",
            name: "plan_details",
            value: data.plan_details,
            disabled: true,
            inputError: (
                <InputError message={errors.plan_details} className="mt-2" />
            ),
            defaultValue: data.plan_details,
        },
        {
            label: "Teléfonos",
            id: "phone_numbers",
            type: "text",
            name: "phone_numbers",
            value: data.phone_number,
            disabled: true,
            inputError: (
                <InputError message={errors.phone_numbers} className="mt-1" />
            ),
            defaultValue: data.phone_number,
        },
        {
            label: "IP Asociada",
            id: "ip_address",
            type: "text",
            name: "ip_address",
            value: data.ip_address,
            disabled: true,
            inputError: (
                <InputError message={errors.ip_address} className="mt-2" />
            ),

            defaultValue: data.ip_address,
        },
        {
            label: "NAP de Última Milla",
            id: "last_mile_nap_id",
            type: "text",
            name: "last_mile_nap_name",
            value: data.last_mile_nap_name,
            disabled: true,
            inputError: (
                <InputError
                    message={errors.last_mile_nap_name}
                    className="mt-2"
                />
            ),
            defaultValue: data.last_mile_nap_name,
        },
        {
            label: "NAP de Distribución",
            id: "distribution_nap_name",
            type: "text",
            name: "distribution_nap_name",
            value: data.distribution_nap_name,
            disabled: true,
            inputError: (
                <InputError
                    message={errors.distribution_nap_name}
                    className="mt-2"
                />
            ),
            defaultValue: data.distribution_nap_name,
        },
        {
            label: "OLT",
            id: "olt_name",
            type: "text",
            name: "olt_name",
            value: data.olt_name,
            disabled: true,
            inputError: (
                <InputError message={errors.olt_name} className="mt-2" />
            ),
            defaultValue: data.olt_name,
        },
    ];
    const suportInputs = [
        {
            placeholder: "Tipo de Orden",
            label: "Tipo de Orden",
            type: "select",
            labelKey: "name_type_order",
            valueKey: "type_order_id",
            value: data.type_order_id,
            options: TypeOrders,
            onSelect: handleTypeOrderChange,
            inputError: (
                <InputError message={errors.type_order_id} className="mt-2" />
            ),
            defaultValue: data.name_type_order,
        },
        {
            placeholder: "Tipo de Reporte",
            label: "Tipo de reporte",
            type: "select",
            labelKey: "name_type_report",
            valueKey: "type_report_id",
            value: data.type_report_id,
            options: reportsOptions,
            onSelect: handleTypeReportChange,
            inputError: (
                <InputError message={errors.type_report_id} className="mt-2" />
            ),
            defaultValue: data.name_type_report,
        },

        {
            label: "Canal",
            id: "order_channel",
            type: "text",
            name: "order_channel",
            value: data.order_channel,
            onChange: (e) => setData("order_channel", e.target.value),
            inputError: (
                <InputError message={errors.order_channel} className="mt-2" />
            ),
            defaultValue: data.order_channel,
        },
        {
            label: "Fecha de Problema",
            id: "issue_date",
            type: "datetime-local",
            name: "issue_date",
            value: data.issue_date
                ? new Date(data.issue_date).toISOString().slice(0, 16)
                : "",
            onChange: (e) => setData("issue_date", e.target.value),
            inputError: (
                <InputError message={errors.issue_date} className="mt-2" />
            ),
            defaultValue: data.issue_date
                ? new Date(data.issue_date).toISOString().slice(0, 16)
                : "",
        },
        {
            type: "combobox",
            label: "Estado",
            id: "order_status",
            options: comboboxstatus,
            value: selectedStatus,
            onChange: handleChangeStatus,
            inputError: (
                <InputError message={errors.order_status} className="mt-2" />
            ),
            defaultValue: data.order_status,
        },
        {
            label: "Reclamación AB",
            id: "order_abclaim",
            type: "text",
            name: "order_abclaim",
            value: data.order_abclaim,
            onChange: (e) => setData("order_abclaim", e.target.value),
            inputError: (
                <InputError message={errors.order_abclaim} className="mt-2" />
            ),
            defaultValue: data.order_abclaim,
        },
        {
            type: "combobox",
            label: "Precedentes",
            options: comboboxpreced,
            value: preceOptions, // Usa data en lugar de preceOptions
            onChange: handleChangepreceO,
            inputError: (
                <InputError
                    message={errors.order_precedents}
                    className="mt-2"
                />
            ),
            defaultValue: data.order_precedents === 1 ? "Sí" : "No", // Ajusta esto también
        },
        {
            placeholder: "Fecha de Solución",
            label: "Fecha de Solución",
            id: "solution_date",
            type: "datetime-local",
            name: "solution_date",
            value: data.solution_date
                ? new Date(data.solution_date).toISOString().slice(0, 16)
                : "",
            onChange: (e) => setData("solution_date", e.target.value),
            inputError: (
                <InputError message={errors.solution_date} className="mt-2" />
            ),
            defaultValue: data.solution_date
                ? new Date(data.solution_date).toISOString().slice(0, 16)
                : "",
        },
        {
            label: "Inicio de ABIS",
            id: "order_initial_abis",
            type: "text",
            name: "order_initial_abis",
            value: data.order_initial_abis,
            onChange: (e) => setData("order_initial_abis", e.target.value),
            inputError: (
                <InputError
                    message={errors.order_initial_abis}
                    className="mt-2"
                />
            ),
            defaultValue: data.order_initial_abis,
        },
        {
            label: "Potencia Inicial",
            id: "order_initial_abis",
            type: "text",
            name: "order_initial_potency",
            value: data.order_initial_potency,
            onChange: (e) => setData("order_initial_potency", e.target.value),
            inputError: (
                <InputError
                    message={errors.order_initial_potency}
                    className="mt-2"
                />
            ),
            defaultValue: data.order_initial_potency,
        },
        {
            label: "ABIS Final",
            id: "order_final_abis",
            type: "text",
            name: "order_final_abis",
            value: data.order_final_abis,
            onChange: (e) => setData("order_final_abis", e.target.value),
            inputError: (
                <InputError
                    message={errors.order_final_abis}
                    className="mt-2"
                />
            ),
            defaultValue: data.order_final_abis,
        },
        {
            label: "Diagnostico Inicial",
            id: "order_initial_diagnosis",
            type: "text",
            name: "order_initial_diagnosis",
            value: data.order_initial_diagnosis,
            onChange: (e) => setData("order_initial_diagnosis", e.target.value),
            inputError: (
                <InputError
                    message={errors.order_initial_diagnosis}
                    className="mt-2"
                />
            ),
            defaultValue: data.order_initial_diagnosis,
        },
        {
            label: "Solución",
            id: "order_solution",
            type: "text",
            name: "order_solution",
            value: data.order_solution,
            onChange: (e) => setData("order_solution", e.target.value),
            inputError: (
                <InputError message={errors.order_solution} className="mt-2" />
            ),
            defaultValue: data.order_solution,
        },
        {
            label: "Potencia Final",
            id: "order_final_potency",
            type: "text",
            name: "order_final_potency",
            value: data.order_final_potency,
            onChange: (e) => setData("order_final_potency", e.target.value),
            inputError: (
                <InputError
                    message={errors.order_final_potency}
                    className="mt-2"
                />
            ),
            defaultValue: data.order_final_potency,
        },
        {
            label: "Diagnóstico Final",
            id: "order_final_diagnosis",
            type: "text",
            name: "order_final_diagnosis",
            value: data.order_final_diagnosis,
            onChange: (e) => setData("order_final_diagnosis", e.target.value),
            inputError: (
                <InputError
                    message={errors.order_final_diagnosis}
                    className="mt-2"
                />
            ),
            defaultValue: data.order_final_diagnosis,
        },
        {
            label: "Valor a pagar",
            id: "value_due",
            type: "number",
            name: "value_due",
            value: data.value_due,
            onChange: (e) => setData("value_due", e.target.value),
            inputError: (
                <InputError message={errors.value_due} className="mt-2" />
            ),
            defaultValue: data.value_due,
        },
        {
            type: "combobox",
            label: "Precedentes",
            options:comboboxpreced,
            value: preceOptions,
            onChange: handleChangepreceO,
            inputError: (
                <InputError
                    message={errors.order_precedents}
                    className="mt-2"
                />
            ),
            defaultValue: data.order_precedents,
        },
    ];

    const theaders = ["ID", "Empleado", "Tipo de Reporte", "Cliente", "Estado"];

    const searchColumns = [
        "work_order_id",
        "employee_name",
        "name_type_report",
        "contract_client",
        "order_status",
    ];

    const handleCheckboxChange = (id) => {
        setSelectedWorkOrders((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((item) => item !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedWorkOrders.length === WorkOrders.length) {
            setSelectedWorkOrders([]);
        } else {
            setSelectedWorkOrders(
                WorkOrders.map((order) => order.work_order_id),
            );
        }
    };
    const handleUpdateSelectedStatus = () => {
        if (selectedWorkOrders.length === 0) {
            notify("error", "No se han seleccionado órdenes de trabajo.");
            return;
        }
    
        // Extraer solo los IDs de las órdenes seleccionadas
        const selectedIds = selectedWorkOrders.map(order => 
            typeof order === 'object' ? order.work_order_id : order
        ).filter(id => id !== undefined);
    
        if (selectedIds.length === 0) {
            notify("error", "No se encontraron IDs válidos.");
            return;
        }
    
        const data = {
            workOrderIds: selectedIds,
            newStatus: 'Realizado'
        };
        router.post(route('work-orders.update-status'), data, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                // Actualizar el estado local de las órdenes de trabajo
                setWorkOrders(prevOrders => 
                    prevOrders.map(order => 
                        selectedIds.includes(order.work_order_id) 
                            ? {...order, order_status: 'Realizado'} 
                            : order
                    )
                );
                setSelectedWorkOrders([]);
                notify("success", "Estado actualizado correctamente.");
            },
            onError: (errors) => {
                console.error('Error updating work orders:', errors);
                notify("error", "Error al actualizar las órdenes de trabajo.");
            }
        });
    };
    
    const openDeleteModalForSelected = () => {
        setShowDelete(true);
        setDataToDelete(selectedWorkOrders);
    };

    return (
        <Authenticated
            user={auth.user}
            header={<Header subtitle="Administrar Orden de Trabajo" />}
            roles={auth.user.roles.map((role) => role.name)}
        >
            <Head title="Ordenes de Trabajo" />
            <Tab tabs={tabs}>
                <Box>
                    <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                        <div className="w-full sm:w-auto flex flex-wrap justify-center gap-2">
                            <AddButton onClick={openCreateModal} /> 
                            <DeleteButton
                                disabled={selectedWorkOrders.length === 0}
                                onClick={openDeleteModalForSelected}
                            />
                            <PrimaryButton
                                disabled={selectedWorkOrders.length === 0}
                                onClick={handleUpdateSelectedStatus}
                                >
                                Actualizar Estado
                            </PrimaryButton>
                        </div>
                        <ExportData
                            data={WorkOrders}
                            searchColumns={searchColumns}
                            headers={theaders}
                            fileName="Órdenes de Trabajo"
                        />
                    </div>
                </Box>
                <ModalCreateOrder
                    showCreate={showCreate}
                    closeModalCreate={closeModalCreate}
                    title="Crear Órden de Trabajo"
                    contractInputs={contractInputs}
                    supportInputs={suportInputs}
                    processing={processing}
                    handleSubmitAdd={handleSubmitAdd}
                    numOrder={data.work_order_id}
                />
                <DeleteModal
                    showDelete={showDelete}
                    closeDeleteModal={closeDeleteModal}
                    title="Eliminar Órden de Trabajo"
                    handleDelete={() => handleDelete(dataToDelete)}
                    processing={processing}
                />
                <ModalEdit
                    title="Editar Orden de Trabajo"
                    showEdit={showEdit}
                    closeEditModal={closeEditModal}
                    contractInputs={contractInputs}
                    supportInputs={suportInputs}
                    processing={processing}
                    handleSubmitEdit={handleSubmitEdit}
                />

                <Box className="mt-3 hidden md:block">
                    <TableCustom
                        headers={theaders}
                        data={WorkOrders}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="work_order_id"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedWorkOrders}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
                <Box className="mt-3 md:hidden">
                    <CardsCustom
                        headers={theaders}
                        data={WorkOrders}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="work_order_id"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedWorkOrders}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
            </Tab>
        </Authenticated>
    );
};

export default WorkOrder;
