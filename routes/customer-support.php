<?php
use App\Http\Controllers\SupTypeReportController;
use App\Http\Controllers\SupWorkOrderController;

use Illuminate\Support\Facades\Route;

Route::prefix("manage-orders")
    ->group(function () {
        Route::resource("typereport", SupTypeReportController::class)->except([
            "create",
            "show",
            "edit",
        ]);

        Route::delete("/typereport", [
            SupTypeReportController::class,
            "destroyMultiple",
        ])->name("typereport.multiple.destroy");

        Route::resource("workorder", SupWorkOrderController::class)->except([
            "create",
            "show",
            "edit",
        ]);
        
        Route::delete("/workorder", [SupWorkOrderController::class, "destroyMultiple"])
            ->name("workorder.multiple.destroy")
            ->middleware(["auth", "verified", "role:tecnico"]);
    })
    ->middleware(["auth", "verified", "role:vendedor"]);


