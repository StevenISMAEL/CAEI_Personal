<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\ConClientController;
use App\Http\Controllers\ConCantonController;
use App\Http\Controllers\ConParishController;
use App\Http\Controllers\ConAddressController;

Route::get("/", function () {
    return Inertia::render("Welcome", [
        "canLogin" => Route::has("login"),
        "canRegister" => Route::has("register"),
        "laravelVersion" => Application::VERSION,
        "phpVersion" => PHP_VERSION,
    ]);
});

Route::get("/dashboard", function () {
    return Inertia::render("Dashboard");
})
    ->middleware(["auth", "verified"])
    ->name("dashboard");

Route::middleware("auth")->group(function () {
    Route::get("/profile", [ProfileController::class, "edit"])->name(
        "profile.edit"
    );
    Route::patch("/profile", [ProfileController::class, "update"])->name(
        "profile.update"
    );
    Route::delete("/profile", [ProfileController::class, "destroy"])->name(
        "profile.destroy"
    );
});

Route::get("/home", function () {
    return view("home", ["nombre" => "Jordan :)"]);
});

Route::get("/app", function () {
    return Inertia::render("App");
});

Route::prefix("manage-customers")
    ->group(function () {
        Route::get("/clients", [ConClientController::class, "index"])->name(
            "clients"
        );
        Route::post("/clients", [ConClientController::class, "store"])->name(
            "clients.store"
        );

        Route::get("/phones", [ConClientController::class, "index"])->name(
            "phones"
        );

        Route::get("/addresses", [ConAddressController::class, "index"])->name(
            "addresses"
        );
        Route::post("/addresses", [ConAddressController::class, "store"])->name(
            "addresses.store"
        );
        Route::patch("/addresses/{id}", [
            ConAddressController::class,
            "update",
        ])->name("addresses.update");
        Route::delete("/addresses/{id}", [
            ConAddressController::class,
            "destroy",
        ])->name("addresses.destroy");
        Route::delete("/addresses", [
            ConAddressController::class,
            "destroyMultiple",
        ])->name("addresses.multiple.destroy");

        

        Route::get("/parishes", [ConParishController::class, "index"])->name(
            "parishes"
        );
        Route::post("/parishes", [ConParishController::class, "store"])->name(
            "parishes.store"
        );
        Route::patch("/parishes/{id}", [
            ConParishController::class,
            "update",
        ])->name("parishes.update");
        Route::delete("/parishes/{id}", [
            ConParishController::class,
            "destroy",
        ])->name("parishes.destroy");
        Route::delete("/parishes", [
            ConParishController::class,
            "destroyMultiple",
        ])->name("parishes.multiple.destroy");


        Route::get("/cantons", [ConCantonController::class, "index"])->name(
            "cantons"
        );
        Route::post("/cantons", [ConCantonController::class, "store"])->name(
            "cantons.store"
        );
        Route::delete("/cantons/{id}", [
            ConCantonController::class,
            "destroy",
        ])->name("cantons.destroy");
        Route::patch("/cantons/{id}", [
            ConCantonController::class,
            "update",
        ])->name("cantons.update");
        Route::delete("/cantons", [
            ConCantonController::class,
            "destroyMultiple",
        ])->name("cantons.multiple.destroy");
    })
    ->middleware(["auth", "verified"]);

require __DIR__ . "/auth.php";
