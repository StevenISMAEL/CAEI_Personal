<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Aforos;
use App\Models\Tramite;
use App\Models\User;
use App\Http\Requests\AforosRequest;
class AforosController extends Controller
{
    public function index() {
        return Inertia::render("Aforos/aforosper", [
            "Aforos" => Aforos::getAforos(),
            "Tramites" => Tramite::getTramitesPorCategoria("CATG-05"),
            "Usuarios" => User::all(),
        ]);
    }
    public function store(AforosRequest $request) {
        $validatedData = $request->validated();

        $aforo = Aforos::create($validatedData);

        $tramiteId = $aforo->id_tramite; 
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

        return to_route("aforos.index");
    }

    public function update(AforosRequest $request, $id) {
        $aforo = Aforos::findOrFail($id);

        $aforo->update($request->validated());

        $tramiteId = $aforo->id_tramite;
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

        return to_route("aforos.index");
    }

    public function destroy($id) {
        Aforos::find($id)->delete();
        return to_route("aforos.index");
    }

    public function destroyMultiple(Request $request) {
        $ids = $request->input("ids");
        $aforos = Aforos::whereIn("id_aforo", $ids)->get();

        foreach ($aforos as $aforo) {
            $aforo->delete();
        }
        return to_route("aforos.index");
    }
}