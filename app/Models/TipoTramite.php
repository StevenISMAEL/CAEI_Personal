<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
//use OwenIt\Auditing\Contracts\Auditable;

class TipoTramite extends Model {
    use HasFactory;

    protected $table = "tipos_tramites";
    protected $primaryKey = "id_tipotramite";
    public $incrementing = false;
    protected $keyType = "string";
    protected $fillable = ["id_tipotramite", "id_categoria", "nombre"];
    public $timestamps = false;

    // Generar id_categoria único con formato específico
    protected static function booted() {
        static::creating(function ($model) {
            // Obtener el último id_categoria en formato numérico
            $latestTipot = static::max("id_tipotramite");

            // Si no hay registros, el próximo id es 1
            $nextNumber = $latestTipot
                ? intval(substr($latestTipot, 4)) + 1
                : 1;

            // Formatear el id_categoria con prefijo "TPT-" y longitud total de 7 caracteres
            $model->id_tipotramite =
                "TPT-" . str_pad($nextNumber, 3, "0", STR_PAD_LEFT);
        });
    }

    public static function getTiposTramites() {
        return self::with("categorias")
            ->get()
            ->map(function ($tipotramite) {
                return [
                    "id_categoria" => $tipotramite->id_categoria,
                    "id_tipotramite" => $tipotramite->id_tipotramite,
                    "nombre" => $tipotramite->nombre,
                    "nombrecategoria" => $tipotramite->categorias->nombre,
                ];
            });
    }

    public function tramites() {
        return $this->hasMany(Tramite::class, "id_tramite", "id_tramite");
    }

    public function categorias() {
        return $this->belongsTo(
            categoria::class,
            "id_categoria",
            "id_categoria"
        );
    }
}
