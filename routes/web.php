<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use App\Http\Controllers\InvProductController;
use App\Http\Controllers\PlansController;

Route::get("/", function () {
    return Auth::check()
        ? redirect()->route("dashboard")
        : redirect()->route("login");
});

Route::get("/dashboard", function () {
    return Inertia::render("Dashboard");
})
    ->middleware(["auth", "verified", "role:admin|vendedor|tecnico|auditor"])
    ->name("dashboard");

Route::middleware(["auth", "verified", "role:admin|vendedor|tecnico|auditor"])->group(
    function () {
        Route::get("/profile", [ProfileController::class, "edit"])->name(
            "profile.edit"
        );
        Route::patch("/profile", [ProfileController::class, "update"])->name(
            "profile.update"
        );
        Route::delete("/profile", [ProfileController::class, "destroy"])->name(
            "profile.destroy"
        );
    }
);

Route::prefix("manage-orders")
    ->group(function () {
        Route::resource("work-orders", InvProductController::class)->except([
            "create",
            "show",
            "edit",
        ]);
        Route::delete("/work-orders", [
            InvProductController::class,
            "destroyMultiple",
        ])->name("work-orders.multiple.destroy");
    })
    ->middleware(["auth", "verified"]);

Route::prefix("manage-plans")
    ->group(function () {
        Route::resource("plans", PlansController::class)->except([
            "create",
            "show",
            "edit",
        ]);
        Route::delete("/plans", [
            PlansController::class,
            "destroyMultiple",
        ])->name("plans.multiple.destroy");
    })
    ->middleware(["auth", "verified"]);

require __DIR__ . "/auth.php";
require __DIR__ . "/audit.php";
require __DIR__ . "/customer-management.php";
require __DIR__ . "/customer-support.php";
require __DIR__ . "/inventory-management.php";
require __DIR__ . "/securities.php";
