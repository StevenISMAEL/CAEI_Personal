import { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import Header from "@/Components/Header";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Box from "@/Layouts/Box";
import ExportData from "@/Components/ExportData";
import TableCustomViewOnly from "@/Components/AuditTable";
import CardsCustomOnlyView from "@/Components/AuditCard";

const Audit = ({ auth, audits }) => {
    const [formattedAudits, setFormattedAudits] = useState([]);
    console.log(formattedAudits);
    useEffect(() => {
        if (audits?.length) {
            setFormattedAudits(
                audits.map((audit) => ({
                    ...audit,
                    user: audit.user?.name ?? "Registro de nuevo usuario",
                    user_roles:
                        audit.user_roles.length < 1
                            ? "sin rol"
                            : audit.user_roles.join(", "),
                    modified_table: `${audit.modified_table.table_name} (${audit.modified_table.record_id})`,
                    event: auditEvent(audit.event),
                    created_at: new Date(audit.created_at).toLocaleString(
                        "es-ES",
                        {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            second: "numeric",
                        },
                    ),
                    new_values: JSON.stringify(audit.new_values, null, 2),
                    old_values: JSON.stringify(audit.old_values, null, 2),
                })),
            );
        }
    }, [audits]);

    const headers = [
        "Usuario",
        "Roles",
        "Tabla Modificada",
        "Tipo de Evento",
        "Fecha y Hora",
    ];
    const searchColumns = [
        "user",
        "user_roles",
        "modified_table",
        "event",
        "created_at",
    ];

    return (
        <AuthenticatedLayout
            header={<Header subtitle="Auditoria" />}
            user={auth.user}
            roles={auth.user.roles.map((role) => role.name)}
        >
            <Head title="Auditoría" />

            <Box className="mt-3">
                <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                    <div></div>
                    <ExportData
                        data={formattedAudits}
                        searchColumns={[
                            ...searchColumns,
                            "old_values",
                            "new_values",
                        ]}
                        headers={[
                            ...headers,
                            "Datos Anteriores",
                            "Datos Nuevos",
                        ]}
                        fileName="Auditoría"
                    />
                </div>
            </Box>

            <Box className="mt-3 hidden md:block">
                <TableCustomViewOnly
                    headers={headers}
                    data={formattedAudits}
                    searchColumns={searchColumns}
                    idKey="id"
                />
            </Box>
            <Box className="mt-3  md:hidden">
                <CardsCustomOnlyView
                    headers={headers}
                    data={formattedAudits}
                    searchColumns={searchColumns}
                    idKey="id"
                />
            </Box>
        </AuthenticatedLayout>
    );
};

const auditEvent = (event) => {
    switch (event) {
        case "created":
            return "creado";
        case "updated":
            return "actualizado";
        case "deleted":
            return "eliminado";
        case "restored":
            return "restaurado";
        case "role_change":
            return "cambio de rol";
        default:
            return event;
    }
};

export default Audit;
