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
        $arquitectorRole = Role::create(["name" => "arquirevisor"]);
        $RecepcionistaRole = Role::create(["name" => "recepcionista"]);
        //$auditorRole = Role::create(["name" => "auditor"]);

        $super = User::factory()->create([
            "name" => "Super User",
            "username" => "superuser",
            "email" => "su@example.com",
        ]);
        $super->assignRole(
            $adminRole,
            $arquitectorRole,
            $RecepcionistaRole
        );

        //Permisos para vendedor
        $permissions = [
            "manage clients",
        ];

        foreach ($permissions as $permission) {
            Permission::create(["name" => $permission]);
        }
        $RecepcionistaRole->givePermissionTo($permissions);

        //Usuarios por defecto
        $adminUser = User::factory()->create([
            "name" => "Admin User",
            "username" => "admin",
            "email" => "admin@example.com",
        ]);
        $adminUser->assignRole($adminRole);

        $arquitectoRevisor = User::factory()->create([
            "name" => "arquitecto revisor",
            "username" => "arqui",
            "email" => "arquitecto@example.com",
        ]);
        $arquitectoRevisor->assignRole($arquitectorRole);

        $recepcionUser = User::factory()->create([
            "name" => "recepcion",
            "username" => "recepcion",
            "email" => "recepcion@example.com",
        ]);
        $recepcionUser->assignRole([$RecepcionistaRole]);

        // $auditorUser = User::factory()->create([
        //     "name" => "Auditor User",
        //     "username" => "audi",
        //     "email" => "auditor@example.com",
        // ]);
        // $auditorUser->assignRole([$auditorRole]);
    }
}
