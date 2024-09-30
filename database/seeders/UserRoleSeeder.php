<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use App\Models\User;
use Spatie\Permission\Models\Permission;

class UserRoleSeeder extends Seeder {
    /**
     * Run the database seeds.
     */
    public function run(): void {
        $adminRole = Role::create(["name" => "admin"]);
        $arquitectorRole = Role::create(["name" => "arquitectorevisor"]);
        $SecretariaRole = Role::create(["name" => "secretaria"]);
        //$auditorRole = Role::create(["name" => "auditor"]);


        //Permisos para vendedor
        $permissions = [
            "manage tramites",
        ];

        foreach ($permissions as $permission) {
            Permission::create(["name" => $permission]);
        }
        $SecretariaRole->givePermissionTo($permissions);

        //Usuarios por defecto
        $adminUser = User::factory()->create([
            "name" => "Admin User",
            "username" => "admin",
            "email" => "admin@example.com",
        ]);
        $adminUser->assignRole($adminRole);

        $arquitectoRevisor = User::factory()->create([
            "name" => "arquitecto revisor",
            "username" => "arquitecto",
            "email" => "arquitecto@example.com",
        ]);
        $arquitectoRevisor->assignRole($arquitectorRole);

        $secretariaUser = User::factory()->create([
            "name" => "secretaria",
            "username" => "secretaria",
            "email" => "secretaria@example.com",
        ]);
        $secretariaUser->assignRole([$SecretariaRole]);

        // $auditorUser = User::factory()->create([
        //     "name" => "Auditor User",
        //     "username" => "audi",
        //     "email" => "auditor@example.com",
        // ]);
        // $auditorUser->assignRole([$auditorRole]);
    }
}
