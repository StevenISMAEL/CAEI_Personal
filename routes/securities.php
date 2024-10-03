<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmployeeController;

Route::group(["middleware" => ["auth", "verified", "role:admin"]], function () {
    Route::resource("usuarios", EmployeeController::class)->only([
        "index",
        "update",
        "destroy",
        "store",
    ]);

    Route::delete("/usuarios", [
        EmployeeController::class,
        "destroyMultiple",
    ])->name("usuarios.destroyMultiple");


});
