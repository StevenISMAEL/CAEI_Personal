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
            [ "id_tipotramite" => "TPT-003","id_categoria" => "CATG-01", "nombre" => "): APROBACIÓN DE PLANOS ARQUITECTÓNICOS AMPLIATORIO CONSTRUCCIÓN MÁS DE 20 AÑOS"],
            [ "id_tipotramite" => "TPT-004","id_categoria" => "CATG-01", "nombre" => "APROBACIÓN DE PLANOS ARQUITECTÓNICOS AMPLIATORIOS"],
            [ "id_tipotramite" => "TPT-005","id_categoria" => "CATG-01", "nombre" => "APROBACIÓN DE PLANOS ARQUITECTÓNICOS (ANTEPROYECTO CONJUNTO RESIDENCIAL) MAS DE 5 VIVIENDAS"],
           
        ];
        TipoTramite::insert($tipotramite);
    }
}
