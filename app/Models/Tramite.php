<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tramite extends Model
{
    use HasFactory;

    protected $table = "tramites";
    protected $primaryKey = "id_tramite";
    public $incrementing = true;
    protected $keyType = "integer";
    protected $fillable = [
        "id_usuario",
        "id_tipotramite",
        "id_socio",
        "tramite",
        "propietario",
        "detalle",
        "fecha_ingreso",
        "fecha_salida",
        "informe",
        "entregado",
        "fecha_entrega",
        "reasignado",
        "fecha_reasignacion",
        "arquitecto_responsable",
        "clave_catastral",
        "direccion",
        "estado_tramite",
        "estado_ingreso"
    ];
    public $timestamps = false;

    public static function getTipoTramites() {
        return self::with("tipostramites", "usuarios")
            ->get()
            ->map(function ($tramite) {
                return [
                    "id_tramite" => $tramite->id_tramite, 
                    "id_usuario" => $tramite->id_usuario,
                    "nombre_usuario"=> $tramite->usuarios->name,
                    "id_tipotramite" => $tramite->id_tipotramite,
                    "id_socio" => $tramite->id_socio,
                    "tramite" => $tramite->tramite,
                    "propietario" => $tramite->propietario,
                    "detalle" => $tramite->detalle,
                    "fecha_ingreso" => $tramite->fecha_ingreso,
                    "fecha_salida" => $tramite->fecha_salida,
                    "informe" => $tramite->informe,
                    "entregado" => $tramite->entregado,
                    "fecha_entrega" => $tramite->fecha_entrega,
                    "reasignado" => $tramite->reasignado,
                    "fecha_reasignacion" => $tramite->fecha_reasignacion,
                    "arquitecto_responsable" => $tramite->arquitecto_responsable,
                    "clave_catastral" => $tramite->clave_catastral,
                    "direccion" => $tramite->direccion,
                    "estado_tramite" => $tramite->estado_tramite,
                    "estado_ingreso" => $tramite->estado_ingreso,
                    "nombre_tipotramite" => $tramite->tipostramites ? $tramite->tipostramites->nombre : null, 
                ];
            });
    }
    

    public function tipostramites() {
        return $this->belongsTo(TipoTramite::class, "id_tipotramite", "id_tipotramite");
    }

    
    public function usuarios() {
        return $this->belongsTo(User::class, "id_usuario", "id");
    }
    

    // public function planos() {
    //     return $this->hasMany(ConClient::class, "sector_id", "sector_id");
    // }
}
