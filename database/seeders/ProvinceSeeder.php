<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ConProvince;

class ProvinceSeeder extends Seeder {
    /**
     * Run the database seeds.
     */
    public function run(): void {
        $provinces = [
            ["province_id" => "01", "province_name" => "Azuay"],
            ["province_id" => "02", "province_name" => "Bolívar"],
            ["province_id" => "03", "province_name" => "Cañar"],
            ["province_id" => "04", "province_name" => "Carchi"],
            ["province_id" => "05", "province_name" => "Cotopaxi"],
            ["province_id" => "06", "province_name" => "Chimborazo"],
            ["province_id" => "07", "province_name" => "El Oro"],
            ["province_id" => "08", "province_name" => "Esmeraldas"],
            ["province_id" => "09", "province_name" => "Guayas"],
            ["province_id" => "10", "province_name" => "Imbabura"],
            ["province_id" => "11", "province_name" => "Loja"],
            ["province_id" => "12", "province_name" => "Los Ríos"],
            ["province_id" => "13", "province_name" => "Manabí"],
            ["province_id" => "14", "province_name" => "Morona Santiago"],
            ["province_id" => "15", "province_name" => "Napo"],
            ["province_id" => "16", "province_name" => "Pastaza"],
            ["province_id" => "17", "province_name" => "Pichincha"],
            ["province_id" => "18", "province_name" => "Tungurahua"],
            ["province_id" => "19", "province_name" => "Zamora Chinchipe"],
            ["province_id" => "20", "province_name" => "Galápagos"],
            ["province_id" => "21", "province_name" => "Sucumbíos"],
            ["province_id" => "22", "province_name" => "Orellana"],
            ["province_id" => "23", "province_name" => "Santo Domingo de los Tsáchilas"],
            ["province_id" => "24", "province_name" => "Santa Elena"],
        ];

        ConProvince::insert($provinces);
    }
}
