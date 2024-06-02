import Authenticated from "@/Layouts/AuthenticatedLayout";
import Header from "@/Components/Header";

import FloatInputText from "@/Components/FloatInputText";
import TextInput from "@/Components/TextInput";
const Cliente = ({ auth }) => {
    return (
        <Authenticated
            user={auth.user}
            header={<Header subtitle={"CRUD Clientes"} />}
        >
            <h1>Create, Read, Update, Delete</h1>
            <FloatInputText />
            <TextInput />
        </Authenticated>
    );
};

export default Cliente;
