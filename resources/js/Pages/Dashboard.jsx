import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Header from "@/Components/Header";
import { Head } from "@inertiajs/react";
import Box from "@/Layouts/Box";

// Importa la imagen que deseas mostrar

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<Header subtitle={"Dashboard"} />}
        >
            <Head title="Dashboard" />
            <div className="text-center">
                <h2 className="text-xl font-bold">Bienvenido al Dashboard</h2>
                <p></p>
            {/* <img src="../images/Laguna.jpg" alt="Descripción de la imagen" className="mt-4" /> */}

            </div>
            {/* Aquí puedes añadir más componentes si lo deseas */}
        </AuthenticatedLayout>
    );
}
