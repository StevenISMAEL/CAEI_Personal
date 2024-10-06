<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Hash;

class EmployeeController extends Controller {
    public function index() {
        return Inertia::render("Employee", [
            "employees" => User::getAllUserRoles(),
            "roles" => Role::all(),
        ]);
    }
    public function store(Request $request) {
        $request->validate([
            "name" => "required|string|max:255",
            "email" => "required|string|email|max:255|unique:" . User::class,
            "username" => [
                "required",
                "string",
                "min:5",
                "max:50",
                "unique:" . User::class,
                "regex:/^[a-zA-Z0-9_-]+$/",
            ],
            "password" => ["required", "confirmed", Rules\Password::defaults()],
            "role_id" => "nullable|array",
            "role_id.*" => "integer|exists:roles,id",
        ]);
        $user = User::factory()->create([
            "name" => $request->name,
            "email" => $request->email,
            "username" => $request->username,
            "password" => Hash::make($request->password),
        ]);
    
        if ($request->role_id) {
            $user->assignRole($request->role_id);
        }
    
        return to_route("usuarios.index");
    }
    
    public function update(Request $request, string $userId) {
        $request->validate([
            "role_id" => "nullable|array",
            "role_id.*" => "integer|exists:roles,id",
        ]);

        $user = User::findOrFail($userId);

        $newRoles = Role::whereIn("id", $request->role_id)
            ->pluck("name")
            ->toArray();

        $user->auditRoleChange($newRoles);
        return to_route("usuarios.index");
    }

    public function destroy(string $userId) {
        User::findOrFail($userId)->delete();
        return to_route("usuarios.index");
    }

    public function destroyMultiple(Request $request) {
        $ids = $request->input("ids");

        $users = User::whereIn("id", $ids)->get();

        foreach ($users as $user) {
            $user->delete();
        }

        return to_route("usuarios.index");
    }
}
