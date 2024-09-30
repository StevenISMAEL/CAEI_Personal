<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Fraccionamiento;
use App\Models\Tramite;
use App\Models\User;
use App\Http\Requests\FraccionamientoRequest;
use Illuminate\Support\Facades\Log;

class FraccionamientoController extends Controller {
    public function index() {
        return Inertia::render("Fraccionamiento/fraccionamientosuelo", [
            "Fraccionamientos" => Fraccionamiento::getFraccionamientos(),
            "Tramites" => Tramite::getTramitesPorCategoria("CATG-02"),
            "Usuarios" =>User::whereHas('roles', function($query) {
                $query->where('name', 'arquitectorevisor');  })->get(),
        ]);
    }


    public function index2(Request $request)
    {
        return Inertia::render("Fraccionamiento/fraccionamientosfecha", [
            'fraccionamientos' => Fraccionamiento::getFraccionamientos(),
        ]);
    }
    
    public function obtenerDatos(Request $request)
    {
         // Obtén los filtros directamente del request
         $fechaDesde = $request->input('fechaDesde');
         $fechaHasta = $request->input('fechaHasta');
         $estadoTramite = $request->input('estado_tramite');
 
         // Llama a tu método para obtener los fraccionamientos filtrados
         $fraccionamientos = Fraccionamiento::getFraccionamientosFecha2($fechaDesde, $fechaHasta, $estadoTramite);
 
        // Retorna los datos filtrados como respuesta JSON
        return response()->json([
            'fraccionamientos' => $fraccionamientos,
        ]);
    }
    

    public function store(FraccionamientoRequest $request) {
        $validatedData = $request->validated();

        $fra = Fraccionamiento::create($validatedData);

        $tramiteId = $fra->id_tramite;
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
                "arquitecto_responsable" => $request->input(
                    "arquitecto_responsable"
                ),
                "estado_tramite" => $request->input("estado_tramite"),
                "fecha_salida" => $request->input("fecha_salida"),
            ]);
        }

        return to_route("fraccionamiento.index");
    }

    public function update(FraccionamientoRequest $request, $id) {
        $fracc = Fraccionamiento::findOrFail($id);
    
        $fracc->update($request->validated());
    
        $tramiteId = $fracc->id_tramite;
            if ($tramiteId) {
            $tramite = Tramite::findOrFail($tramiteId);
                if ($tramite->estado_tramite !== 'observacion' && $request->input('estado_tramite') === 'observacion') {
                $tramite->num_observaciones += 1;
            }
                $tramite->update([
                'clave_catastral' => $request->input('clave_catastral'),
                'direccion' => $request->input('direccion'),
                'arquitecto_responsable' => $request->input('arquitecto_responsable'),
                'estado_tramite' => $request->input('estado_tramite'),
                'fecha_salida' => $request->input('fecha_salida'),
            ]);
        }
    
        return to_route('fraccionamiento.index');
    }
    

    public function destroy($id) {
        Fraccionamiento::find($id)->delete();
        return to_route("fraccionamiento.index");
    }

    public function destroyMultiple(Request $request) {
        $ids = $request->input("ids");
        $fracs = Fraccionamiento::whereIn("id_fraccionamiento", $ids)->get();

        foreach ($fracs as $fraccionamiento) {
            $fraccionamiento->delete();
        }
        return to_route("fraccionamiento.index");
    }
}
