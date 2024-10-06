<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class Documentacion extends Model  implements Auditable 
{
    use HasFactory;

    use \OwenIt\Auditing\Auditable;
    protected $auditStrict = true;
    
    protected $table = "documentos";
    protected $primaryKey = "id_documento";
    public $incrementing = true;
    protected $keyType = "integer";
    protected $fillable = [
        "id_tramite",
        "tipo_documento",
        "archivo",

    ];
    public $timestamps = true;



    public static function getDocumentacion() {
        return self::with("tramite")
            ->get()
            ->map(function ($documentos) {
                return [
                    "id_tramite" => $documentos->id_tramite,
                    "tramite" => $documentos->tramite->tramite,
                    "archivo" => $documentos->archivo,
                    "tipo_documento" => $documentos->tipo_documento,
                    "id_documento" => $documentos->id_documento,
                ];
            });
    }

    
    // Relación con el modelo Tramite
    public function tramite() {
        return $this->belongsTo(Tramite::class, "id_tramite", "id_tramite");
    }
}
