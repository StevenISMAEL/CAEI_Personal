<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\PlanoArq;
use App\Models\Tramite;
use App\Models\User;
use App\Http\Requests\PlanoArqRequest;

class PlanoArqController extends Controller {
    public function index() {
        return Inertia::render("Planos/planosarq", [
            "Planos" => PlanoArq::getPlanosArq(),
            "Tramites" => Tramite::getTramitesPorCategoria("CATG-01"),
            "Usuarios" => User::all(),
        ]);
    }

    public function index2(Request $request) {

        return Inertia::render("Planos/planosfechas", [
            "Planos" => PlanoArq::getPlanosArq(),
        ]);
    }
    
     
    public function obtenerDatos(Request $request)
    {
         // Obtén los filtros directamente del request
         $fechaDesde = $request->input('fechaDesde');
         $fechaHasta = $request->input('fechaHasta');
         $estadoTramite = $request->input('estado_tramite');
 
         // Llama a tu método para obtener los planos filtrados
         $planos = PlanoArq::getPlanosFecha($fechaDesde, $fechaHasta, $estadoTramite);
 
        // Retorna los datos filtrados como respuesta JSON
        return response()->json([
            'Planos' => $planos,
        ]);
    }



    public function store(PlanoArqRequest $request) {
        $validatedData = $request->validated();

        $plano = PlanoArq::create($validatedData);

        $tramiteId = $plano->id_tramite; 
        // para actualizar los campos de tramite
        if ($tramiteId) {
            Tramite::updateOrCreate(
                ["id_tramite" => $tramiteId], 
                [
                    "clave_catastral" => $request->input("clave_catastral"),
                    "direccion" => $request->input("direccion"),
                    "arquitecto_responsable" => $request->input("arquitecto_responsable"),
                    "estado_tramite" => $request->input("estado_tramite"),
                    "fecha_salida" => $request->input("fecha_salida"),
                ]
            );
        }

        return to_route("planoarq.index");
    }

    public function update(PlanoArqRequest $request, $id) {
        $plano = PlanoArq::findOrFail($id);

        $plano->update($request->validated());

        $tramiteId = $plano->id_tramite;
        // para actualizar los campos de tramite
        if ($tramiteId) {
            Tramite::updateOrCreate(
                ["id_tramite" => $tramiteId],
                [
                    "clave_catastral" => $request->input("clave_catastral"),
                    "direccion" => $request->input("direccion"),
                    "arquitecto_responsable" => $request->input("arquitecto_responsable"),
                    "estado_tramite" => $request->input("estado_tramite"),
                    "fecha_salida" => $request->input("fecha_salida"),

                ]
            );
        }

        return to_route("planoarq.index");
    }

    public function destroy($id) {
        PlanoArq::find($id)->delete();
        return to_route("planoarq.index");
    }

    public function destroyMultiple(Request $request) {
        $ids = $request->input("ids");
        $planos = PlanoArq::whereIn("id_planosarq", $ids)->get();

        foreach ($planos as $plano) {
            $plano->delete();
        }
        return to_route("planoarq.index");
    }
}
