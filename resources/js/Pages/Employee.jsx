import Authenticated from "@/Layouts/AuthenticatedLayout";
import Header from "@/Components/Header";
import Box from "@/Layouts/Box";

const Employee = ({ auth, roles, employees }) => {
    console.log(roles, "roles");
    console.log("permisos", roles.permissions);
    return (
        <Authenticated
            user={auth.user}
            roles={auth.user.roles.map((role) => role.name)}
            header={<Header subtitle="Empleados" />}
        >
            <Box className="mt-3">
                <ul className="text-lg text-gray-400">
                    {employees &&
                        employees.map((employee, index) => (
                            <li key={index}>
                                <h2>{employee.name}</h2>
                            </li>
                        ))}
                </ul>
                <h2 className="font-extrabold">Roles disponibles</h2>
                <ul className="text-lg text-gray-400">
                    {roles &&
                        roles.map((rol, index) => (
                            <li key={index}>
                                <h2>{rol.name}</h2>
                            </li>
                        ))}
                </ul>
            </Box>
        </Authenticated>
    );
};

export default Employee;
