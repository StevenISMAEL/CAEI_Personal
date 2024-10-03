import { useState } from "react";
import { useForm, Head } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import Header from "@/Components/Header";
import Box from "@/Layouts/Box";
import { AddButton, DeleteButton } from "@/Components/CustomButtons";
import TableCustom from "@/Components/TableCustom";
import CardsCustom from "@/Components/CardCustom";
import DeleteModal from "@/Components/DeleteModal";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import PrimaryButton from "@/Components/PrimaryButton";
import ExportData from "@/Components/ExportDataSmall";
import { useNotify } from "@/Components/Toast";
import FloatInputText from "@/Components/FloatInputText";
import InputError from "@/Components/InputError";

const Employee = ({ auth, roles, employees }) => {
    const notify = useNotify();
    const {
        data,
        setData,
        processing,
        reset,
        delete: destroy,
        patch,
        post,
        clearErrors,
        errors,
    } = useForm({
        role_id: [],
        ids: [],
        name: "",
        email: "",
        username: "",
        password: "",
        password_confirmation: "",
    });

    const [showDelete, setShowDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [editData, setEditData] = useState(null);
    const [dataToDelete, setDataToDelete] = useState(null);
    const [selectedEmployees, setSelectedEmployees] = useState([]);

    const closeDeleteModal = () => {
        setShowDelete(false);
        setDataToDelete(null);
    };

    const openDeleteModal = (id) => {
        setShowDelete(true);
        setDataToDelete(id);
    };

    const closeEditModal = () => {
        clearErrors();
        setShowEdit(false);
        setEditData(null);
        reset();
    };
    const openEditModal = (employee) => {
        setEditData(employee);
        setData({
            name: employee.name,
            email: employee.email,
            username: employee.username,
            role_id: employee.roles.map((role) => role.role_id),
        });

        setShowEdit(true);
    };

    const handleSubmitEdit = (e) => {
        e.preventDefault();
        patch(route("usuarios.update", { id: editData.user_id }), {
            preserveScroll: true,
            onSuccess: () => {
                closeEditModal();
                notify("success", "Empleado actualizado.");
            },
            onError: (error) => console.error(error.message),
        });
    };

    const handleDelete = (id) => {
        if (Array.isArray(id)) {
            data.ids = id;
            destroy(route("usuarios.destroyMultiple"), {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedEmployees([]);
                    closeDeleteModal();
                    notify("success", "Empleados eliminados.");
                },
                onError: (error) => console.error(error.message),
            });
        } else {
            destroy(route("usuarios.destroy", { id }), {
                preserveScroll: true,
                onSuccess: () => {
                    closeDeleteModal();
                    notify("success", "Empleado eliminado.");
                },
                onError: (error) => console.error(error),
            });
        }
    };

    const theaders = [ "Usuario", "Roles", "Email"];
    const searchColumns = ["user_name", "roles", "email"];

    const handleCheckboxChange = (id) => {
        setSelectedEmployees((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((item) => item !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedEmployees.length === employees.length) {
            setSelectedEmployees([]);
        } else {
            setSelectedEmployees(employees.map((employee) => employee.user_id));
        }
    };

    const openDeleteModalForSelected = () => {
        setShowDelete(true);
        setDataToDelete(selectedEmployees);
    };

    const openAddModal = () => {
        setShowAdd(true);
    };

    const closeAddModal = () => {
        clearErrors();
        setShowAdd(false);
        reset();
    };

    const handleSubmitAdd = (e) => {
        e.preventDefault();
        post(route("empleados.store"), {
            preserveScroll: true,
            onSuccess: () => {
                closeAddModal();
                notify("success", "Usuario agregado.");
            },
            onError: (error) => console.error(Object.values(error).join(", ")),
        });
    };

    return (
        <Authenticated
            user={auth.user}
            roles={auth.user.roles.map((role) => role.name)}
            header={<Header subtitle="Usuarios" />}
        >
            <Head title="Usuarios" />
            <Box className="mt-3">
                <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                    <div className="w-full sm:w-auto flex flex-wrap justify-center gap-2">
                        <AddButton onClick={openAddModal} />
                        <DeleteButton
                            disabled={selectedEmployees.length === 0}
                            onClick={openDeleteModalForSelected}
                        />
                    </div>
                    <ExportData
                        data={employees}
                        searchColumns={searchColumns}
                        headers={theaders}
                        fileName="Usuarios"
                    />
                </div>
            </Box>
            <ModalEdit
                title="Editar Empleado"
                showEdit={showEdit}
                closeEditModal={closeEditModal}
                processing={processing}
                handleSubmitEdit={handleSubmitEdit}
                roles={roles}
                data={data} // Pasa los datos al modal
                setData={setData}
                errors={errors}
            />
            <ModalAdd
                showAdd={showAdd}
                closeAddModal={closeAddModal}
                processing={processing}
                roles={roles}
                handleSubmitAdd={handleSubmitAdd}
                data={data} // Pasa los datos al modal
                setData={setData}
                errors={errors}
            />
            <DeleteModal
                showDelete={showDelete}
                closeDeleteModal={closeDeleteModal}
                title={"Borrar Empleado"}
                handleDelete={() => handleDelete(dataToDelete)}
                processing={processing}
            />
            <Box className="mt-3 hidden md:block">
                <TableCustom
                    headers={theaders}
                    data={employees}
                    searchColumns={searchColumns}
                    onDelete={openDeleteModal}
                    onEdit={openEditModal}
                    idKey="user_id"
                    onSelectChange={handleCheckboxChange}
                    selectedItems={selectedEmployees}
                    onSelectAll={handleSelectAll}
                />
            </Box>
            <Box className="mt-3  md:hidden">
                <CardsCustom
                    headers={theaders}
                    data={employees}
                    searchColumns={searchColumns}
                    onDelete={openDeleteModal}
                    onEdit={openEditModal}
                    idKey="user_id"
                    onSelectChange={handleCheckboxChange}
                    selectedItems={selectedEmployees}
                    onSelectAll={handleSelectAll}
                />
            </Box>
        </Authenticated>
    );
};

export default Employee;

const ModalEdit = ({
    title,
    showEdit,
    closeEditModal,
    processing,
    handleSubmitEdit,
    roles,
    data,
    setData,
    errors,
}) => {
    const handleRoleChange = (roleId) => {
        const updatedRoles = data.role_id.includes(roleId)
            ? data.role_id.filter((id) => id !== roleId)
            : [...data.role_id, roleId];

        setData((prevData) => ({
            ...prevData,
            role_id: updatedRoles,
        }));
    };

    return (
        <Modal show={showEdit} onClose={closeEditModal}>
            <form onSubmit={handleSubmitEdit} className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {title.toUpperCase()}
                </h3>
                <FloatInputText
                    id="name"
                    type="text"
                    label="Nombre"
                    className="mt-1 block w-full"
                    value={data.name || ""}
                    readOnly
                    onChange={(e) => setData("name", e.target.value)}
                />
                <InputError message={errors.name} />
                <FloatInputText
                    id="email"
                    type="email"
                    label="Correo electrónico"
                    value={data.email || ""}
                    className="mt-1 block w-full"
                    onChange={(e) => setData("email", e.target.value)}
                    defaultValue={data.email || ""}
                    readOnly
                />
                <InputError message={errors.email} />
                

                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Roles
                </h4>
                {roles.map((role) => (
                    <div key={role.id}>
                        <input
                            type="checkbox"
                            checked={data.role_id.includes(role.id)}
                            onChange={() => handleRoleChange(role.id)}
                            className="mr-2 rounded dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-indigo-600 shadow-sm focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:focus:ring-offset-gray-800"
                        />
                        <label className="text-sm text-gray-700 dark:text-gray-300">
                            {role.name}
                        </label>
                    </div>
                ))}
                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={closeEditModal}>
                        Cancelar
                    </SecondaryButton>
                    <PrimaryButton className="ms-3" disabled={processing}>
                        Actualizar
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
};

const ModalAdd = ({
    showAdd,
    closeAddModal,
    processing,
    handleSubmitAdd,
    data,
    setData,
    roles,
    errors,
}) => {
    const handleRoleChange = (roleId) => {
        const updatedRoles = data.role_id.includes(roleId)
            ? data.role_id.filter((id) => id !== roleId)
            : [...data.role_id, roleId];

        setData((prevData) => ({
            ...prevData,
            role_id: updatedRoles,
        }));
    };

    return (
        <Modal show={showAdd} onClose={closeAddModal}>
            <form onSubmit={handleSubmitAdd} className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    AGREGAR USUARIO
                </h3>
                <FloatInputText
                    id="name"
                    type="text"
                    label="Nombre"
                    className="mt-1 block w-full"
                    value={data.name || ""}
                    onChange={(e) => setData("name", e.target.value)}
                />
                <InputError message={errors.name} />
                <FloatInputText
                    id="email"
                    type="email"
                    label="Email"
                    value={data.email || ""}
                    className="mt-1 block w-full"
                    onChange={(e) => setData("email", e.target.value)}
                />
                <InputError message={errors.email} />
                <FloatInputText
                    id="username"
                    type="text"
                    label="Nombre de usuario"
                    value={data.username || ""}
                    className="mt-1 block w-full"
                    onChange={(e) => setData("username", e.target.value)}
                />
                <InputError message={errors.username} />

                <FloatInputText
                    id="password"
                    type="password"
                    label="Contraseña"
                    value={data.password || ""}
                    className="mt-1 block w-full"
                    onChange={(e) => setData("password", e.target.value)}
                    autoComplete="new-password"
                />
                <InputError message={errors.password} className="mt-2" />

                <FloatInputText
                    id="password_confirmation"
                    type="password"
                    label="Confirmar Contraseña"
                    value={data.password_confirmation || ""}
                    className="mt-1 block w-full"
                    onChange={(e) =>
                        setData("password_confirmation", e.target.value)
                    }
                />
                <InputError
                    message={errors.password_confirmation}
                    className="mt-2"
                />

                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Roles
                </h4>
                {roles.map((role) => (
                    <div key={role.id}>
                        <input
                            type="checkbox"
                            checked={data.role_id.includes(role.id)}
                            onChange={() => handleRoleChange(role.id)}
                            className="mr-2 rounded dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-indigo-600 shadow-sm focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:focus:ring-offset-gray-800"
                        />
                        <label className="text-sm text-gray-700 dark:text-gray-300">
                            {role.name}
                        </label>
                    </div>
                ))}
                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={closeAddModal}>
                        Cancelar
                    </SecondaryButton>
                    <PrimaryButton className="ms-3" disabled={processing}>
                        Agregar
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
};
