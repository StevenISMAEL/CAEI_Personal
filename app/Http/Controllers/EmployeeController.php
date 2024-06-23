<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class EmployeeController extends Controller {
    public function index() {
        return Inertia::render("Employee", [
            "employees" => User::getAllUserRoles(),
            "roles" => Role::all(),
        ]);
    }

    public function update(Request $request, string $userId) {
        $request->validate([
            "role_id" => "nullable|array",
            "role_id.*" => "integer|exists:roles,id",
        ]);

        $user = User::findOrFail($userId);
        $roles = Role::whereIn("id", $request->role_id)->get();
        $user->syncRoles($roles);

        return to_route("employees.index");
    }

    public function destroy(string $userId) {
        User::findOrFail($userId)->delete();
        return to_route("employees.index");
    }

    public function destroyMultiple(Request $request) {
        $ids = $request->input("ids");
        User::whereIn("id", $ids)->delete();
        return to_route("employees.index");
    }
}
