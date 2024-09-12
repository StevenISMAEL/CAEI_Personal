<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TramitesController;
use Inertia\Inertia;

Route::prefix("administrar-tramites")
    ->middleware(["auth", "verified", "role:admin"])
    ->group(function () {
        Route::resource("tramite", TramitesController::class)->except([
            "create",
            "show",
            "edit",
        ]);
        Route::delete("/tramite", [
            TramitesController::class,
            "destroyMultiple",
        ])->name("tramite.multiple.destroy");
    });
