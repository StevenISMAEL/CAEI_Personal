<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\IpOltsController;
use App\Http\Controllers\InvProductController;
use App\Http\Controllers\InvMovementTypeController;
use App\Http\Controllers\InvMovementController;
use App\Http\Controllers\IpDistributionController;
use App\Http\Controllers\IpLastMileController;

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

Route::prefix("manage-ips")
    ->group(function () {
        Route::resource("olts", IpOltsController::class)->except([
            "create",
            "show",
            "edit",
        ]);
        Route::delete("/olts", [
            IpOltsController::class,
            "destroyMultiple",
        ])->name("olts.multiple.destroy");

        Route::resource(
            "distributionNaps",
            IpDistributionController::class
        )->except(["create", "show", "edit"]);

        Route::delete("/distributionNaps", [
            IpDistributionController::class,
            "destroyMultiple",
        ])->name("distributionNaps.multiple.destroy");

        Route::resource("lastmileNaps", IpLastMileController::class)->except([
            "create",
            "show",
            "edit",
        ]);

        Route::delete("/lastmileNaps", [
            IpLastMileController::class,
            "destroyMultiple",
        ])->name("lastmileNaps.multiple.destroy");
    })
    ->middleware(["auth", "verified"]);

Route::prefix("manage-inventory")
    ->group(function () {
        Route::resource("products", InvProductController::class)->except([
            "create",
            "show",
            "edit",
        ]);
        Route::delete("/products", [
            InvProductController::class,
            "destroyMultiple",
        ])->name("products.multiple.destroy");

        Route::resource("types", InvMovementTypeController::class)->except([
            "create",
            "show",
            "edit",
        ]);
        Route::delete("/types", [
            InvMovementTypeController::class,
            "destroyMultiple",
        ])->name("types.multiple.destroy");

        Route::resource("movements", InvMovementController::class)->except([
            "create",
            "show",
            "edit",
        ]);
        Route::delete("/movements", [
            InvMovementController::class,
            "destroyMultiple",
        ])->name("movements.multiple.destroy");
    })
    ->middleware(["auth", "verified"]);

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

Route::get("orden-trabajo", function () {
    return Inertia::render("OrdenTrabajo");
});

require __DIR__ . "/auth.php";
require __DIR__ . "/customer-management.php";
require __DIR__ . "/admin.php";
