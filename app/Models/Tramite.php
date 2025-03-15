<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class Tramite extends Model  implements Auditable  {
    use HasFactory;
    use \OwenIt\Auditing\Auditable;
    protected $auditStrict = true;

    protected $table = "tramites";
    protected $primaryKey = "id_tramite";
    public $incrementing = true;
    protected $keyType = "integer";
    protected $fillable = [
        "id_usuario",
        "id_tipotramite",
        "tramite",
        "propietario",
        "fecha_ingreso",
        "fecha_salida",
        "informe",
        "entregado",
        "fecha_entrega",
        "reasignado",
        "fecha_reasignacion",
        "arquitecto_responsable",
        "clave_catastral",
        "direccion",
        "estado_tramite",
        "estado_ingreso",
        "correo_electronico",
        "num_observaciones",
    ];
    public $timestamps = true;

    public static function getTramites() {
        return self::with("tipostramites", "usuarios")
            ->get()
            ->map(function ($tramite) {
                return [
                    "id_tramite" => $tramite->id_tramite,
                    "id_usuario" => $tramite->id_usuario,
                    "nombre_usuario" => $tramite->usuarios->name,
                    "id_tipotramite" => $tramite->id_tipotramite,
                    "tramite" => $tramite->tramite,
                    "propietario" => $tramite->propietario,
                    "fecha_ingreso" => $tramite->fecha_ingreso,
                    "fecha_salida" => $tramite->fecha_salida,
                    "informe" => $tramite->informe,
                    "entregado" => $tramite->entregado,
                    "fecha_entrega" => $tramite->fecha_entrega,
                    "reasignado" => $tramite->reasignado,
                    "fecha_reasignacion" => $tramite->fecha_reasignacion,
                    "arquitecto_responsable" =>
                        $tramite->arquitecto_responsable,
                    "clave_catastral" => $tramite->clave_catastral,
                    "direccion" => $tramite->direccion,
                    "estado_tramite" => $tramite->estado_tramite,
                    "estado_ingreso" => $tramite->estado_ingreso,
                    "correo_electronico" => $tramite->correo_electronico,
                    "num_observaciones" => $tramite->num_observaciones,
                    "nombre_tipotramite" => $tramite->tipostramites
                        ? $tramite->tipostramites->nombre
                        : null,
                    "created_at" => $tramite->created_at,
                ];
            });
    }

    public static function getTramitesFechas(
        $fechaDesde,
        $fechaHasta,
        $estadoTramite
    ) {
        $query = self::query();

        if ($fechaDesde) {
            $query->where("created_at", ">=", $fechaDesde);
        }
        if ($fechaHasta) {
            $query->where("created_at", "<=", $fechaHasta);
        }
        if ($estadoTramite) {
            // Usa whereHas para filtrar basado en la relación 'tramite'
            $query->where("estado_tramite", $estadoTramite);
        }

        return $query->get()->map(function ($tramite) {
            return [
                "id_tramite" => $tramite->id_tramite,
                "id_usuario" => $tramite->id_usuario,
                "nombre_usuario" => $tramite->usuarios->name,
                "id_tipotramite" => $tramite->id_tipotramite,
                "tramite" => $tramite->tramite,
                "propietario" => $tramite->propietario,
                "fecha_ingreso" => $tramite->fecha_ingreso,
                "fecha_salida" => $tramite->fecha_salida,
                "informe" => $tramite->informe,
                "entregado" => $tramite->entregado,
                "fecha_entrega" => $tramite->fecha_entrega,
                "reasignado" => $tramite->reasignado,
                "fecha_reasignacion" => $tramite->fecha_reasignacion,
                "arquitecto_responsable" => $tramite->arquitecto_responsable,
                "clave_catastral" => $tramite->clave_catastral,
                "direccion" => $tramite->direccion,
                "estado_tramite" => $tramite->estado_tramite,
                "estado_ingreso" => $tramite->estado_ingreso,
                "correo_electronico" => $tramite->correo_electronico,
                "num_observaciones" => $tramite->num_observaciones,
                "nombre_tipotramite" => $tramite->tipostramites
                    ? $tramite->tipostramites->nombre
                    : null,
                "created_at" => $tramite->created_at,
            ];
        });
    }

    public static function getTramitesPorCategoria($categoriaId) {
        return self::with("tipostramites", "usuarios")
            ->whereHas("tipostramites", function ($query) use ($categoriaId) {
                $query
                    ->where("id_categoria", $categoriaId)
                    ->whereRaw("LOWER(nombre) != ?", [
                        strtolower("Unificación de lotes"),
                    ]); // Excluir "Unificación de lotes" sin importar mayúsculas/minúsculas
            })
            ->where("estado_tramite", "!=", "Aprobado") // Condición para excluir trámites aprobados
            ->get()
            ->map(function ($tramite) {
                return [
                    "id_tramite" => $tramite->id_tramite,
                    "id_usuario" => $tramite->id_usuario,
                    "nombre_usuario" => $tramite->usuarios->name,
                    "id_tipotramite" => $tramite->id_tipotramite,
                    "tramite" => $tramite->tramite,
                    "propietario" => $tramite->propietario,
                    "fecha_ingreso" => $tramite->fecha_ingreso,
                    "fecha_salida" => $tramite->fecha_salida,
                    "informe" => $tramite->informe,
                    "entregado" => $tramite->entregado,
                    "fecha_entrega" => $tramite->fecha_entrega,
                    "reasignado" => $tramite->reasignado,
                    "fecha_reasignacion" => $tramite->fecha_reasignacion,
                    "arquitecto_responsable" =>
                        $tramite->arquitecto_responsable,
                    "clave_catastral" => $tramite->clave_catastral,
                    "direccion" => $tramite->direccion,
                    "estado_tramite" => $tramite->estado_tramite,
                    "estado_ingreso" => $tramite->estado_ingreso,
                    "correo_electronico" => $tramite->correo_electronico,
                    "num_observaciones" => $tramite->num_observaciones,
                    "nombre_tipotramite" => $tramite->tipostramites
                        ? $tramite->tipostramites->nombre
                        : null,
                    "created_at" => $tramite->created_at,
                ];
            });
    }

    public static function getTramitesUnificacion() {
        return self::with("tipostramites", "usuarios")
            ->where("estado_tramite", "!=", "Aprobado") // Excluir trámites aprobados
            ->whereHas("tipostramites", function ($query) {
                $query->whereRaw("LOWER(REPLACE(nombre, 'á', 'a')) = ?", ['unificacion de lotes']);

            })
            ->get()
            ->map(function ($tramite) {
                return [
                    "id_tramite" => $tramite->id_tramite,
                    "id_usuario" => $tramite->id_usuario,
                    "nombre_usuario" => $tramite->usuarios->name,
                    "id_tipotramite" => $tramite->id_tipotramite,
                    "tramite" => $tramite->tramite,
                    "propietario" => $tramite->propietario,
                    "fecha_ingreso" => $tramite->fecha_ingreso,
                    "fecha_salida" => $tramite->fecha_salida,
                    "informe" => $tramite->informe,
                    "entregado" => $tramite->entregado,
                    "fecha_entrega" => $tramite->fecha_entrega,
                    "reasignado" => $tramite->reasignado,
                    "fecha_reasignacion" => $tramite->fecha_reasignacion,
                    "arquitecto_responsable" =>
                        $tramite->arquitecto_responsable,
                    "clave_catastral" => $tramite->clave_catastral,
                    "direccion" => $tramite->direccion,
                    "estado_tramite" => $tramite->estado_tramite,
                    "estado_ingreso" => $tramite->estado_ingreso,
                    "correo_electronico" => $tramite->correo_electronico,
                    "num_observaciones" => $tramite->num_observaciones,
                    "nombre_tipotramite" => $tramite->tipostramites
                        ? $tramite->tipostramites->nombre
                        : null,
                    "created_at" => $tramite->created_at,
                ];
            });
    }

    public function tipostramites() {
        return $this->belongsTo(
            TipoTramite::class,
            "id_tipotramite",
            "id_tipotramite"
        );
    }

    public function usuarios() {
        return $this->belongsTo(User::class, "id_usuario", "id");
    }

    public function planos() {
        return $this->hasMany(PlanoArq::class, "id_tramite", "id_tramite");
    }

    public function fraccionamientos() {
        return $this->hasMany(
            Fraccionamiento::class,
            "id_tramite",
            "id_tramite"
        );
    }

    public function trabajosvarios() {
        return $this->hasMany(
            TrabajosVarios::class,
            "id_tramite",
            "id_tramite"
        );
    }

    public function unificacion() {
        return $this->hasMany(UnificacionL::class, "id_tramite", "id_tramite");
    }

    public function aforos() {
        return $this->hasMany(Aforos::class, "id_tramite", "id_tramite");
    }

    public function documentacion() {
        return $this->hasMany(Documentacion::class, "id_tramite", "id_tramite");
    }
}
