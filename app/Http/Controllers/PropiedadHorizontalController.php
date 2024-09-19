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
            "Tramites" => Tramite::getTramites(),
            "Usuarios" => User::all(),
        ]);
    }
    public function store(PropiedadHorizontalRequest $request) {
        $validatedData = $request->validated();

        $propiedad = PropiedadHorizontal::create($validatedData);

        $tramiteId = $propiedad->id_tramite; 
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

        return to_route("propiedadh.index");
    }

    public function update(PropiedadHorizontalRequest $request, $id) {
        $propiedad = PropiedadHorizontal::findOrFail($id);

        $propiedad->update($request->validated());

        $tramiteId = $propiedad->id_tramite;
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
