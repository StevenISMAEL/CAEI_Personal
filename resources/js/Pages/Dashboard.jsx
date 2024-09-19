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
            header={<Header subtitle={"Dashboard"} />}
        >
            <Head title="Dashboard" />
            <div className="pt-4">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        
                    </div>
                    <Carrusel />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
