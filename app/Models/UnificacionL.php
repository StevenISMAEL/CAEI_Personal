<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;


class UnificacionL extends Model  implements Auditable 
{
    use HasFactory;
    use \OwenIt\Auditing\Auditable;
    protected $auditStrict = true;
    
    protected $table = "unificacion_lotes";
    protected $primaryKey = "id_unificacion";
    public $incrementing = true;
    protected $keyType = "integer";
    protected $fillable = ["id_tramite", "area_aprobada"];
    public $timestamps = true;

    public static function getUnificacionLotes() {
        return self::with("tramite")
            ->get()
            ->map(function ($unificacionlotes) {
                return [
                    "id_unificacion" =>
                        $unificacionlotes->id_unificacion,
                    "id_tramite" => $unificacionlotes->id_tramite,
                    "tramite" => $unificacionlotes->tramite->tramite,
                    "area_aprobada" => $unificacionlotes->area_aprobada,
                    "propietario" => $unificacionlotes->tramite->propietario,
                    "fecha_ingreso" => $unificacionlotes->tramite->fecha_ingreso,
                    "fecha_salida" => $unificacionlotes->tramite->fecha_salida,
                    "arquitecto_responsable" =>
                        $unificacionlotes->tramite->arquitecto_responsable,
                    "clave_catastral" =>
                        $unificacionlotes->tramite->clave_catastral,
                    "direccion" => $unificacionlotes->tramite->direccion,
                    "estado_tramite" =>
                        $unificacionlotes->tramite->estado_tramite,
                    "id_usuario" => $unificacionlotes->tramite->id_usuario,
                    "nombre_usuario" =>
                        $unificacionlotes->tramite->usuarios->name,
                        "created_at" => $unificacionlotes->created_at,
                        "num_observaciones" => $unificacionlotes->tramite->num_observaciones,

                    ];
            });
    }

    public static function getUnificacionFecha(
        $fechaDesde,
        $fechaHasta,
        $estadoTramite
    ) {
        $query = self::with('tramite'); // Asegúrate de incluir la relación
    
        if ($fechaDesde) {
            $query->where("created_at", ">=", $fechaDesde);
        }
        if ($fechaHasta) {
            $query->where("created_at", "<=", $fechaHasta);
        }
        if ($estadoTramite) {
            // Usa whereHas para filtrar basado en la relación 'tramite'
            $query->whereHas('tramite', function ($q) use ($estadoTramite) {
                $q->where('estado_tramite', $estadoTramite);
            });
        }
        
    
        return $query->get()->map(function ($unificacionlotes) {
            return [
                    "id_unificacion" =>
                        $unificacionlotes->id_unificacion,
                    "id_tramite" => $unificacionlotes->id_tramite,
                    "tramite" => $unificacionlotes->tramite->tramite,
                    "area_aprobada" => $unificacionlotes->area_aprobada,
                    "propietario" => $unificacionlotes->tramite->propietario,
                    "fecha_ingreso" => $unificacionlotes->tramite->fecha_ingreso,
                    "fecha_salida" => $unificacionlotes->tramite->fecha_salida,
                    "arquitecto_responsable" =>
                        $unificacionlotes->tramite->arquitecto_responsable,
                    "clave_catastral" =>
                        $unificacionlotes->tramite->clave_catastral,
                    "direccion" => $unificacionlotes->tramite->direccion,
                    "estado_tramite" =>
                        $unificacionlotes->tramite->estado_tramite,
                    "id_usuario" => $unificacionlotes->tramite->id_usuario,
                    "nombre_usuario" =>
                        $unificacionlotes->tramite->usuarios->name,
                        "created_at" => $unificacionlotes->created_at,
                        "num_observaciones" => $unificacionlotes->tramite->num_observaciones,

                ];
            });

    }



    // Relación con el modelo Tramite
    public function tramite() {
        return $this->belongsTo(Tramite::class, "id_tramite", "id_tramite");
    }
}
