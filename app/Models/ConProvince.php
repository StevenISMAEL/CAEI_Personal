<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConProvince extends Model {
    use HasFactory;
    protected $table = "con_provinces";
    protected $primaryKey = "province_id";
    public $incrementing = false;
    protected $keyType = "string";
    protected $fillable = ["province_id", "province_name"];

    public function cantons() {
        return $this->hasMany(ConCanton::class, "province_id", "province_id");
    }
}
