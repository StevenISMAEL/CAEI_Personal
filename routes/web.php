<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\InvProductController;


Route::get("/", function () {
    return Inertia::render("Welcome", [
        "canLogin" => Route::has("login"),
        "canRegister" => Route::has("register"),
        "laravelVersion" => Application::VERSION,
        "phpVersion" => PHP_VERSION,
    ]);
});

Route::get("/dashboard", function () {
    return Inertia::render("Dashboard");
})
    ->middleware(["auth", "verified", "role:admin|vendedor|tecnico|auditor"])
    ->name("dashboard");

Route::middleware("auth")->group(function () {
    Route::get("/profile", [ProfileController::class, "edit"])->name(
        "profile.edit"
    );
    Route::patch("/profile", [ProfileController::class, "update"])->name(
        "profile.update"
    );
    Route::delete("/profile", [ProfileController::class, "destroy"])->name(
        "profile.destroy"
    );
});

//Route::get("/app", function () {
//    return Inertia::render("App");
//});

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

require __DIR__ . "/auth.php";
require __DIR__ . "/audit.php";
require __DIR__ . "/customer-management.php";
require __DIR__ . "/customer-support.php";
require __DIR__ . "/inventory-management.php";
require __DIR__ . "/securities.php";
