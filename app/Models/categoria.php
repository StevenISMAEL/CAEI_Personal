<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
//use OwenIt\Auditing\Contracts\Auditable;


class categoria extends Model
{
    use HasFactory;
    //use \OwenIt\Auditing\Auditable;

    //protected $auditStrict = true;
    
    protected $table = "categorias";
    protected $primaryKey = "id_categoria";
    public $incrementing = false;
    protected $keyType = "string";
    protected $fillable = ["id_categoria", "nombre"];
    public $timestamps = false;

      // Generar id_categoria único con formato específico
      protected static function booted()
      {
          static::creating(function ($model) {
              // Obtener el último id_categoria en formato numérico
              $latestCategoriaId = static::max("id_categoria");
              
              // Si no hay registros, el próximo id es 1
              $nextNumber = $latestCategoriaId
                  ? intval(substr($latestCategoriaId, 5)) + 1
                  : 1;
              
              // Formatear el id_categoria con prefijo "CATG-" y longitud total de 7 caracteres
              $model->id_categoria = "CATG-" . str_pad($nextNumber, 2, "0", STR_PAD_LEFT);
          });
      }
 
    public function tipotramites() {
        return $this->hasMany(TipoTramite::class, "id_categoria", "id_categoria");
    }
}
