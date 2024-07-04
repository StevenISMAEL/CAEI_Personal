export default function ErrorPage({ status }) {
    const title = {
        503: "503: Servicio No Disponible",
        500: "500: Error del Servidor",
        404: "404: Página No Encontrada",
        403: "403: Prohibido",
    }[status];

    const description = {
        503: "Lo siento, estamos haciendo mantenimiento. Por favor, vuelve pronto.",
        500: "Vaya, algo salió mal en nuestros servidores.",
        404: "Lo siento, no se pudo encontrar la página que estás buscando.",
        403: "Lo siento, no tienes permiso para acceder a esta página.",
    }[status];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h1 className="text-4xl font-bold text-red-500 mb-4">
                    {title}
                </h1>
                <p className="text-gray-700">{description}</p>
            </div>
        </div>
    );
}
