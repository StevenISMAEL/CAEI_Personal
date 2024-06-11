<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConAddress extends Model {
    use HasFactory;
    protected $table = "con_address";

    protected $primaryKey = "address_id";
    public $incrementing = false;
    protected $keyType = "string";
    protected $fillable = [
        "address_id",
        "parish_id",
        "address",
        "reference",
        "neighborhood",
    ];
    public $timestamps = false;

    protected static function booted() {
        static::creating(function ($model) {
            $latestAddressId = static::max("address_id");
            $nextNumber = $latestAddressId
                ? intval(substr($latestAddressId, 4)) + 1
                : 1;
            $model->address_id =
                "DIR-" . str_pad($nextNumber, 2, "0", STR_PAD_LEFT);
        });
    }

    public static function getAddresses() {
        return self::with("parish")
            ->get()
            ->map(function ($address) {
                return [
                    "address_id" => $address->address_id,
                    "parish_id" => $address->parish_id,
                    "parish_name" => $address->parish->parish_name,
                    "address" => $address->address,
                    "reference" => $address->reference,
                    "neighborhood" => $address->neighborhood,
                ];
            });
    }

    public function parish() {
        return $this->belongsTo(ConParish::class, "parish_id", "parish_id");
    }

    public function clients() {
        return $this->hasMany(ConClient::class, "address_id", "address_id");
    }
}
