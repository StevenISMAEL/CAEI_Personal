<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\CategoriaRequest;
use App\Models\categoria;

class CategoriaController extends Controller
{
    public function index() {
        return Inertia::render("Categoria/categorias", [
            "Categorias" => categoria::all(),
        ]);
    }

    public function store(CategoriaRequest $categoriaRequest) {
        categoria::create($categoriaRequest->validated());
        return to_route("categoria.index");
    }

    public function update(CategoriaRequest $categoriaRequest, $id) {
        $categoria = categoria::findOrFail($id);
        $categoria->update($categoriaRequest->validated());
        return to_route("categoria.index");
    }

    public function destroy($id) {
        categoria::find($id)->delete();
        return to_route("categoria.index");
    }

    public function destroyMultiple(Request $request) {
        $ids = $request->input("ids");
        $categorias = categoria::whereIn("id_categoria", $ids)->get();

        foreach ($categorias as $categoria) {
            $categoria->delete();
        }
        return to_route("categoria.index");
    }
}
