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
            "Usuarios" => User::whereHas('roles', function($query) {
                $query->where('name', 'arquitectorevisor');  })->get(),
        ]);
    }


    public function index2(Request $request) {

        return Inertia::render("Aforos/aforosfechas", [
            "Aforos" => Aforos::getAforos(),
        ]);
    }
    
     
    public function obtenerDatos(Request $request)
    {
         // Obtén los filtros directamente del request
         $fechaDesde = $request->input('fechaDesde');
         $fechaHasta = $request->input('fechaHasta');
         $estadoTramite = $request->input('estado_tramite');
 
         // Llama a tu método para obtener los aforos filtrados
         $aforos = Aforos::getPropiedadH($fechaDesde, $fechaHasta, $estadoTramite);
 
        // Retorna los datos filtrados como respuesta JSON
        return response()->json([
            'Aforos' => $aforos,
        ]);
    }




    public function store(AforosRequest $request) {
        $validatedData = $request->validated();

        $aforo = Aforos::create($validatedData);

        $tramiteId = $aforo->id_tramite; 
        // para actualizar los campos de tramite
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
                "arquitecto_responsable" => $request->input("arquitecto_responsable"),
                "estado_tramite" => $request->input("estado_tramite"),
                "fecha_salida" => $request->input("fecha_salida"),
            ]);
        }


        return to_route("aforos.index");
    }

    public function update(AforosRequest $request, $id) {
        $aforo = Aforos::findOrFail($id);

        $aforo->update($request->validated());

        $tramiteId = $aforo->id_tramite;
        // para actualizar los campos de tramite
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
                "arquitecto_responsable" => $request->input("arquitecto_responsable"),
                "estado_tramite" => $request->input("estado_tramite"),
                "fecha_salida" => $request->input("fecha_salida"),
            ]);
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