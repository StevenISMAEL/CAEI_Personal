<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notificaciones extends Model
{
    use HasFactory;

    
    protected $table = "notificaciones";
    protected $primaryKey = "id_notificacion";
    public $incrementing = true;
    protected $keyType = "integer";
    protected $fillable = ["id_notificacion", "id_tramite", "fecha_envio", "estado"];
    public $timestamps = false;





    public static function getNotificaciones() {
        return self::with("tramites")
            ->get()
            ->map(function ($notificacion) {
                return [
                    "id_notificacion" => $notificacion->id_notificacion,
                    "id_tramite" => $notificacion->id_tramite,
                    "tramite" => $notificacion->tramites->tramite,
                    "correo_electronico" => $notificacion->tramites->correo_electronico,
                    "estado_tramite" => $notificacion->tramites->estado_tramite,
                    "propietario" => $notificacion->tramites->propietario,
                    "fecha_envio" => $notificacion->fecha_envio,
                    "estado" => $notificacion->estado,

                ];
            });
    }

    public function tramites() {
        return $this->belongsTo(Tramite::class, "id_tramite", "id_tramite");
    }

}
