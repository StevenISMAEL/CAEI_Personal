import Modal from "./Modal";
import FloatInputText from "./FloatInputText";
import SearchDropdown from "./SearchInput";
import SecondaryButton from "./SecondaryButton";
import PrimaryButton from "./PrimaryButton";

const ModalCreate = ({
    title,
    showCreate,
    closeModalCreate,
    inputs,
    processing,
    handleSubmitAdd,
}) => {
    return (
        <Modal show={showCreate} onClose={closeModalCreate}>
            <form onSubmit={handleSubmitAdd} className="p-6">
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
                                    />
                                ) : (
                                    <FloatInputText
                                        {...input}
                                        isFocused={false}
                                        className="mt-3 block w-full"
                                    />
                                )}
                                {input.inputError}
                            </div>
                        ))}
                </div>
                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={closeModalCreate}>
                        Cancel
                    </SecondaryButton>

                    <PrimaryButton className="ms-3" disabled={processing}>
                        Save
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
};

export default ModalCreate;
