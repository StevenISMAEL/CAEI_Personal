import { useState, useEffect } from "react";
import { Head, useRemember } from "@inertiajs/react";
import Header from "@/Components/Header";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Box from "@/Layouts/Box";
import ExportData from "@/Components/ExportData";
import TableCustomViewOnly from "@/Components/AuditTable"; 
import { FilterButton } from "@/Components/CustomButtons";
import Modal from "@/Components/Modal";
import FloatInputText from "@/Components/FloatInputText";
import SecondaryButton from "@/Components/SecondaryButton";
import PrimaryButton from "@/Components/PrimaryButton";
import tabs from "./tabs";
import Tab from "@/Layouts/TabLayout";
import CustomSelect from "@/Components/CustomSelect";
import CardsCustomOnlyView from "@/Components/AuditCard";
import { useNotify } from "@/Components/Toast";
import axios from 'axios'; // Asegúrate de importar axios

const Planos = ({ auth, Unificacionl }) => {

    const [formattedUnificacion, setFormattedUnificacion] = useState([]);
    const [showFilter, setShowFilter] = useState(false);
    const [filters, setFilters] = useRemember(
        { fechaDesde: "", fechaHasta: "", estado_tramite: "" }, 
        "unificacion-filters",
    );

    useEffect(() => {
        // Si fraccionamientos cambia, actualiza el estado
        setFormattedUnificacion(Unificacionl);
    }, [Unificacionl]);
   

    const exportData = formattedUnificacion.map((unificacion) => ({
        id_tramite: unificacion.id_tramite,
        tramite: unificacion.tramite,
        arquitecto_responsable: unificacion.arquitecto_responsable,
        uso_suelo: unificacion.uso_suelo,
        propietario: unificacion.propietario,
        fecha_ingreso: unificacion.fecha_ingreso,
        fecha_salida: unificacion.fecha_salida,
        clave_catastral: unificacion.clave_catastral,
        direccion: unificacion.direccion,
        estado_tramite: unificacion.estado_tramite,
        id_usuario: unificacion.id_usuario,
        nombre_usuario: unificacion.nombre_usuario,
        area_aprobada: unificacion.area_aprobada,
        num_observaciones: unificacion.num_observaciones,
        created_at: unificacion.created_at,
        
    }));

    const headers = ["Tramite", "Propietario", "Área aprobada"];
    const searchColumns = ["tramite", "propietario", "area_aprobada"];
   
    const theadersexsportar = [
        "Trámite",
        "Arquitecto R",
        "Clave Catastral",
        "Propietario",
        "Fecha de Ingreso",
        "Fecha de Salida",
        "Estado",
        "Arquitecto a cargo",
        "Dirección",
        "Area aprobada",
        "# observaciones",
        "Fecha creación",

    ];
    const columnasexportar = [
        "tramite",
        "nombre_usuario",
        "clave_catastral",
        "propietario",
        "fecha_ingreso",
        "fecha_salida",
        "estado_tramite",
        "arquitecto_responsable",
        "direccion",
        "area_aprobada",
        "num_observaciones",
        "created_at",
    ];

    const openFilterModal = () => setShowFilter(true);
    const closeFilterModal = () => setShowFilter(false);
    const notify = useNotify();

    const handleApplyFilters = (newFilters) => {
        setFilters(newFilters);
        fetchFilteredData(newFilters); // Llama a la API para obtener datos filtrados
        closeFilterModal();
    };

    const fetchFilteredData = async (filters) => {
        try {
            const response = await axios.get('/administrar-unificaciones/unificacionesfechas/datos', {
                params: {
                    fechaDesde: filters.fechaDesde || null,
                    fechaHasta: filters.fechaHasta || null,
                    estado_tramite: filters.estado_tramite || null,
                },
            });
    
            // Actualiza  los datos filtrados
            setFormattedUnificacion(response.data.Unificacionl); // Asegúrate de acceder correctamente a los datos
        } catch (error) {
            notify("error", "No se pudo filtrar la información.");

        }
    };
    

    const resetFilters = () => {
        setFilters({ fechaDesde: "", fechaHasta: "", estado_tramite: "" });
    };

    return (
        <AuthenticatedLayout
            header={<Header subtitle="Administrar Unificaciones " />}
            user={auth.user}
            roles={auth.user.roles.map((role) => role.name)}
        >
            <Head title="Unificación de lotes" />
            <Tab tabs={tabs}>
                <Box className="mt-3">
                    <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                        <FilterButton onClick={openFilterModal} />
                        <ExportData
                            data={exportData}
                            searchColumns={columnasexportar}
                            headers={theadersexsportar}
                            fileName="Unificación de lotes"
                        />
                    </div>
                </Box>

                <Box className="mt-3 hidden md:block">
                    <TableCustomViewOnly
                        headers={headers}
                        data={formattedUnificacion}
                        searchColumns={searchColumns}
                        columnasdetalles={columnasexportar}
                        theadersdetalles={theadersexsportar}
                        idKey="id_unificacion"
                    />
                </Box>
                <Box className="mt-3 md:hidden">
                    <CardsCustomOnlyView
                        headers={headers}
                        data={formattedUnificacion}
                        searchColumns={searchColumns}
                        columnasdetalles={columnasexportar}
                        theadersdetalles={theadersexsportar}
                        idKey="id_unificacion"
                    />
                </Box>
                <FilterModal
                    title="Filtrar Unificaciones"
                    showFilter={showFilter}
                    closeModalFilter={closeFilterModal}
                    handleApplyFilters={handleApplyFilters}
                    initialFilters={filters}
                    resetFilters={resetFilters}
                />
            </Tab>
        </AuthenticatedLayout>
    );
};

const FilterModal = ({
    title,
    showFilter,
    closeModalFilter,
    handleApplyFilters,
    initialFilters,
    resetFilters,
}) => {
    const [localFilters, setLocalFilters] = useState(initialFilters);
    const notify = useNotify();

    useEffect(() => {
        setLocalFilters(initialFilters);
    }, [initialFilters]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validar que la fecha desde no sea mayor que la fecha hasta
        const fechaDesde = new Date(localFilters.fechaDesde);
        const fechaHasta = new Date(localFilters.fechaHasta);

        if (
            localFilters.fechaDesde &&
            localFilters.fechaHasta &&
            fechaDesde > fechaHasta
        ) {
            notify("error", "La fecha desde no puede ser mayor a la fecha hasta.");
            return; // Salir si la validación falla
        }

        handleApplyFilters(localFilters); // Aplica los filtros si la validación es exitosa
    };

    const handleReset = () => {
        resetFilters();
        setLocalFilters({ fechaDesde: "", fechaHasta: "", estado_tramite: "" }); // Corrige el nombre aquí
    };

    const comboboxestado = [
        { id: "Revisión", name: "Revisión" },
        { id: "Observación", name: "Observación" },
        { id: "Negado", name: "Negado" },
        { id: "Aprobado", name: "Aprobado" },
    ];

    return (
        <Modal show={showFilter} onClose={closeModalFilter}>
            <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {title.toUpperCase()}
                </h3>
                <div className="mt-4">
                    <FloatInputText
                        label="Fecha desde"
                        type="date"
                        name="fechaDesde"
                        value={localFilters.fechaDesde}
                        onChange={handleChange}
                        className="mt-3 block w-full"
                    />
                    <FloatInputText
                        label="Fecha hasta"
                        type="date"
                        name="fechaHasta"
                        value={localFilters.fechaHasta}
                        onChange={handleChange}
                        className="mt-3 block w-full"
                    />
                    <CustomSelect
                        label="Estados trámite"
                        id="estado_tramite"
                        name="estado_tramite"
                        value={localFilters.estado_tramite}
                        onChange={handleChange}
                        options={comboboxestado}
                        className="mt-3 block w-full"
                    />
                </div>
                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={handleReset} className="mr-2">
                        Resetear
                    </SecondaryButton>
                    <SecondaryButton onClick={closeModalFilter} className="mr-2">
                        Cancelar
                    </SecondaryButton>
                    <PrimaryButton onClick={handleSubmit}>
                        Aplicar Filtros
                    </PrimaryButton>
                </div>
            </div>
        </Modal>
    );
};

export default Planos;
