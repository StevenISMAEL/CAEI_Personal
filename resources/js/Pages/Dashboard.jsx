import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Header from "@/Components/Header";
import { Head } from "@inertiajs/react";
import Box from "@/Layouts/Box";
import Carrusel from "@/Components/Carrusel";

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<Header subtitle={"Inicio"} />}
        >
            <Head title="Inicio" />
            <div className="pt-4">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <img src="https://piedeplano.com/wp-content/uploads/2020/12/cimg0873.jpg?w=1024" alt="imagen" width="900" height="450" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
