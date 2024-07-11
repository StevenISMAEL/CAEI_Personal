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
    contractInputs,
    clientInfoInputs,
    technicalInfoInputs,
    processing,
    handleSubmitEdit,
}) => {
    return (
        <Modal show={showEdit} onClose={closeEditModal}>
            <form onSubmit={handleSubmitEdit} className="p-3 pt-0">
                {/* Sección de Contrato */}
                <div className="mt-4 border-t border-l border-r rounded-t-lg p-4 ">
                    <h4 className="text-md font-medium text-white bg-green-600 text-center mb-2 py-2 rounded-lg">
                        Contrato
                    </h4>
                    <div className="grid grid-cols-4 gap-4">
                        {contractInputs &&
                            contractInputs.map((input, index) => (
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
                                    ) : (
                                        <FloatInputText
                                            {...input}
                                            className="mt-2 mb-0 block w-full"
                                        />
                                    )}
                                    {input.inputError && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {input.inputError}
                                        </p>
                                    )}
                                </div>
                            ))}
                    </div>
                </div>

                {/* Sección de Información de Cliente */}
                <div className="mt-0 border-l border-r p-4 pt-1">
                    <h4 className="text-md font-medium text-white bg-green-600 text-center mb-2 py-2 rounded-lg">
                        Información de Cliente
                    </h4>
                    <div className="grid grid-cols-4 gap-4">
                        {clientInfoInputs &&
                            clientInfoInputs.map((input, index) => (
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
                                    ) : (
                                        <FloatInputText
                                            {...input}
                                            className="mt-2 mb-0 block w-full"
                                        />
                                    )}
                                    {input.inputError && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {input.inputError}
                                        </p>
                                    )}
                                </div>
                            ))}
                    </div>
                </div>

                {/* Sección de Información Técnica */}
                <div className="mt-0 border-b border-l border-r rounded-b-lg p-4 pt-1">
                    <h4 className="text-md font-medium text-white bg-green-600 text-center mb-2 py-2 rounded-lg">
                        Información Técnica
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                        {technicalInfoInputs &&
                            technicalInfoInputs.map((input, index) => (
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
                                    ) : (
                                        <FloatInputText
                                            {...input}
                                            className="mt-2 mb-0 block w-full"
                                        />
                                    )}
                                    {input.inputError && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {input.inputError}
                                        </p>
                                    )}
                                </div>
                            ))}
                    </div>
                </div>

                {/* Botones de Cancelar y Actualizar */}
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
