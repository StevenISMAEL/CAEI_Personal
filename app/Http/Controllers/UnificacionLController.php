<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\UnificacionL;
use App\Models\Tramite;
use App\Models\User;
use App\Http\Requests\UnificacionLRequest;


class UnificacionLController extends Controller
{
    public function index() {
        return Inertia::render("UnificacionL/unificacionlotes", [
            "Unificacionl" => UnificacionL::getUnificacionLotes(),
            "Tramites" => Tramite::getTramites(),
            "Usuarios" => User::all(),
        ]);
    }

    public function store(UnificacionLRequest $request) {
        $validatedData = $request->validated();

        $unificacionlot = UnificacionL::create($validatedData);

        $tramiteId = $unificacionlot->id_tramite; 
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

        return to_route("unificacionlotes.index");
    }


    public function update(UnificacionLRequest $request, $id) {
        $unificacionlot = UnificacionL::findOrFail($id);

        $unificacionlot->update($request->validated());

        $tramiteId = $unificacionlot->id_tramite;
        // para actualizar los campos de tramite
        if ($tramiteId) {
            Tramite::updateOrCreate(
                ["id_tramite" => $tramiteId],
                [
                    "clave_catastral" => $request->input("clave_catastral"),
                    "direccion" => $request->input("direccion"),
                    "arquitecto_responsable" => $request->input(
                        "arquitecto_responsable"
                    ),
                    "estado_tramite" => $request->input("estado_tramite"),
                    "fecha_salida" => $request->input("fecha_salida"),
                ]
            );
        }

        return to_route("unificacionlotes.index");
    }

    public function destroy($id) {
        UnificacionL::find($id)->delete();
        return to_route("unificacionlotes.index");
    }

    public function destroyMultiple(Request $request) {
        $ids = $request->input("ids");
        $unificaciones = UnificacionL::whereIn("id_unificacion", $ids)->get();

        foreach ($unificaciones as $unilotes) {
            $unilotes->delete();
        }
        return to_route("unificacionlotes.index");
    }
}
