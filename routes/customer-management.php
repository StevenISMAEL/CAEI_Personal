<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ConClientController;
use App\Http\Controllers\ConCantonController;
use App\Http\Controllers\ConParishController;
use App\Http\Controllers\ConSectorController;
use App\Http\Controllers\ConPhoneController;
use App\Http\Controllers\IpOltsController;
use App\Http\Controllers\IpDistributionController;
use App\Http\Controllers\IpLastMileController;
use Inertia\Inertia;

Route::prefix("manage-customers")
    ->middleware(["auth", "verified", "role:vendedor"])
    ->group(function () {
        Route::resource("/clients", ConClientController::class)
            ->except(["create", "show", "edit"])
            ->middleware("permission:manage clients");

        Route::delete("/clients", [
            ConClientController::class,
            "destroyMultiple",
        ])
            ->name("clients.multiple.destroy")
            ->middleware("permission:manage clients");

        Route::resource("phones", ConPhoneController::class)
            ->except(["create", "show", "edit"])
            ->middleware("permission:manage phones");

        Route::delete("/phones", [ConPhoneController::class, "destroyMultiple"])
            ->name("phones.multiple.destroy")
            ->middleware("permission:manage phones");

        Route::resource("/sectors", ConSectorController::class)
            ->except(["create", "show", "edit"])
            ->middleware("permission:manage sectors");

        Route::delete("/sectors", [
            ConSectorController::class,
            "destroyMultiple",
        ])
            ->name("sectors.multiple.destroy")
            ->middleware("permission:manage sectors");

        Route::resource("parishes", ConParishController::class)
            ->except(["create", "show", "edit"])
            ->middleware("permission:manage parishes");

        Route::delete("/parishes", [
            ConParishController::class,
            "destroyMultiple",
        ])
            ->name("parishes.multiple.destroy")
            ->middleware("permission:manage parishes");

        Route::resource("cantons", ConCantonController::class)
            ->except(["create", "show", "edit"])
            ->middleware("permission:manage cantons");

        Route::delete("/cantons", [
            ConCantonController::class,
            "destroyMultiple",
        ])
            ->name("cantons.multiple.destroy")
            ->middleware("permission:manage cantons");
    });

// Route::get("contracts", function () {
//     return "Contratos";
// })->name("contracts.index");

Route::get("orden-trabajo", function () {
    return Inertia::render("OrdenTrabajo");
})->middleware(["auth", "verified", "role:vendedor"]);

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
