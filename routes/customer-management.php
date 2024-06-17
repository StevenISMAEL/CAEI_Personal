<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ConClientController;
use App\Http\Controllers\ConCantonController;
use App\Http\Controllers\ConParishController;
use App\Http\Controllers\ConAddressController;
use App\Http\Controllers\ConPhoneController;

// use App\Http\Controllers\Emplo

Route::prefix("manage-customers")
    ->middleware(["auth", "verified", "role:vendedor"])
    ->group(function () {
        Route::resource("clients", ConClientController::class)
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

        Route::resource("addresses", ConAddressController::class)
            ->except(["create", "show", "edit"])
            ->middleware("permission:manage addresses");

        Route::delete("/addresses", [
            ConAddressController::class,
            "destroyMultiple",
        ])
            ->name("addresses.multiple.destroy")
            ->middleware("permission:manage addresses");

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

Route::get("contracts", function () {
    return "Contratos";
})->name("contracts.index");
