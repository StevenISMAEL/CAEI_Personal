<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fraccionamiento extends Model
{
    use HasFactory;

    protected $table = "fraccionamientos";
    protected $primaryKey = "id_fraccionamiento";
    public $incrementing = true;
    protected $keyType = "integer";
    protected $fillable = [
        "id_tramite",
        "area_aprobada",
        "uso_suelo",
    ];
    public $timestamps = true;

    public static function getFraccionamientos() {
        return self::with("tramite")
            ->get()
            ->map(function ($fraccionamiento) {
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
                   

                ];
            });
    }

    // Relación con el modelo Tramite
    public function tramite() {
        return $this->belongsTo(Tramite::class, "id_tramite", "id_tramite");
    }
}
