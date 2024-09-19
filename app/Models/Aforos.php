<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Aforos extends Model
{
    use HasFactory;

    protected $table = "aforos";
    protected $primaryKey = "id_aforo";
    public $incrementing = true;
    protected $keyType = "integer";
    protected $fillable = [
        "id_tramite",
        "uso_suelo",
        "local_comercial",
        "aforo_personas",
        "area_construccion",
        "inspeccion",
    ];
    public $timestamps = true;

    // Método para obtener todos los aforos con información relacionada del trámite
    public static function getAforos() {
        return self::with("tramite")
            ->get()
            ->map(function ($aforo) {
                return [
                    "id_aforo" => $aforo->id_aforo,
                    "id_tramite" => $aforo->id_tramite,
                    "tramite" => $aforo->tramite->tramite,
                    "uso_suelo" => $aforo->uso_suelo,
                    "local_comercial" => $aforo->local_comercial,
                    "aforo_personas" => $aforo->aforo_personas,
                    "area_construccion" => $aforo->area_construccion,
                    "inspeccion" => $aforo->inspeccion,
                    "propietario" => $aforo->tramite->propietario,
                    "fecha_ingreso" => $aforo->tramite->fecha_ingreso,
                    "fecha_salida" => $aforo->tramite->fecha_salida,
                    "arquitecto_responsable" => $aforo->tramite->arquitecto_responsable,
                    "clave_catastral" => $aforo->tramite->clave_catastral,
                    "direccion" => $aforo->tramite->direccion,
                    "estado_tramite" => $aforo->tramite->estado_tramite,
                    "id_usuario" => $aforo->tramite->id_usuario,
                    "nombre_usuario" => $aforo->tramite->usuarios->name,
                ];
            });
    }

    public function tramite() {
        return $this->belongsTo(Tramite::class, "id_tramite", "id_tramite");
    }
}
