<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use App\Models\User;

class UserRoleSeeder extends Seeder {
    /**
     * Run the database seeds.
     */
    public function run(): void {
        $adminRole = Role::create(["name" => "admin"]);
        $vendedorRole = Role::create(["name" => "vendedor"]);

        $adminUser = User::create([
            "name" => "Admin User",
            "email" => "admin@example.com",
            "password" => bcrypt("password"),
        ]);
        $adminUser->assignRole($adminRole);

        $vendedorUser = User::create([
            "name" => "Vendedor User",
            "email" => "vendedor@example.com",
            "password" => bcrypt("password"),
        ]);
        $vendedorUser->assignRole($vendedorRole);

        $secondAdminUser = User::create([
            "name" => "Second Admin",
            "email" => "secondadmin@example.com",
            "password" => bcrypt("password"),
        ]);
        $secondAdminUser->assignRole($adminRole);

        $secondVendedorUser = User::create([
            "name" => "Second Vendedor",
            "email" => "secondvendedor@example.com",
            "password" => bcrypt("password"),
        ]);
        $secondVendedorUser->assignRole($vendedorRole);

        $multiRoleUser = User::create([
            "name" => "Multi Role User",
            "email" => "multiuser@example.com",
            "password" => bcrypt("password"),
        ]);
        $multiRoleUser->assignRole([$adminRole, $vendedorRole]);
    }
}
