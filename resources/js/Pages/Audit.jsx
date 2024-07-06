import { Head } from "@inertiajs/react";
import Header from "@/Components/Header";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Box from "@/Layouts/Box";
import ExportData from "@/Components/ExportData";

const Audit = ({ auth, audits }) => {
    console.log(audits);
    const sampleData = [
        {
            id: 1,
            name: "John Doe",
            email: "john.doe@example.com",
            roles: [{ role_name: "Admin" }, { role_name: "Editor" }],
            created_at: "2024-07-05T10:30:00Z",
        },
        {
            id: 2,
            name: "Jane Smith",
            email: "jane.smith@example.com",
            roles: [{ role_name: "User" }],
            created_at: "2024-07-04T14:45:00Z",
        },
        {
            id: 3,
            name: "Bob Johnson",
            email: "bob.johnson@example.com",
            roles: [{ role_name: "Editor" }],
            created_at: "2024-07-03T09:15:00Z",
        },
        {
            id: 4,
            name: "Alice Brown",
            email: "alice.brown@example.com",
            roles: [{ role_name: "Admin" }],
            created_at: "2024-07-02T16:20:00Z",
        },
        {
            id: 5,
            name: "Charlie Wilson",
            email: "charlie.wilson@example.com",
            roles: [{ role_name: "User" }, { role_name: "Editor" }],
            created_at: "2024-07-01T11:00:00Z",
        },
    ];

    const searchColumns = ["id", "name", "email", "roles", "created_at"];

    const headers = [
        "ID",
        "Nombre",
        "Correo electrónico",
        "Roles",
        "Fecha de creación",
    ];

    const fileName = "Users_Export";
    return (
        <AuthenticatedLayout
            header={<Header subtitle="Auditoria" />}
            user={auth.user}
            roles={auth.user.roles.map((role) => role.name)}
        >
            <Head title="Auditoria" />

            <Box className="mt-3">
                <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                    <div></div>
                    <ExportData
                        data={sampleData}
                        searchColumns={searchColumns}
                        headers={headers}
                        fileName={fileName}
                    />
                </div>
            </Box>
        </AuthenticatedLayout>
    );
};
export default Audit;
