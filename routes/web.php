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

use App\Http\Controllers\ConPhoneController;
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

        Route::resource("distributionNaps", IpDistributionController::class)->except([
            "create",
            "show",
            "edit",
        ]);
        
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


require __DIR__ . "/auth.php";
