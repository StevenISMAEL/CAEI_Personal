<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\SupTypeReport;
class SupTypeOrder extends Model
{
    use HasFactory;
    protected $table = "sup_type_order";

    protected $primaryKey = "type_order_id";
    public $incrementing = false;
    protected $keyType = "string";
    protected $fillable = [
        "type_order_id",
        "name_type_order",
        "description_type_order",
    ];

    public function type_reports()
    {
        return $this->hasMany(SupTypeReport::class, "type_order_id");
    }

}
