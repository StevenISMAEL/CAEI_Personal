import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Header from "@/Components/Header";
import { Head } from "@inertiajs/react";
import Box from "@/Layouts/Box";
import CardDash from "@/Components/CardDash";
import App from "@/Components/CakeChart";
import { GrDocumentUser } from "react-icons/gr";
import { MdOutlineNetworkCheck } from "react-icons/md";

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<Header subtitle={"Dashboard"} />}
            roles={auth.user.roles.map((role) => role.name)}
        >
            <Head title="Dashboard" />
            <Box className="pt-6">
                <div className="flex gap-3">
                    <CardDash
                        title="Contratos"
                        icon={<GrDocumentUser />}
                        value={40}
                        className="flex-grow"
                    />
                    <CardDash
                        title="Planes"
                        icon={<MdOutlineNetworkCheck />}
                        value={5}
                        className="flex-grow"
                    />
                </div>
            </Box>
            <Box className="pt-6">
                {/* <App /> */}
            </Box>
        </AuthenticatedLayout>
    );
}
