<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Spatie\Permission\Models\Role;

class User extends Authenticatable {
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ["name", "email", "username", "password"];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = ["password", "remember_token"];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array {
        return [
            "email_verified_at" => "datetime",
            "password" => "hashed",
        ];
    }

    public $timestamps = false;

    public static function getAllUserRoles() {
        return self::with("roles.permissions")
            ->get()
            ->map(function ($user) {
                return [
                    "user_id" => $user->id,
                    "user_name" => $user->name,
                    "roles" => $user->roles->map(function ($role) {
                        return [
                            "role_id" => $role->id,
                            "role_name" => $role->name,
                        ];
                    }),
                ];
            });
    }

    public static function getPermissionsByRole() {
        return Role::with("permissions")
            ->get()
            ->map(function ($role) {
                return [
                    "role_id" => $role->id,
                    "role_name" => $role->name,
                    "permissions" => $role->permissions->map(function (
                        $permission
                    ) {
                        return [
                            "permission_id" => $permission->id,
                            "permission_name" => $permission->name,
                        ];
                    }),
                ];
            });
    }
}
