<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Fraccionamiento;
use App\Models\Tramite;
use App\Models\User;
use App\Http\Requests\FraccionamientoRequest;

class FraccionamientoController extends Controller
{
    public function index() {
        return Inertia::render("Fraccionamiento/fraccionamientosuelo", [
            "Fraccionamientos" => Fraccionamiento::getFraccionamientos(),
            "Tramites" => Tramite::getTramites(),
            "Usuarios" => User::all(),
        ]);
    }
    public function store(FraccionamientoRequest $request) {
        $validatedData = $request->validated();

        $fra = Fraccionamiento::create($validatedData);

        $tramiteId = $fra->id_tramite; 
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

        return to_route("fraccionamiento.index");
    }

    public function update(FraccionamientoRequest $request, $id) {
        $fracc = Fraccionamiento::findOrFail($id);

        $fracc->update($request->validated());

        $tramiteId = $fracc->id_tramite;
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

        return to_route("fraccionamiento.index");
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
