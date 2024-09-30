<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\TrabajosVarios;
use App\Models\Tramite;
use App\Models\User;
use App\Http\Requests\TrabajosVariosRequest;

class TrabajosVariosController extends Controller {
    public function index() {
        return Inertia::render("TrabajosV/trabajosvarios", [
            "Trabajosv" => TrabajosVarios::getTrabajosVarios(),
            "Tramites" => Tramite::getTramitesPorCategoria("CATG-04"),
            "Usuarios" => User::whereHas('roles', function($query) {
                $query->where('name', 'arquitectorevisor');  })->get(),
        ]);
    }

    public function index2(Request $request) {

        return Inertia::render("TrabajosV/trabajosfechas", [
            "Trabajosv" => TrabajosVarios::getTrabajosVarios(),
        ]);
    }
    
     
    public function obtenerDatos(Request $request)
    {
         // Obtén los filtros directamente del request
         $fechaDesde = $request->input('fechaDesde');
         $fechaHasta = $request->input('fechaHasta');
         $estadoTramite = $request->input('estado_tramite');
 
         // Llama a tu método para obtener los datos filtrados
         $trabajosvarios = TrabajosVarios::getTrabajosvFechas($fechaDesde, $fechaHasta, $estadoTramite);
 
        // Retorna los datos filtrados como respuesta JSON
        return response()->json([
            'Trabajosv' => $trabajosvarios,
        ]);
    }


    public function store(TrabajosVariosRequest $request) {
        $validatedData = $request->validated();

        $fra = TrabajosVarios::create($validatedData);

        $tramiteId = $fra->id_tramite; 
        if ($tramiteId) {
            $tramite = Tramite::find($tramiteId);

            if (
                $tramite->estado_tramite !== "Observación" && $request->input("estado_tramite") === "Observación"
            ) {
                $tramite->num_observaciones += 1;
            }
            $tramite->update([
                "clave_catastral" => $request->input("clave_catastral"),
                "direccion" => $request->input("direccion"),
                "arquitecto_responsable" => $request->input(
                    "arquitecto_responsable"
                ),
                "estado_tramite" => $request->input("estado_tramite"),
                "fecha_salida" => $request->input("fecha_salida"),
            ]);
        }

        return to_route("trabajosvar.index");
    }


    public function update(TrabajosVariosRequest $request, $id) {
        $trabajov = TrabajosVarios::findOrFail($id);

        $trabajov->update($request->validated());

        $tramiteId = $trabajov->id_tramite;
        if ($tramiteId) {
            $tramite = Tramite::find($tramiteId);

            if (
                $tramite->estado_tramite !== "Observación" &&
                $request->input("estado_tramite") === "Observación"
            ) {
                $tramite->num_observaciones += 1;
            }

            $tramite->update([
                "clave_catastral" => $request->input("clave_catastral"),
                "direccion" => $request->input("direccion"),
                "arquitecto_responsable" => $request->input("arquitecto_responsable"),
                "estado_tramite" => $request->input("estado_tramite"),
                "fecha_salida" => $request->input("fecha_salida"),
            ]);
        }

        return to_route("trabajosvar.index");
    }

    public function destroy($id) {
        TrabajosVarios::find($id)->delete();
        return to_route("trabajosvar.index");
    }

    public function destroyMultiple(Request $request) {
        $ids = $request->input("ids");
        $trabajosv = TrabajosVarios::whereIn("id_trabajov", $ids)->get();

        foreach ($trabajosv as $trabajov) {
            $trabajov->delete();
        }
        return to_route("trabajosvar.index");
    }
}
