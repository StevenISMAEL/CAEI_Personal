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


class TramitesController extends Controller {
    public function index() {
        return Inertia::render("Tramites/Tramite", [
            "Tramites" => Tramite::getTramites(),
            "TiposTramite" => TipoTramite::all(),
            "Usuarios" => User::all(),
            "Categorias" => categoria::all(),

        ]);
    }

    public function index2(Request $request) {

        return Inertia::render("Tramites/Tramitefechas", [
            "Tramites" => Tramite::getTramites(),
        ]);
    }
    
     
    public function obtenerDatos(Request $request)
    {
         // Obtén los filtros directamente del request
         $fechaDesde = $request->input('fechaDesde');
         $fechaHasta = $request->input('fechaHasta');
         $estadoTramite = $request->input('estado_tramite');
 
         // Llama a tu método para obtener los tramites filtrados
         $tramites = Tramite::getTramitesFechas($fechaDesde, $fechaHasta, $estadoTramite);
 
        // Retorna los datos filtrados como respuesta JSON
        return response()->json([
            'Tramites' => $tramites,
        ]);
    }


    public function store(TramiteRequest $tramiteRequest) {
        Tramite::create($tramiteRequest->validated());
        return to_route("tramite.index");
    }

    public function update(TramiteRequest $tramiteRequest, $id) {
        $tramite = Tramite::findOrFail($id);
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

        // Validación de los datos recibidos
        $request->validate([
            "estado_tramite" => "required|string",
            "propietario" => "required|string",
            "tramite" => "required|string",
            "correo_electronico" => "required|email",
        ]);

        $detalles = [
            "tramite" => $request->tramite,
            "propietario" => $request->propietario,
            "estado_tramite" => $request->estado_tramite,
             "correo_electronico"=>$request->correo_electronico,
        ];

        Mail::to($request->correo_electronico)->send(
            new TramiteUpdateNotification($detalles)
            
        );
        return redirect()->back()->with([
            'message' => 'Correo enviado con éxito.',
            'type' => 'success', // o 'error' dependiendo del caso
        ]);
        
    }

}
