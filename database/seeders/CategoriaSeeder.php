<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\categoria;

class CategoriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categoria = [
            ["id_categoria" => "CATG-01", "nombre" => "PLANOS ARQUITECTÓNICOS Y URBANÍSTICOS"],
            ["id_categoria" => "CATG-02", "nombre" => "FRACCIONAMIENTO DE SUELOS Y RESTRUCTURACIÓN DE LOTES"],
            ["id_categoria" => "CATG-03", "nombre" => "DECLARATORIAS DE PROPIEDAD HORIZONTAL"],
            ["id_categoria" => "CATG-04", "nombre" => "TRABAJOS VARIOS"],
            ["id_categoria" => "CATG-05", "nombre" => "AFOROS PARA LOCALES"],
        ];
        categoria::insert($categoria);

    }
}
