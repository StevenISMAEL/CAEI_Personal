<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropiedadHorizontal extends Model
{
    use HasFactory;

    
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
            ->map(function ($plano) {
                return [
                    "id_propiedadh" => $plano->id_propiedadh,
                    "id_tramite" => $plano->id_tramite,
                    "tramite" => $plano->tramite->tramite,
                    "definitivo" => $plano->definitivo,
                    "modificatorio" => $plano->modificatorio,
                    "uso_suelo" => $plano->uso_suelo,
                    "area_construccion" => $plano->area_construccion,
                    "propietario" => $plano->tramite->propietario,
                    "fecha_ingreso" => $plano->tramite->fecha_ingreso,
                    "fecha_salida" => $plano->tramite->fecha_salida,
                    "arquitecto_responsable" => $plano->tramite->arquitecto_responsable,
                    "clave_catastral" => $plano->tramite->clave_catastral,
                    "direccion" => $plano->tramite->direccion,
                    "estado_tramite" => $plano->tramite->estado_tramite,
                    "id_usuario" => $plano->tramite->id_usuario,
                    "nombre_usuario" => $plano->tramite->usuarios->name,
                ];
            });
    }

    // Relación con el modelo Tramite
    public function tramite() {
        return $this->belongsTo(Tramite::class, "id_tramite", "id_tramite");
    }
}
