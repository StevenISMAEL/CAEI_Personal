<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConCanton extends Model {
    use HasFactory;

    protected $table = "con_cantons";

    protected $primaryKey = "canton_id";
    public $incrementing = false;
    protected $keyType = "string";
    protected $fillable = ["canton_id", "province_id", "canton_name"];
    public $timestamps = false;

    protected static function booted() {
        static::creating(function ($model) {
            $latestCantonId = static::max("canton_id");
            $nextNumber = $latestCantonId
                ? intval(substr($latestCantonId, 4)) + 1
                : 1;
            $model->canton_id =
                "CAN-" . str_pad($nextNumber, 2, "0", STR_PAD_LEFT);
        });
    }

    public function province() {
        return $this->belongsTo(
            ConProvince::class,
            "province_id",
            "province_id"
        );
    }
}
