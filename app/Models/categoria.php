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
    protected $fillable = ["id_categoria", "nombres"];

    public function tipotramites() {
        return $this->hasMany(ConCanton::class, "id_categoria", "id_categoria");
    }
}
