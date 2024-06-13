<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IpDistribution extends Model
{
    use HasFactory;
    protected $table = "ip_distribution_naps";

    protected $primaryKey = "distribution_nap_id";
    public $incrementing = false;
    protected $keyType = "string";
    
    protected $fillable = [
        "distribution_nap_id",
        "olt_id",
        "distribution_nap_name",
        "distribution_nap_address",
        "distribution_nap_coordx",
        "distribution_nap_coordy",
        "distribution_nap_splitter",
    ];
    
    
    protected static function booted()
    {
        static::creating(function ($model) {
            $DistributionNapId = static::max("distribution_nap_id");
            $nextNumber = $DistributionNapId
                ? intval(substr($DistributionNapId, 4)) + 1
                : 1;
            $model->distribution_nap_id =
                "NDI-" . str_pad($nextNumber, 2, "0", STR_PAD_LEFT);
        });
    }

    public $timestamps = false;

    public static function getDistributionNaps() {
        return self::with("olts")
            ->get()
            ->map(function ($nap) {
                return [
                    "distribution_nap_id" => $nap->distribution_nap_id,
                    "olt_id" => $nap->olt_id,
                    "olt_name" => $nap->olts->olt_name,
                    "distribution_nap_name" => $nap->distribution_nap_name,
                    "distribution_nap_address" => $nap->distribution_nap_address,
                    "distribution_nap_coordx" => $nap->distribution_nap_coordx,
                    "distribution_nap_coordy" => $nap->distribution_nap_coordy,
                    "distribution_nap_splitter" => $nap->distribution_nap_splitter,
                ];
            });
    }

    public function olts() {
        return $this->belongsTo(
            IpOlts::class,
            "olt_id",
            "olt_id"
        );
    }

    public function olt() {
        return $this->belongsTo(IpOlts::class, "olt_id", "olt_id");
    }
}
