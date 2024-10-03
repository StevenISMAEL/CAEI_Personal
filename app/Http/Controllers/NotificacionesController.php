<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\NotificacionRequest;
use App\Models\Notificaciones;
use App\Models\Tramite;
use Illuminate\Support\Facades\Mail;
use App\Mail\TramiteUpdateNotification;


class NotificacionesController extends Controller {
    public function index() {
        return Inertia::render("Notificacion/notificaciones", [
            "Notificacion" => Notificaciones::getNotificaciones(),
            "Tramites" => Tramite::getTramites(),
        ]);
    }


    public function store(NotificacionRequest $notificacionesRequest) {
        try {
            $validatedData = $notificacionesRequest->validated();
            $validatedData["fecha_envio"] = now();
    
            // Obtener más detalles del trámite si solo tienes el ID
            $tramite = Tramite::findOrFail($validatedData['id_tramite']);
            
            // Preparar los detalles para el correo
            $detalles = [
                "tramite" => $tramite->tramite, 
                "propietario" => $tramite->propietario,
                "estado_tramite" => $validatedData["estado"],
                "correo_electronico" => $tramite->correo_electronico,
            ];
    
            // Intentar enviar el correo
            Mail::to($tramite->correo_electronico)->send(
                new TramiteUpdateNotification($detalles)
            );
    
            // Si el correo fue enviado correctamente, crea la notificación
            Notificaciones::create($validatedData);
    
            return to_route("notificaciones.index")->with([
                "message" => "Notificación enviada y guardada con éxito.",
                "type" => "success",
            ]);
        } catch (\Exception $e) {
            return to_route("notificaciones.index")->with([
                "message" => "Hubo un error al enviar la notificación.",
                "type" => "error",
            ]);
        }
    }
    

    public function destroy($id) {
        Notificaciones::find($id)->delete();
        return to_route("notificaciones.index");
    }

    public function destroyMultiple(Request $request) {
        $ids = $request->input("ids");
        $notificaciones = Notificaciones::whereIn(
            "id_notificacion",
            $ids
        )->get();

        foreach ($notificaciones as $notificacion) {
            $notificacion->delete();
        }
        return to_route("notificaciones.index");
    }
}
