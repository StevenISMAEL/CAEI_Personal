import { useState } from "react";
import { stringify } from "csv-stringify/browser/esm/sync";
import { ExportButton } from "./CustomButtons";

const ExportData = ({ data, searchColumns, headers, fileName = "Data" }) => {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = () => {
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

    return (
        <ExportButton
            onClick={handleExport}
            disabled={data.length === 0 || isExporting}
            isLoading={isExporting}
        />
    );
};

export default ExportData;
