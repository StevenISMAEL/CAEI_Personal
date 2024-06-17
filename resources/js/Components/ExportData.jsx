import { useState } from "react";
import { stringify } from "csv-stringify/browser/esm/sync";
import { ExportButton } from "./CustomButtons";

const ExportData = ({ data, searchColumns, headers }) => {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = () => {
        setIsExporting(true);

        try {
            const filteredData = data.map((item) => {
                const filteredItem = {};
                searchColumns.forEach((column) => {
                    filteredItem[column] = item[column];
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

            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

            // Crear un enlace temporal para descargar el archivo
            const link = document.createElement("a");
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", "data_export.csv");
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

    return (
        <ExportButton
            onClick={handleExport}
            disabled={data.length === 0 || isExporting}
            isLoading={isExporting}
        />
    );
};

export default ExportData;
