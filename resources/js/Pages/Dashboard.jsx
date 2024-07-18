// src/Pages/Dashboard.js
import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Header from "@/Components/Header";
import { Head } from "@inertiajs/react";
import Box from "@/Layouts/Box";
import LikertChart from "@/Components/LikertChart";
import {
    TimelineChart,
    RoleActivityChart,
    EntityActivityChart,
    SalesFunnelChart,
} from "@/Components/CustomChart";
import {
    transformAuditData,
    transformTimelineData,
    transformRoleActivityData,
    transformEntityActivityData,
} from "@/Utils/transformAuditData";

export default function Dashboard({ auth, audits, salesFunnelData }) {
    console.log(salesFunnelData);
    const likertData = transformAuditData(audits);
    const roleActivityData = transformRoleActivityData(audits);
    const entityActivityData = transformEntityActivityData(audits);
    const timelineData = transformTimelineData(audits);

    const DashboardComponents = {
        auditor: [
            <Box key="box-1" className="pt-6">
                <div className="flex flex-wrap">
                    <div className="w-full md:w-1/2 p-2">
                        <LikertChart data={likertData} />
                    </div>
                    <div className="w-full md:w-1/2 p-2">
                        <EntityActivityChart data={entityActivityData} />
                    </div>
                </div>
            </Box>,
        ],
        admin: [
            <Box key="box-2" className="pt-6">
                <div className="flex flex-wrap">
                    <div className="w-full md:w-1/2 p-2">
                        <RoleActivityChart data={roleActivityData} />
                    </div>
                    <div className="w-full md:w-1/2 p-2">
                        <TimelineChart data={timelineData} />
                    </div>
                </div>
            </Box>,
        ],
        vendedor: [
            <Box key="box-3" className="pt-6">
                <div className="flex flex-wrap">
                    <div className="w-full md:w-1/2 p-2">
                        <SalesFunnelChart data={salesFunnelData} />
                    </div>
                </div>
            </Box>,
        ],
        tecnico: [
            // Componentes específicos para el rol técnico
            // Ejemplo: <TecnicoChart key="tecnico" data={someTecnicoData} />
        ],
    };

    const userRoles = auth.user.roles.map((role) => role.name);

    const renderDashboardComponents = () => {
        return userRoles.flatMap((role) =>
            DashboardComponents[role] ? DashboardComponents[role] : [],
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<Header subtitle={"Dashboard"} />}
            roles={userRoles}
        >
            <Head title="Dashboard" />
            {renderDashboardComponents()}
        </AuthenticatedLayout>
    );
}
