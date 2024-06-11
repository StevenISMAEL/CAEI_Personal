<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConPhone extends Model {
    use HasFactory;
    protected $table = "con_phones";

    protected $primaryKey = "phone_number";
    public $incrementing = false;
    protected $keyType = "string";
    protected $fillable = ["phone_number", "client_id"];
    public $timestamps = false;

    public static function getPhones() {
        return self::with("client")
            ->get()
            ->map(function ($phone) {
                return [
                    "phone_number" => $phone->phone_number,
                    "client_id" => $phone->client_id,
                    "client_name" => $phone->client->client_name,
                ];
            });
    }

    public function client() {
        return $this->belongsTo(ConClient::class, "client_id", "client_id");
    }
}
