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
            ["id_categoria" => "CATG-01", "nombre" => "Planos arquitectónicos y urbanísticos "],
            ["id_categoria" => "CATG-02", "nombre" => "Fraccionamiento de Suelos y Restructuración de Lotes "],
            ["id_categoria" => "CATG-03", "nombre" => "Declaratorias de propiedad horizontal "],
            ["id_categoria" => "CATG-04", "nombre" => "Trabajos Varios "],
            ["id_categoria" => "CATG-05", "nombre" => "Aforos para locales"],
        ];
        categoria::insert($categoria);

    }
}
