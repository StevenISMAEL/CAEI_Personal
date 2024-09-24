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
import axios from 'axios'; // para la consulta

const Tramites = ({ auth, Tramites }) => {
    const [formattedTramites, setFormattedTramites] = useState(
        [],
    );
    const [showFilter, setShowFilter] = useState(false);
    const [filters, setFilters] = useRemember(
        { fechaDesde: "", fechaHasta: "", estado_tramite: "" }, 
        "Tramites-filters",
    );
    useEffect(() => {
        setFormattedTramites(Tramites);
    }, [Tramites]);



    const exportData = formattedTramites.map((tramite) => ({
        id_tramite: tramite.id_tramite,
            id_usuario: tramite.id_usuario,
            nombre_usuario:tramite.nombre_usuario,
            id_tipotramite: tramite.id_tipotramite,
            nombre_tipotramite: tramite.nombre_tipotramite,
            nombre_categoria: tramite.nombre,
            tramite: tramite.tramite,
            propietario: tramite.propietario,
            fecha_ingreso: tramite.fecha_ingreso,
            id_categoria: tramite.id_categoria,
            estado_ingreso: tramite.estado_ingreso,
            estado_tramite: tramite.estado_tramite,
            fecha_salida: tramite.fecha_salida,
            reasignado: tramite.reasignado,
            fecha_reasignacion: tramite.fecha_reasignacion,
            informe: tramite.informe,
            entregado: tramite.entregado,
            fecha_entrega: tramite.fecha_entrega,
            correo_electronico: tramite.correo_electronico,
    }));

    const headers = ["Tramite", "Propietario", "Estado de ingreso"];
    const searchColumns = ["tramite", "propietario", "estado_ingreso"];
    const theadersexsportar = [
        "Estado",
        "Trámite",
        "Arquiecto R",
        "Tipo de Trámite",
        "Propietario",
        "Fecha de Ingreso",
        "Estado",
        "Fecha salida",
    ];
    const columnasexportar = [
        "estado_ingreso",
        "tramite",
        "nombre_usuario",
        "nombre_tipotramite",
        "propietario",
        "fecha_ingreso",
        "estado_tramite",
        "fecha_salida",
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
            const response = await axios.get('/administrar-tramites/Tramitefechas/datos', {
                params: {
                    fechaDesde: filters.fechaDesde || null,
                    fechaHasta: filters.fechaHasta || null,
                    estado_tramite: filters.estado_tramite || null,
                },
            });
    
            // Actualiza con los datos filtrados
            setFormattedTramites(response.data.Tramites); 
        } catch (error) {
            notify("error", "No se pudo filtrar la información.");
        }
    };
    

    const resetFilters = () => {
        setFilters({ fechaDesde: "", fechaHasta: "", estado_tramite: "" });
    };

    return (
        <AuthenticatedLayout
            header={<Header subtitle="Administrar Trámites" />}
            user={auth.user}
            roles={auth.user.roles.map((role) => role.name)}
        >
            <Head title="Trámites" />
            <Tab tabs={tabs}>
                <Box className="mt-3">
                    <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                        <FilterButton onClick={openFilterModal} />
                        <ExportData
                            data={exportData}
                            searchColumns={columnasexportar}
                            headers={theadersexsportar}
                            fileName="Trámites"
                        />
                    </div>
                </Box>

                <Box className="mt-3 hidden md:block">
                    <TableCustomViewOnly
                        headers={headers}
                        data={formattedTramites}
                        searchColumns={searchColumns}
                        columnasdetalles= {columnasexportar}
                        theadersdetalles = {theadersexsportar}
                        idKey="id_tramite"
                    />
                </Box>
                <Box className="mt-3  md:hidden">
                    <CardsCustomOnlyView
                        headers={headers}
                        data={formattedTramites}
                        searchColumns={searchColumns}
                        columnasdetalles= {columnasexportar}
                        theadersdetalles= {theadersexsportar}
                        idKey="id_tramite"
                    />
                </Box>
                <FilterModal
                    title="Filtrar trámites"
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
        setLocalFilters({ fechaDesde: "", fechaHasta: "", estado: "" });
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
                    <SecondaryButton
                        onClick={closeModalFilter}
                        className="mr-2"
                    >
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

export default Tramites;
