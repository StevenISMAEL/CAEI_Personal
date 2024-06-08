<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Con_Cliente extends Model {
    use HasFactory;
    protected $table = "con_clientes"; // Especificar el nombre de la tabla

    protected $primaryKey = "cedula"; // Especificar la cédula como clave primaria

    public $incrementing = false; // Indicar que no se usará incremento automático en la clave primaria

    protected $keyType = "string"; // Indicar el tipo de dato de la clave primaria

    public $timestamps = false; // Indicar que no se utilizarán los campos de timestamp

    protected $fillable = [
        "cedula",
        "id_direccion",
        "nombres_cliente",
        "correo_cliente",
    ];
}
