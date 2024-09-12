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
            [ "id_tipotramite" => "TPT-01","id_categoria" => "CATG-01", "nombre" => "Holaa"],
            // [ "id_tipotramite" => "TPT-01","id_categoria" => "CATG-01", "nombre" => " "],
            // [ "id_tipotramite" => "TPT-01","id_categoria" => "CATG-01", "nombre" => " "],
            // [ "id_tipotramite" => "TPT-01","id_categoria" => "CATG-01", "nombre" => " "],
            // [ "id_tipotramite" => "TPT-01","id_categoria" => "CATG-01", "nombre" => " "],
            // [ "id_tipotramite" => "TPT-01","id_categoria" => "CATG-01", "nombre" => " "],
            // [ "id_tipotramite" => "TPT-01","id_categoria" => "CATG-01", "nombre" => " "],
            // ["id_tipotramite" => "TPT-01","id_categoria" => "CATG-02", "nombre" => " "],
            // ["id_tipotramite" => "TPT-01","id_categoria" => "CATG-03", "nombre" => " "],
            // ["id_tipotramite" => "TPT-01","id_categoria" => "CATG-04", "nombre" => " "],
            // ["id_tipotramite" => "TPT-01","id_categoria" => "CATG-05", "nombre" => " "],
            // ["id_tipotramite" => "TPT-01","id_categoria" => "CATG-05", "nombre" => " "],
            // ["id_tipotramite" => "TPT-01","id_categoria" => "CATG-05", "nombre" => " "],
        ];
        TipoTramite::insert($tipotramite);
    }
}
