<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\TipoTramiteRequest;
use App\Models\TipoTramite;
use App\Models\categoria;


class TipoTramiteController extends Controller
{
    public function index() {
        return Inertia::render("Categoria/tipotramites", [
            "TipoTramites" => TipoTramite::getTiposTramites(),
            "Categorias" => categoria::all(),

        ]);
    }

    public function store(TipoTramiteRequest $tipotramiteRequest) {
        TipoTramite::create($tipotramiteRequest->validated());
        return to_route("tipotramite.index");
    }

    public function update(TipoTramiteRequest $tipotramiteRequest, $id) {
        $tipotramiteup = TipoTramite::findOrFail($id);
        $tipotramiteup->update($tipotramiteRequest->validated());
        return to_route("tipotramite.index");
    }

    public function destroy($id) {
        TipoTramite::find($id)->delete();
        return to_route("tipotramite.index");
    }

    public function destroyMultiple(Request $request) {
        $ids = $request->input("ids");
        $tipotramite = TipoTramite::whereIn("id_tipotramite", $ids)->get();

        foreach ($tipotramite as $tiptramite) {
            $tiptramite->delete();
        }
        return to_route("tipotramite.index");
    }
}
