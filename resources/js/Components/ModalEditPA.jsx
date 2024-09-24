import Modal from "./ModalTra";
import FloatInputText from "./FloatInputText";
import SearchDropdown from "./SearchInput";
import SecondaryButton from "./SecondaryButton";
import PrimaryButton from "./PrimaryButton";
import ThirdButton from "./ThirdButton";
import ComboBox from "./ComboBox";
import Checkbox from "./checkboxpa"; // Importar el nuevo componente Checkbox
const ModalEdit = ({
    showEdit,
    closeEditModal,
    nombre1,
    inputsclaves,
    inputstramite,
    nombre2,
    processing,
    handleSubmitEdit,
    handleSubmitEmail,
}) => {


    return (
        <Modal show={showEdit} onClose={closeEditModal}>
            <form onSubmit={handleSubmitEdit} className="p-3 pt-0">
                <div className="mt-4 border-t border-l border-r rounded-t-lg p-4">
                    <h4 className="text-md font-medium text-white bg-gray-800 dark:bg-gray-700 text-center mb-2 py-2 rounded-lg">
                        {nombre1}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {inputstramite &&
                            inputstramite.map((input, index) => (
                                <div key={index}>
                                    {input.type === "select" ? (
                                        <SearchDropdown
                                            {...input}
                                            className="mt-2 mb-0 block w-full"
                                        />
                                    ) : input.type === "combobox" ? (
                                        <ComboBox
                                            {...input}
                                            className="mt-2 mb-0 block w-full"
                                        />
                                    ) : input.type === "checkbox" ? (
                                        <Checkbox {...input} />
                                    ) : (
                                        <FloatInputText
                                            {...input}
                                            className="mt-2 mb-0 block w-full"
                                        />
                                    )}
                                    {input.inputError && (
                                        <>{input.inputError}</>
                                    )}
                                </div>
                            ))}
                    </div>
                </div>

                {/* Sección de Información de Cliente */}
                <div className="mt-0 border-l border-r p-4 pt-1">
                    <h4 className="text-md font-medium text-white bg-gray-800 text-center mb-2 py-2 rounded-lg">
                        {nombre2}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {inputsclaves &&
                            inputsclaves.map((input, index) => (
                                <div key={index}>
                                    {input.type === "select" ? (
                                        <SearchDropdown
                                            {...input}
                                            className="mt-2 mb-0 block w-full"
                                        />
                                    ) : input.type === "combobox" ? (
                                        <ComboBox
                                            {...input}
                                            className="mt-2 mb-0 block w-full"
                                        />
                                    ) : input.type === "checkbox" ? (
                                        <Checkbox {...input} />
                                    ) : (
                                        <FloatInputText
                                            {...input}
                                            className="mt-2 mb-0 block w-full"
                                        />
                                    )}
                                    {input.inputError && (
                                        <>{input.inputError}</>
                                    )}
                                </div>
                            ))}
                    </div>
                </div>

                {/* Botones de Cancelar y Actualizar */}
                <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-end">
                    <SecondaryButton onClick={closeEditModal}>
                        Cancelar
                    </SecondaryButton>
                    <div className="mt-3 md:mt-0 flex flex-col md:flex-row gap-3  md:ml-4 ">
                        <ThirdButton
                            className="ms-3"
                            disabled={processing}
                            onClick={handleSubmitEmail}
                        >
                            Enviar Correo
                        </ThirdButton>
                        <PrimaryButton className="ms-3" disabled={processing}>
                            Actualizar
                        </PrimaryButton>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default ModalEdit;
