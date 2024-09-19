<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrabajosVarios extends Model
{
    use HasFactory;

    
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
                   

                ];
            });
    }

    // Relación con el modelo Tramite
    public function tramite() {
        return $this->belongsTo(Tramite::class, "id_tramite", "id_tramite");
    }
}
