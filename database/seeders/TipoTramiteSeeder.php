<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TipoTramite;

class TipoTramiteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tipotramite = [
            [ "id_tipotramite" => "TPT-001","id_categoria" => "CATG-01", "nombre" => "APROBACIÓN DE PLANOS ARQUITECTÓNICO"],
            [ "id_tipotramite" => "TPT-002","id_categoria" => "CATG-01", "nombre" => "APROBACIÓN DE PLANOS ARQUITECTÓNICOS ACTUALIZACIÓN"],
            [ "id_tipotramite" => "TPT-003","id_categoria" => "CATG-01", "nombre" => "APROBACIÓN DE PLANOS ARQUITECTÓNICOS AMPLIATORIO CONSTRUCCIÓN MÁS DE 20 AÑOS"],
            [ "id_tipotramite" => "TPT-004","id_categoria" => "CATG-01", "nombre" => "APROBACIÓN DE PLANOS ARQUITECTÓNICOS AMPLIATORIOS"],
            [ "id_tipotramite" => "TPT-005","id_categoria" => "CATG-01", "nombre" => "APROBACIÓN DE PLANOS ARQUITECTÓNICOS (ANTEPROYECTO CONJUNTO RESIDENCIAL) MAS DE 5 VIVIENDAS"],
            [ "id_tipotramite" => "TPT-006","id_categoria" => "CATG-01", "nombre" => "APROBACIÓN DE PLANOS ARQUITECTÓNICOS (PROYECTO DEFINITIVO CONJUNTO RESIDENCIAL) MAS DE 5 VIVIENDAS"],
            [ "id_tipotramite" => "TPT-007","id_categoria" => "CATG-01", "nombre" => "APROBACIÓN DE PLANOS ARQUITECTÓNICOS MODIFICATORIO"],
            [ "id_tipotramite" => "TPT-008","id_categoria" => "CATG-01", "nombre" => "APROBACIÓN DE PLANOS ARQUITECTÓNICOS MODIFICATORIO CONSTRUCCIÓN MÁS DE 20 AÑOS"],
            [ "id_tipotramite" => "TPT-009","id_categoria" => "CATG-01", "nombre" => "URBANIZACIÓN ( ANTEPROYECTO)"],        
            [ "id_tipotramite" => "TPT-010","id_categoria" => "CATG-02", "nombre" => "URBANIZACIÓN ( PROYECTO DEFINITIVO)"],
            [ "id_tipotramite" => "TPT-011","id_categoria" => "CATG-02", "nombre" => "UNIFICACIÓN DE LOTES"],
            [ "id_tipotramite" => "TPT-012","id_categoria" => "CATG-02", "nombre" => "REESTRUCTURACIÓN O INTEGRACIÓN PARCELARIA"],
            [ "id_tipotramite" => "TPT-013","id_categoria" => "CATG-02", "nombre" => "FRACCIONAMIENTO URBANO Y RURAL"],
            [ "id_tipotramite" => "TPT-014","id_categoria" => "CATG-03", "nombre" => "DECLARACIÓN Y REGISTRO DE UN BIEN INMUEBLE BAJO RÉGIMEN DE PROPIEDAD HORIZONTAL"],
            [ "id_tipotramite" => "TPT-015","id_categoria" => "CATG-03", "nombre" => "DECLARATORIA EN RÉGIMEN DE PROPIEDAD HORIZONTAL SIN PLANO APROBADO CONSTRUCCIÓN MÁS DE 20 AÑOS"],
            [ "id_tipotramite" => "TPT-016","id_categoria" => "CATG-03", "nombre" => "MODIFICATORIA A LA DECLARATORIA EN RÉGIMEN DE PROPIEDAD HORIZONTAL"],
            [ "id_tipotramite" => "TPT-017","id_categoria" => "CATG-03", "nombre" => "SOLICITUD DE INGRESO DE CLAVES CATASTRALES EN DECLARATORIA DE P.H."],
            [ "id_tipotramite" => "TPT-018","id_categoria" => "CATG-04", "nombre" => "TRABAJOS VARIOS ACABADOS"],
            [ "id_tipotramite" => "TPT-019","id_categoria" => "CATG-04", "nombre" => "TRABAJOS VARIOS EN DECLARATORIA DE PROPIEDAD HORIZONTAL"],
            [ "id_tipotramite" => "TPT-020","id_categoria" => "CATG-04", "nombre" => "TRABAJOS VARIOS DERROCAMIENTOS"],
            [ "id_tipotramite" => "TPT-021","id_categoria" => "CATG-04", "nombre" => "TRABAJOS VARIOS CONSTRUCCIÓN NUEVA HASTA 20M2 Y CERRAMIENTO"],
            [ "id_tipotramite" => "TPT-022","id_categoria" => "CATG-04", "nombre" => "TRABAJOS VARIOS AMPLIACIÓN HASTA 20M2 Y REMODELACIÓN"],
            [ "id_tipotramite" => "TPT-023","id_categoria" => "CATG-04", "nombre" => "TRABAJOS VARIOS DERROCAMIENTOS"],
            [ "id_tipotramite" => "TPT-024","id_categoria" => "CATG-04", "nombre" => "TRABAJOS VARIOS PARA ARREGLO Y CAMBIO DE CUBIERTA"],
            [ "id_tipotramite" => "TPT-025","id_categoria" => "CATG-05", "nombre" => "AFOROS"],


           
        ];
        TipoTramite::insert($tipotramite);
    }
}
