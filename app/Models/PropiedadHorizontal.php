<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;


class PropiedadHorizontal extends Model  implements Auditable 
{
    use HasFactory;
    use \OwenIt\Auditing\Auditable;
    protected $auditStrict = true;
    
    protected $table = "propiedad_horizontal";
    protected $primaryKey = "id_propiedadh";
    public $incrementing = true;
    protected $keyType = "integer";
    protected $fillable = [
        "id_tramite",
        "definitivo",
        "modificatorio",
        "uso_suelo",
        "area_construccion",
    ];
    public $timestamps = true;

    public static function getPropiedadesH() {
        return self::with("tramite")
            ->get()
            ->map(function ($propiedad) {
                return [
                    "id_propiedadh" => $propiedad->id_propiedadh,
                    "id_tramite" => $propiedad->id_tramite,
                    "tramite" => $propiedad->tramite->tramite,
                    "definitivo" => $propiedad->definitivo,
                    "modificatorio" => $propiedad->modificatorio,
                    "uso_suelo" => $propiedad->uso_suelo,
                    "area_construccion" => $propiedad->area_construccion,
                    "propietario" => $propiedad->tramite->propietario,
                    "fecha_ingreso" => $propiedad->tramite->fecha_ingreso,
                    "fecha_salida" => $propiedad->tramite->fecha_salida,
                    "arquitecto_responsable" => $propiedad->tramite->arquitecto_responsable,
                    "clave_catastral" => $propiedad->tramite->clave_catastral,
                    "direccion" => $propiedad->tramite->direccion,
                    "estado_tramite" => $propiedad->tramite->estado_tramite,
                    "id_usuario" => $propiedad->tramite->id_usuario,
                    "nombre_usuario" => $propiedad->tramite->usuarios->name,
                    "created_at" => $propiedad->created_at,
                    "num_observaciones" => $propiedad->tramite->num_observaciones,

                ];
            });
    }


    public static function getPropiedadesFechas(
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
        
    
        return $query->get()->map(function ($propiedad) {
            return [
                "id_propiedadh" => $propiedad->id_propiedadh,
                "id_tramite" => $propiedad->id_tramite,
                "tramite" => $propiedad->tramite->tramite,
                "definitivo" => $propiedad->definitivo,
                "modificatorio" => $propiedad->modificatorio,
                "uso_suelo" => $propiedad->uso_suelo,
                "area_construccion" => $propiedad->area_construccion,
                "propietario" => $propiedad->tramite->propietario,
                "fecha_ingreso" => $propiedad->tramite->fecha_ingreso,
                "fecha_salida" => $propiedad->tramite->fecha_salida,
                "arquitecto_responsable" => $propiedad->tramite->arquitecto_responsable,
                "clave_catastral" => $propiedad->tramite->clave_catastral,
                "direccion" => $propiedad->tramite->direccion,
                "estado_tramite" => $propiedad->tramite->estado_tramite,
                "id_usuario" => $propiedad->tramite->id_usuario,
                "nombre_usuario" => $propiedad->tramite->usuarios->name,
                "created_at" => $propiedad->created_at,
                "num_observaciones" => $propiedad->tramite->num_observaciones,

            ];
        });


    }



    // Relación con el modelo Tramite
    public function tramite() {
        return $this->belongsTo(Tramite::class, "id_tramite", "id_tramite");
    }
}
