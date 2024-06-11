<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConClient extends Model {
    use HasFactory;
    protected $table = "con_clients";

    protected $primaryKey = "client_id";
    public $incrementing = false;
    protected $keyType = "string";
    protected $fillable = [
        "client_id",
        "address_id",
        "client_name",
        "client_email",
    ];
    public $timestamps = false;

    public static function getClients() {
        return self::with("address")
            ->get()
            ->map(function ($client) {
                return [
                    "client_id" => $client->client_id,
                    "address_id" => $client->address_id,
                    "address" => $client->address->address,
                    "client_name" => $client->client_name,
                    "client_email" => $client->client_email,
                ];
            });
    }

    public function address() {
        return $this->belongsTo(ConAddress::class, "address_id", "address_id");
    }

    public function phones() {
        return $this->hasMany(ConPhone::class, "client_id", "client_id");
    }
}
