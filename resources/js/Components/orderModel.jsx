import FloatInputText from "./FloatInputText";
import SearchDropdown from "./SearchInput";
import SecondaryButton from "./SecondaryButton";
import PrimaryButton from "./PrimaryButton";
import ComboBox from "./ComboBox";
import Modal from "./Modalorder";

//import { jsPDF } from "jspdf";
//import "jspdf-autotable";

const ModalCreateOrder = ({
    showCreate,
    closeModalCreate,
    contractInputs,
    supportInputs,
    processing,
    handleSubmitAdd,
    numContract,
}) => {
    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        const generateTableRows = (inputs) => {
            return inputs.map((input) => [input.label, input.value]);
        };

        const tableStyles = {
            headStyles: {
                fontSize: 12,
                halign: "center", // Centrar texto
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
            { section: "Información del Cliente", inputs: contractInputs },
            { section: "SoporteS", inputs: supportInputs },
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
        doc.setTextColor(0, 0, 0); // Color negro para las firmas
        doc.setFontSize(12);

        // Firma del Vendedor
        doc.line(20, signatureStartY - 5, 80, signatureStartY - 5); // Línea encima de la firma del vendedor
        doc.text("Firma del Vendedor", 33, signatureStartY + 8);

        // Firma del Cliente
        doc.line(120, signatureStartY - 5, 180, signatureStartY - 5);
        doc.text("Firma del Cliente", 133, signatureStartY + 8);

        doc.save(`contract_${numContract}.pdf`);
    };

    return (
        <Modal show={showCreate} onClose={closeModalCreate}>
            <form onSubmit={handleSubmitAdd} className="p-3 pt-0">
                {/* Sección de Contrato */}
                <div className="mt-4 border-t border-l border-r rounded-t-lg p-4">
                    <h4 className="text-md font-medium text-white bg-green-600 text-center mb-2 py-2 rounded-lg">
                        Información del Contrato
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

                {/* Sección de Soporte */}
                <div className="mt-0 border-l border-r p-4 pt-1">
                    <h4 className="text-md font-medium text-white bg-green-600 text-center mb-2 py-2 rounded-lg">
                        Soporte
                    </h4>
                    <div className="grid grid-cols-4 gap-4">
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

                {/* Botones de Cancelar, Guardar y Convertir a PDF */}
                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={closeModalCreate}>
                        Cancelar
                    </SecondaryButton>
                    <PrimaryButton className="ms-3" disabled={processing}>
                        Guardar
                    </PrimaryButton>
                    <PrimaryButton className="ms-3" onClick={handleDownloadPDF}>
                        Convertir a PDF
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
};

export default ModalCreateOrder;
