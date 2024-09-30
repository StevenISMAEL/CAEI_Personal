import Modal from "./Modal";
import FloatInputText from "./FloatInputText";
import SearchDropdown from "./SearchInput";
import SecondaryButton from "./SecondaryButton";
import PrimaryButton from "./PrimaryButton";
import ComboBox from "./ComboBox";

const ModalEdit = ({
    title,
    showEdit,
    closeEditModal,
    inputs,
    processing,
    handleSubmitEdit,
    editData, // Asegúrate de pasar editData como prop
}) => {

    console.log("inputsss",inputs);
    
    // Función para abrir el PDF y cambiar el título de la pestaña
    const openPdf = (url, fileName) => {
        const newTab = window.open(url, '_blank');
        newTab.onload = () => {
            newTab.document.title = fileName; // Cambia el título de la pestaña
        };
    };

    
    return (
        <Modal show={showEdit} onClose={closeEditModal}>
            <form onSubmit={handleSubmitEdit} className="p-6" encType="multipart/form-data">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {title.toUpperCase()}
                </h3>
                <div className="mt-4">
                    {inputs &&
                        inputs.map((input, index) => (
                            <div key={index}>
                                  {input.type === "select" ? (
                                    <SearchDropdown
                                        {...input}
                                        className="mt-3 block w-full"
                                        defaultValue={input.defaultValue}
                                    />
                                ) : input.type === "combobox" ? (
                                    <ComboBox
                                        {...input}
                                        className="mt-3 block w-full"
                                        defaultValue={input.defaultValue}
                                    />
                                ) : (
                                    <FloatInputText
                                        {...input}
                                        isFocused={index === 0}
                                        className="mt-3 block w-full"
                                        defaultValue={input.defaultValue}
                                    />
                                )}
                                {input.inputError}
                            </div>
                        ))}
                </div>

                {/* Botón para visualizar el archivo PDF */}
                {editData && editData.archivo && (
                    <div className="mt-4">
                        <p>Archivo actual: {editData.archivo}</p>
                        <a
                            // Llama a la función openPdf con la ruta que incluye el id y el nombre del archivo
                            onClick={(e) => {
                                e.preventDefault(); // Evita la acción predeterminada
                                openPdf(route('documentaciones.showWithFileName', [editData.id_documento, editData.archivo]), editData.archivo);
                            }}
                            className="text-blue-500 underline cursor-pointer"
                        >
                            Ver PDF
                        </a>
                    </div>
                )}

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

export default ModalEdit;
