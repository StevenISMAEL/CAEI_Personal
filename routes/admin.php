<?php
use Illuminate\Support\Facades\Route;

Route::get("employees", function () {
    return "hola";
})->name("employees.index");


