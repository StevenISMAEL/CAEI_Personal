<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlanoArq extends Model {
    use HasFactory;

    protected $table = "planos_arquitectonicos";
    protected $primaryKey = "id_planosarq";
    public $incrementing = true;
    protected $keyType = "integer";
    protected $fillable = [
        "id_tramite",
        "anteproyecto",
        "definitivo",
        "modificatorio",
        "ampliatorio",
        "uso_suelo",
        "area_construccion",
        "area_construccion2",
    ];
    public $timestamps = true;

    public static function getPlanosArq() {
        return self::with("tramite")
            ->get()
            ->map(function ($plano) {
                return [
                    "id_planosarq" => $plano->id_planosarq,
                    "id_tramite" => $plano->id_tramite,
                    "tramite" => $plano->tramite->tramite,
                    "anteproyecto" => $plano->anteproyecto,
                    "definitivo" => $plano->definitivo,
                    "modificatorio" => $plano->modificatorio,
                    "ampliatorio" => $plano->ampliatorio,
                    "uso_suelo" => $plano->uso_suelo,
                    "area_construccion" => $plano->area_construccion,
                    "area_construccion2" => $plano->area_construccion2,
                    "propietario" => $plano->tramite->propietario,
                    "fecha_ingreso" => $plano->tramite->fecha_ingreso,
                    "fecha_salida" => $plano->tramite->fecha_salida,
                    "arquitecto_responsable" => $plano->tramite->arquitecto_responsable,
                    "clave_catastral" => $plano->tramite->clave_catastral,
                    "direccion" => $plano->tramite->direccion,
                    "estado_tramite" => $plano->tramite->estado_tramite,
                    "id_usuario" => $plano->tramite->id_usuario,
                    "nombre_usuario" => $plano->tramite->usuarios->name,
                    "created_at" => $plano->created_at,
                    "num_observaciones" => $plano->tramite->num_observaciones,


                ];
            });
    }


    
    public static function getPlanosFecha(
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
        
    
        return $query->get()->map(function ($plano) {
            return [
                "id_planosarq" => $plano->id_planosarq,
                "id_tramite" => $plano->id_tramite,
                "tramite" => $plano->tramite->tramite,
                "anteproyecto" => $plano->anteproyecto,
                "definitivo" => $plano->definitivo,
                "modificatorio" => $plano->modificatorio,
                "ampliatorio" => $plano->ampliatorio,
                "uso_suelo" => $plano->uso_suelo,
                "area_construccion" => $plano->area_construccion,
                "area_construccion2" => $plano->area_construccion2,
                "propietario" => $plano->tramite->propietario,
                "fecha_ingreso" => $plano->tramite->fecha_ingreso,
                "fecha_salida" => $plano->tramite->fecha_salida,
                "arquitecto_responsable" => $plano->tramite->arquitecto_responsable,
                "clave_catastral" => $plano->tramite->clave_catastral,
                "direccion" => $plano->tramite->direccion,
                "estado_tramite" => $plano->tramite->estado_tramite,
                "id_usuario" => $plano->tramite->id_usuario,
                "nombre_usuario" => $plano->tramite->usuarios->name,
                "num_observaciones" => $plano->tramite->num_observaciones,


            ];
        });


    }

    // Relación con el modelo Tramite
    public function tramite() {
        return $this->belongsTo(Tramite::class, "id_tramite", "id_tramite");
    }
}
