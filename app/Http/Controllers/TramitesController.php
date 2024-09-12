<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tramite;
use App\Models\TipoTramite;
use App\Models\User;
use App\Http\Requests\TramiteRequest; 
use Inertia\Inertia;


class TramitesController extends Controller
{
    public function index() {

        return Inertia::render("Tramites/Tramite", [
       "Tramites" => Tramite::getTipoTramites(),
       "TiposTramite" => TipoTramite::all(),
       "Usuarios" => User::all(),
        ]);
    }

    public function store(TramiteRequest $tramiteRequest) {
        Tramite::create($tramiteRequest->validated());
        return to_route("tramite.index");
    }

    public function update(TramiteRequest $tramiteRequest, $id) {
        $canton = Tramite::findOrFail($id);
        $canton->update($tramiteRequest->validated());
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
}
