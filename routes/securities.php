<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmployeeController;

Route::resource("employees", EmployeeController::class)
    ->only(["index", "update", "destroy"])
    ->middleware(["auth", "verified", "role:admin"]);
Route::delete("employees", [
    EmployeeController::class,
    "destroyMultiple",
])->name("employees.multiple.destroy");
