import { useState } from "react";
import { stringify } from "csv-stringify/browser/esm/sync";
import Dropdown from "@/Components/Dropdown";
import { ExportButton } from "@/Components/CustomButtons";

const ExportData = ({ data, searchColumns, headers, fileName = "Data" }) => {
    const [isExporting, setIsExporting] = useState(false);

    const exportCSV = () => {
        setIsExporting(true);

        try {
            const filteredData = data.map((item) => {
                const filteredItem = {};
                searchColumns.forEach((column) => {
                    if (column === "roles" && Array.isArray(item[column])) {
                        filteredItem[column] = item[column]
                            .map((role) => role.role_name)
                            .join(", ");
                    } else {
                        filteredItem[column] = item[column];
                    }
                });
                return filteredItem;
            });

            const csv = stringify(filteredData, {
                header: true,
                columns: searchColumns.map((column) => ({
                    key: column,
                    header: headers[searchColumns.indexOf(column)],
                })),
            });

            const BOM = "\uFEFF";
            const csvContent = BOM + csv;

            const blob = new Blob([csvContent], {
                type: "text/csv;charset=utf-8;",
            });

            const link = document.createElement("a");
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", `${fileName}.csv`);
                link.style.visibility = "hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                console.error(
                    "El navegador no soporta la descarga automática.",
                );
            }
        } catch (error) {
            console.error("Error al exportar CSV:", error);
        } finally {
            setIsExporting(false);
        }
    };

    const exportPDF = () => {
        // Implementa la lógica para exportar a PDF aquí
        console.log("Exportando a PDF...");
    };

    return (
        <Dropdown>
            <Dropdown.Trigger>
                <ExportButton disabled={data.length === 0 || isExporting} />
            </Dropdown.Trigger>
            <Dropdown.Content width="36">
                <Dropdown.Link onClick={exportCSV} disabled={isExporting}>
                    CSV
                </Dropdown.Link>
                <Dropdown.Link onClick={exportPDF} disabled={isExporting}>
                    PDF
                </Dropdown.Link>
            </Dropdown.Content>
        </Dropdown>
    );
};

export default ExportData;
