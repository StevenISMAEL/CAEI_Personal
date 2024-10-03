import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Header from "@/Components/Header";
import { Head } from "@inertiajs/react";
import Box from "@/Layouts/Box";
import {TramitesEstadoChart, PieChart }from "@/Components/CustomChart"; // Asegúrate de que el import esté correcto

export default function Dashboard({ auth, tramitesestado,tramitesporcategoria }) {

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<Header subtitle={"Dashboard"} />}
            roles={auth.user.roles.map((role) => role.name)}
        >
            <Head title="Dashboard" />
            
            <Box key="box-3" className="pt-6">
                {/* Flex container with min-height to ensure centering works well */}
                <div className="flex flex-col md:flex-row w-full min-h-[500px] p-4"> 
                    <div className="w-full md:w-1/2 flex justify-center items-center p-4">
                    <PieChart data={tramitesporcategoria} />
                    </div>

                    <div className="w-full md:w-1/2 flex justify-center items-center p-4">
                        <div className="w-full max-w-lg">
                            <TramitesEstadoChart data={tramitesestado} />
                        </div>
                    </div>
                </div>
            </Box>
        </AuthenticatedLayout>
    );
}
