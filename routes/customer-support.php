<?php
use App\Http\Controllers\SupTypeReportController;
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
    })
    ->middleware(["auth", "verified", "role:vendedor"]);
