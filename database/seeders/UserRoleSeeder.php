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
        $vendedorRole = Role::create(["name" => "vendedor"]);
        $tecnicoRole = Role::create(["name" => "tecnico"]);
        $auditorRole = Role::create(["name" => "auditor"]);

        $super = User::factory()->create([
            "name" => "Super User",
            "email" => "su@example.com",
        ]);
        $super->assignRole(
            $adminRole,
            $vendedorRole,
            $tecnicoRole,
            $auditorRole
        );

        //Permisos para vendedor
        $permissions = [
            "manage clients",
            "manage phones",
            "manage addresses",
            "manage parishes",
            "manage cantons",
        ];

        foreach ($permissions as $permission) {
            Permission::create(["name" => $permission]);
        }
        $vendedorRole->givePermissionTo($permissions);

        //Usuarios por defecto
        $adminUser = User::factory()->create([
            "name" => "Admin User",
            "email" => "admin@example.com",
        ]);
        $adminUser->assignRole($adminRole);

        $vendedorUser = User::create([
            "name" => "Vendedor User",
            "email" => "vendedor@example.com",
            "password" => bcrypt("password"),
        ]);
        $vendedorUser->assignRole($vendedorRole);

        $tecnicoUser = User::create([
            "name" => "Tecnico User",
            "email" => "tecnico@example.com",
            "password" => bcrypt("password"),
        ]);
        $tecnicoUser->assignRole([$tecnicoRole]);

        $auditorUser = User::create([
            "name" => "Auditor User",
            "email" => "auditor@example.com",
            "password" => bcrypt("password"),
        ]);
        $auditorUser->assignRole([$auditorRole]);
    }
}
