<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
//use OwenIt\Auditing\Contracts\Auditable;

class TipoTramite extends Model {
    use HasFactory;
    //use \OwenIt\Auditing\Auditable;

    //protected $auditStrict = true;

    protected $table = "tipos_tramites";
    protected $primaryKey = "id_tipotramite";
    public $incrementing = false;
    protected $keyType = "string";
    protected $fillable = ["id_tipotramite", "id_categoria", "nombre"];

    public function categoria() {
        return $this->belongsTo(
            categoria::class,
            "id_categoria",
            "id_categoria"
        );
    }

    public function tramites() {
        return $this->hasMany(Tramite::class, "id_tramite", "id_tramite");
    }
}
