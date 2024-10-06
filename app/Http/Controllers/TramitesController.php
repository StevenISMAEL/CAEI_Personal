<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tramite;
use App\Models\TipoTramite;
use App\Models\User;
use App\Http\Requests\TramiteRequest;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use App\Mail\TramiteUpdateNotification; // Asegúrate de que la clase de notificación esté importada
use App\Models\categoria;
use App\Models\Notificaciones;
use Exception;
use Illuminate\Support\Facades\Log;


class TramitesController extends Controller {
    public function index() {
        return Inertia::render("Tramites/Tramite", [
            "Tramites" => Tramite::getTramites(),
            "TiposTramite" => TipoTramite::all(),
            "Usuarios" => User::whereHas("roles", function ($query) {
                $query->where("name", "arquitectorevisor");
            })->get(),
            "Categorias" => categoria::all(),
        ]);
    }

    public function index2(Request $request) {
        return Inertia::render("Tramites/Tramitefechas", [
            "Tramites" => Tramite::getTramites(),
        ]);
    }

    public function obtenerDatos(Request $request) {
        // Obtén los filtros directamente del request
        $fechaDesde = $request->input("fechaDesde");
        $fechaHasta = $request->input("fechaHasta");
        $estadoTramite = $request->input("estado_tramite");

        // Llama a tu método para obtener los tramites filtrados
        $tramites = Tramite::getTramitesFechas(
            $fechaDesde,
            $fechaHasta,
            $estadoTramite
        );

        // Retorna los datos filtrados como respuesta JSON
        return response()->json([
            "Tramites" => $tramites,
        ]);
    }

    public function store(TramiteRequest $tramiteRequest) {
        $validatedData = $tramiteRequest->validated();

        // Inicializa num_observaciones a 0 o 1 según el estado_tramite
        $validatedData["num_observaciones"] =
            $validatedData["estado_tramite"] === "Observación" ? 1 : 0;

        // Crear el trámite con todos los datos, incluyendo num_observaciones
        Tramite::create($validatedData);

        return to_route("tramite.index");
    }

    public function update(TramiteRequest $tramiteRequest, $id) {
        // Buscar el trámite existente
        $tramite = Tramite::findOrFail($id);
        // Verificar si el estado está cambiando de un estado diferente a 'Observación'
        if (
            $tramite->estado_tramite !== "Observación" &&
            $tramiteRequest->estado_tramite === "Observación"
        ) {
            // Si se cambia a 'observacion', incrementar el número de observaciones
            $tramite->num_observaciones += 1;
        }

        $tramite->update($tramiteRequest->validated());

        return to_route("tramite.index");
    }

    public function destroy($id) {
        Tramite::find($id)->delete();
        return to_route("tramite.index");
    }

    public function destroyMultiple(Request $request) {
        $ids = $request->input("ids");
        $tramites = Tramite::whereIn("id_tramite", $ids)->get();

        foreach ($tramites as $tramite) {
            $tramite->delete();
        }
        return to_route("tramite.index");
    }



    
    public function sendEmail(Request $request) {
        try {
            // Validación de los datos recibidos
            $request->validate([
                "estado_tramite" => "required|string",
                "propietario" => "required|string",
                "tramite" => "required|string",
                "correo_electronico" => "required|email",
                "id_tramite" => "required|integer",
            ]);

            $detalles = [
                "tramite" => $request->tramite,
                "propietario" => $request->propietario,
                "estado_tramite" => $request->estado_tramite,
                "correo_electronico" => $request->correo_electronico,
            ];


            Mail::to($request->correo_electronico)->send(
                new TramiteUpdateNotification($detalles)
            );
              // Crear el registro en la tabla de notificaciones
        Notificaciones::create([
            "id_tramite" => $request->id_tramite, 
            "fecha_envio" => now(),
            "estado" => $request->estado_tramite,
        ]);
            return redirect()
                ->back()
                ->with([
                    "message" => "Correo enviado con éxito.",
                    "type" => "success", // o 'error' dependiendo del caso
                ]);
        } catch (Exception $e) {

            // Devuelve un mensaje de error
            return redirect()
                ->back()
                ->with([
                    "message" =>
                        "Hubo un error al enviar el correo. Por favor, inténtelo de nuevo más tarde.",
                    "type" => "error",
                ]);
        }
    }
}
