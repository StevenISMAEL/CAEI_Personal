<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\ConClientController;
use App\Http\Controllers\ConCantonController;
use App\Http\Controllers\ConParishController;
use App\Http\Controllers\ConAddressController;

use App\Http\Controllers\IpOltsController;
use App\Models\IpOlts;
use App\Http\Controllers\ConPhoneController;
use App\Http\Controllers\InvProductController;
use App\Http\Controllers\InvMovementTypeController;
use App\Models\InvProduct;

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
    ->middleware(["auth", "verified"])
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

Route::get("/app", function () {
    return Inertia::render("App");
});

Route::prefix("manage-customers")
    ->middleware(["auth", "verified"])
    ->group(function () {
        Route::resource("clients", ConClientController::class)->except([
            "create",
            "show",
            "edit",
        ]);
        Route::delete("/clients", [
            ConClientController::class,
            "destroyMultiple",
        ])->name("clients.multiple.destroy");

        Route::resource("phones", ConPhoneController::class)->except([
            "create",
            "show",
            "edit",
        ]);
        Route::delete("/phones", [
            ConPhoneController::class,
            "destroyMultiple",
        ])->name("phones.multiple.destroy");

        Route::resource("addresses", ConAddressController::class)->except([
            "create",
            "show",
            "edit",
        ]);
        Route::delete("/addresses", [
            ConAddressController::class,
            "destroyMultiple",
        ])->name("addresses.multiple.destroy");

        Route::resource("parishes", ConParishController::class)->except([
            "create",
            "show",
            "edit",
        ]);
        Route::delete("/parishes", [
            ConClientController::class,
            "destroyMultiple",
        ])->name("parishes.multiple.destroy");
        Route::resource("cantons", ConCantonController::class)->except([
            "create",
            "show",
            "edit",
        ]);
        Route::delete("/cantons", [
            ConCantonController::class,
            "destroyMultiple",
        ])->name("cantons.multiple.destroy");
    });

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

require __DIR__ . "/auth.php";
