<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;


class TrabajosVarios extends Model  implements Auditable 
{
    use HasFactory;
    use \OwenIt\Auditing\Auditable;
    protected $auditStrict = true;
    
    protected $table = "trabajos_varios";
    protected $primaryKey = "id_trabajov";
    public $incrementing = true;
    protected $keyType = "integer";
    protected $fillable = [
        "id_tramite",
        "uso_suelo",
    ];
    public $timestamps = true;

    public static function getTrabajosVarios() {
        return self::with("tramite")
            ->get()
            ->map(function ($trabajov) {
                return [
                    "id_trabajov" => $trabajov->id_trabajov,
                    "id_tramite" => $trabajov->id_tramite,
                    "tramite" => $trabajov->tramite->tramite,
                    "uso_suelo" => $trabajov->uso_suelo,
                   "propietario" => $trabajov->tramite->propietario,
                    "fecha_ingreso" => $trabajov->tramite->fecha_ingreso,
                    "fecha_salida" => $trabajov->tramite->fecha_salida,
                    "arquitecto_responsable" => $trabajov->tramite->arquitecto_responsable,
                    "clave_catastral" => $trabajov->tramite->clave_catastral,
                    "direccion" => $trabajov->tramite->direccion,
                    "estado_tramite" => $trabajov->tramite->estado_tramite,
                    "id_usuario" => $trabajov->tramite->id_usuario,
                    "nombre_usuario" => $trabajov->tramite->usuarios->name,
                    "created_at" => $trabajov->created_at,
                    "num_observaciones" => $trabajov->tramite->num_observaciones,

                ];
            });
    }

    public static function getTrabajosvFechas(
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
        
    
        return $query->get()->map(function ($trabajov) {
            return [
                "id_trabajov" => $trabajov->id_trabajov,
                "id_tramite" => $trabajov->id_tramite,
                "tramite" => $trabajov->tramite->tramite,
                "uso_suelo" => $trabajov->uso_suelo,
               "propietario" => $trabajov->tramite->propietario,
                "fecha_ingreso" => $trabajov->tramite->fecha_ingreso,
                "fecha_salida" => $trabajov->tramite->fecha_salida,
                "arquitecto_responsable" => $trabajov->tramite->arquitecto_responsable,
                "clave_catastral" => $trabajov->tramite->clave_catastral,
                "direccion" => $trabajov->tramite->direccion,
                "estado_tramite" => $trabajov->tramite->estado_tramite,
                "id_usuario" => $trabajov->tramite->id_usuario,
                "nombre_usuario" => $trabajov->tramite->usuarios->name,
                "created_at" => $trabajov->created_at,
                "num_observaciones" => $trabajov->tramite->num_observaciones,

            ];
        });
    }
    

    // Relación con el modelo Tramite
    public function tramite() {
        return $this->belongsTo(Tramite::class, "id_tramite", "id_tramite");
    }
}
