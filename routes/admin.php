<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmployeeController;

Route::resource("employees", EmployeeController::class)->middleware([
    "auth",
    "verified",
    "role:admin",
]);
