<?php
use App\Http\Controllers\SupTypeReportController;
use App\Http\Controllers\SupWorkOrderController;

use Illuminate\Support\Facades\Route;

Route::prefix("manage-orders")
    ->middleware(["auth", "verified", "role:admin|vendedor|tecnico"])
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

        Route::delete("/workorder", [
            SupWorkOrderController::class,
            "destroyMultiple",
        ])->name("workorder.multiple.destroy");
        Route::post("/work-orders/update-status", [
            SupWorkOrderController::class,
            "updateStatus",
        ])->name("work-orders.update-status");
    });
