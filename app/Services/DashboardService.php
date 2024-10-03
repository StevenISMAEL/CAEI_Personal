<?php

namespace App\Services;

use App\Models\Tramite;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class DashboardService {
    public function getConteoTramitesPorEstado() {
        return Tramite::select("estado_tramite", DB::raw("count(*) as total"))
            ->whereIn("estado_tramite", [
                "Aprobado",
                "Revisión",
                "Observación",
                "Negado",
            ])
            ->groupBy("estado_tramite")
            ->get()
            ->pluck("total", "estado_tramite")
            ->toArray();
    }
    public function getConteoTramitesPorCategoria() {
        return Tramite::select("id_tipotramite", DB::raw("count(*) as total"))
            ->with(["tipostramites.categorias"]) // Cargar la relación con categorías
            ->groupBy("id_tipotramite")
            ->get()
            ->map(function ($item) {
                return [
                    "nombre_categoria" =>
                        $item->tipostramites->categorias->nombre ?? "Sin Categoría", // Obtener el nombre de la categoría
                    "total" => $item->total,
                ];
            });
    }
    
}
