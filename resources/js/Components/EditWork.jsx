import Modal from "./Modalorder";
import FloatInputText from "./FloatInputText";
import SearchDropdown from "./SearchInput";
import SecondaryButton from "./SecondaryButton";
import PrimaryButton from "./PrimaryButton";
import ComboBox from "./ComboBox";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
const ModalEdit = ({
    title,
    showEdit,
    closeEditModal,
    contractInputs,
    supportInputs,
    processing,
    handleSubmitEdit,
    numOrder,
}) => {
    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        const generateTableRows = (inputs) => {
            return inputs.map((input) => [input.label, input.value]);
        };

        const tableStyles = {
            headStyles: {
                fontSize: 12,
                halign: "center",
            },
            bodyStyles: {
                fillColor: [255, 255, 255],
                textColor: [75, 85, 99],
                fontSize: 10,
            },
            alternateRowStyles: {
                fillColor: [243, 244, 246],
                textColor: [75, 85, 99],
                fontSize: 10,
            },
        };

        const allInputs = [
            { section: "Información del Contrato", inputs: contractInputs },
            { section: "Información de soporte", inputs: supportInputs },
        ];

        const generateSectionRows = (section) => {
            return [
                [
                    {
                        content: section.section,
                        colSpan: 2,
                        styles: {
                            fillColor: [237, 233, 254],
                            textColor: [55, 65, 81],
                            fontSize: 12,
                            fontStyle: "bold",
                            halign: "center",
                        },
                    },
                ],
                ...generateTableRows(section.inputs),
            ];
        };

        const allRows = allInputs.reduce((rows, section) => {
            return rows.concat(generateSectionRows(section));
        }, []);

        doc.autoTable({
            startY: 20,
            body: allRows,
            ...tableStyles,
        });

        const signatureStartY = doc.lastAutoTable.finalY + 30;
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);

        doc.line(20, signatureStartY - 5, 80, signatureStartY - 5);
        doc.text("Nombre", 33, signatureStartY + 8);

        doc.line(120, signatureStartY - 5, 180, signatureStartY - 5);
        doc.text("Firma", 133, signatureStartY + 8);

        doc.save(`soporte_${numOrder}.pdf`);
    };
    return (
        <Modal show={showEdit} onClose={closeEditModal}>
            <form onSubmit={handleSubmitEdit} className="p-3 pt-0">
                {/* Sección de Orden */}
                <div className="mt-4 border-t border-l border-r rounded-t-lg p-4 ">
                    <h4 className="text-md font-medium text-white bg-green-600 text-center mb-2 py-2 rounded-lg">
                        Orden de trabajo
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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

                {/* Sección de Información de soporte */}
                <div className="mt-4 border-l border-r p-4 pt-1">
                    <h4 className="text-md font-medium text-white bg-green-600 text-center mb-2 py-2 rounded-lg">
                        Información de soporte
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        {supportInputs &&
                            supportInputs.map((input, index) => (
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
                <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-end">
                    <SecondaryButton className="mb-2 md:mb-0 "onClick={closeEditModal}>
                        Cancelar
                    </SecondaryButton>
                    <div className="flex flex-col md:flex-row gap-3  md:ml-4 ">
                        <PrimaryButton disabled={processing}>
                            Guardar
                        </PrimaryButton>
                        <PrimaryButton onClick={handleDownloadPDF}>
                            Convertir a PDF
                        </PrimaryButton>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default ModalEdit;
