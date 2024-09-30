<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\DocumentacionRequest;
use App\Models\Documentacion;
use App\Models\Tramite;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class DocumentacionController extends Controller {
    public function index() {
        return Inertia::render("Documentacion/documentaciones", [
            "Documentacion" => Documentacion::getDocumentacion(),
            "Tramites" => Tramite::getTramites(),
        ]);
    }
    public function store(DocumentacionRequest $documentoRequest) {

        $validated = $documentoRequest->validated();

        if ($documentoRequest->hasFile("archivo")) {
            $file = $documentoRequest->file("archivo");
            $filename = $file->getClientOriginalName(); 
            $filePath = "documentos/" . $filename;

            // Guarda el archivo en el storage
            Storage::disk("public")->put($filePath, file_get_contents($file));

            // Guarda solo el nombre del archivo en la base de datos
            $validated["archivo"] = $filename;
        }

        Documentacion::create($validated);
        return to_route("documentaciones.index");
    }

  

    public function destroy($id) {
        $documentacion = Documentacion::findOrFail($id);

        // Eliminar el archivo si existe
        if ($documentacion->archivo) {
            Storage::disk("public")->delete(
                "documentos/" . $documentacion->archivo
            );
        }

        $documentacion->delete();
        return to_route("documentaciones.index");
    }

    public function destroyMultiple(Request $request) {
        $ids = $request->input("ids");
        $documentos = Documentacion::whereIn("id_documento", $ids)->get();

        foreach ($documentos as $documentacion) {
            if ($documentacion->archivo) {
                Storage::disk("public")->delete(
                    "documentos/" . $documentacion->archivo
                );
            }
            $documentacion->delete();
        }
        return to_route("documentaciones.index");
    }

    public function showWithFileName($id, $nombre) {
        $documentacion = Documentacion::findOrFail($id);

        // Verifica que el nombre del archivo sea correcto
        if ($documentacion->archivo !== $nombre) {
            abort(404); // Si no coincide, devuelve un error 404
        }

        $pathToFile = storage_path(
            "app/public/documentos/" . $documentacion->archivo
        );

        // Sirve el archivo con el nombre adecuado
        return response()->file($pathToFile, [
            "Content-Disposition" =>
                'inline; filename="' . $documentacion->archivo . '"',
        ]);
    }
}
