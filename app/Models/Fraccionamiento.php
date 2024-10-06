<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;


class Fraccionamiento extends Model  implements Auditable  {
    use HasFactory;

    use \OwenIt\Auditing\Auditable;
    protected $auditStrict = true;

    protected $table = "fraccionamientos";
    protected $primaryKey = "id_fraccionamiento";
    public $incrementing = true;
    protected $keyType = "integer";
    protected $fillable = ["id_tramite", "area_aprobada", "uso_suelo"];
    public $timestamps = true;

    public static function getFraccionamientos() {
        return self::with("tramite")
            ->get()
            ->map(function ($fraccionamiento) {
                return [
                    "id_fraccionamiento" =>
                        $fraccionamiento->id_fraccionamiento,
                    "id_tramite" => $fraccionamiento->id_tramite,
                    "tramite" => $fraccionamiento->tramite->tramite,
                    "area_aprobada" => $fraccionamiento->area_aprobada,
                    "uso_suelo" => $fraccionamiento->uso_suelo,
                    "propietario" => $fraccionamiento->tramite->propietario,
                    "fecha_ingreso" => $fraccionamiento->tramite->fecha_ingreso,
                    "fecha_salida" => $fraccionamiento->tramite->fecha_salida,
                    "arquitecto_responsable" =>
                        $fraccionamiento->tramite->arquitecto_responsable,
                    "clave_catastral" =>
                        $fraccionamiento->tramite->clave_catastral,
                    "direccion" => $fraccionamiento->tramite->direccion,
                    "estado_tramite" =>
                        $fraccionamiento->tramite->estado_tramite,
                    "id_usuario" => $fraccionamiento->tramite->id_usuario,
                    "nombre_usuario" =>
                        $fraccionamiento->tramite->usuarios->name,
                        "created_at" => $fraccionamiento->created_at,
                        "num_observaciones" => $fraccionamiento->tramite->num_observaciones,

                ];
            });
    }

    public static function getFraccionamientosFecha2(
        $fechaDesde,
        $fechaHasta,
        $estadoTramite
    ) {
        $query = self::with('tramite'); // Asegúrate de incluir la relación
    
        if ($fechaDesde) {
            $query->where("created_at", ">=", $fechaDesde);
        }
        if ($fechaHasta) {
            $query->where("created_at", "<=", $fechaHasta);
        }
        if ($estadoTramite) {
            // Usa whereHas para filtrar basado en la relación 'tramite'
            $query->whereHas('tramite', function ($q) use ($estadoTramite) {
                $q->where('estado_tramite', $estadoTramite);
            });
        }
        
    
        return $query->get()->map(function ($fraccionamiento) {
            return [
                "id_fraccionamiento" => $fraccionamiento->id_fraccionamiento,
                "id_tramite" => $fraccionamiento->id_tramite,
                "tramite" => $fraccionamiento->tramite->tramite,
                "area_aprobada" => $fraccionamiento->area_aprobada,
                "uso_suelo" => $fraccionamiento->uso_suelo,
                "propietario" => $fraccionamiento->tramite->propietario,
                "fecha_ingreso" => $fraccionamiento->tramite->fecha_ingreso,
                "fecha_salida" => $fraccionamiento->tramite->fecha_salida,
                "arquitecto_responsable" => $fraccionamiento->tramite->arquitecto_responsable,
                "clave_catastral" => $fraccionamiento->tramite->clave_catastral,
                "direccion" => $fraccionamiento->tramite->direccion,
                "estado_tramite" => $fraccionamiento->tramite->estado_tramite,
                "id_usuario" => $fraccionamiento->tramite->id_usuario,
                "nombre_usuario" => $fraccionamiento->tramite->usuarios->name,
                "num_observaciones" => $fraccionamiento->tramite->num_observaciones,

            ];
        });
    }
    

    // Relación con el modelo Tramite
    public function tramite() {
        return $this->belongsTo(Tramite::class, "id_tramite", "id_tramite");
    }
}
