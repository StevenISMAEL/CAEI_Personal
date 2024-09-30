<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\PropiedadHorizontal;
use App\Models\Tramite;
use App\Models\User;
use App\Http\Requests\PropiedadHorizontalRequest;


class PropiedadHorizontalController extends Controller
{
    public function index() {
        return Inertia::render("Propiedad/Phorizontal", [
            "PropiedadHo" => PropiedadHorizontal::getPropiedadesH(),
            "Tramites" => Tramite::getTramitesPorCategoria("CATG-03"),
            "Usuarios" => User::whereHas('roles', function($query) {
                $query->where('name', 'arquitectorevisor');  })->get(),
        ]);
    }


    public function index2(Request $request) {

        return Inertia::render("Propiedad/propiedadhfechas", [
            "PropiedadHo" => PropiedadHorizontal::getPropiedadesH(),
        ]);
    }
    
     
    public function obtenerDatos(Request $request)
    {
         // Obtén los filtros directamente del request
         $fechaDesde = $request->input('fechaDesde');
         $fechaHasta = $request->input('fechaHasta');
         $estadoTramite = $request->input('estado_tramite');
 
         // Llama a tu método para obtener los datos filtrados
         $propiedad = PropiedadHorizontal::getPropiedadesFechas($fechaDesde, $fechaHasta, $estadoTramite);
 
        // Retorna los datos filtrados como respuesta JSON
        return response()->json([
            'PropiedadHo' => $propiedad,
        ]);
    }



    public function store(PropiedadHorizontalRequest $request) {
        $validatedData = $request->validated();

        $propiedad = PropiedadHorizontal::create($validatedData);

        $tramiteId = $propiedad->id_tramite; 
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

        return to_route("propiedadh.index");
    }

    public function update(PropiedadHorizontalRequest $request, $id) {
        $propiedad = PropiedadHorizontal::findOrFail($id);

        $propiedad->update($request->validated());

        $tramiteId = $propiedad->id_tramite;
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

        return to_route("propiedadh.index");
    }

    public function destroy($id) {
        PropiedadHorizontal::find($id)->delete();
        return to_route("propiedadh.index");
    }

    public function destroyMultiple(Request $request) {
        $ids = $request->input("ids");
        $propiedades = PropiedadHorizontal::whereIn("id_propiedadh", $ids)->get();

        foreach ($propiedades as $horizontal) {
            $horizontal->delete();
        }
        return to_route("propiedadh.index");
    }
}
