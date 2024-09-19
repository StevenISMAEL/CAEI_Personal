<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TramitesController;
use App\Http\Controllers\PlanoArqController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\TipoTramiteController;
use App\Http\Controllers\FraccionamientoController;
use App\Http\Controllers\TrabajosVariosController;
use App\Http\Controllers\PropiedadHorizontalController;
use App\Http\Controllers\AforosController;

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

        Route::post("/tramite/send-email", [
            TramitesController::class,
            "sendEmail",
        ]);
    });

Route::prefix("administrar-planosarq")
    ->middleware(["auth", "verified", "role:admin"])
    ->group(function () {
        Route::resource("planoarq", PlanoArqController::class)->except([
            "create",
            "show",
            "edit",
        ]);
        Route::delete("/planoarq", [
            PlanoArqController::class,
            "destroyMultiple",
        ])->name("planoarq.multiple.destroy");
    });

Route::prefix("administrar-tipotramites")
    ->middleware(["auth", "verified", "role:admin"])
    ->group(function () {
        Route::resource("categoria", CategoriaController::class)->except([
            "create",
            "show",
            "edit",
        ]);
        Route::delete("/categoria", [
            CategoriaController::class,
            "destroyMultiple",
        ])->name("categoria.multiple.destroy");

        Route::resource("tipotramite", TipoTramiteController::class)->except([
            "create",
            "show",
            "edit",
        ]);
        Route::delete("/tipotramite", [
            TipoTramiteController::class,
            "destroyMultiple",
        ])->name("tipotramite.multiple.destroy");
    });

Route::prefix("administrar-fraccionamiento")
    ->middleware(["auth", "verified", "role:admin"])
    ->group(function () {
        Route::resource(
            "fraccionamiento",
            FraccionamientoController::class
        )->except(["create", "show", "edit"]);
        Route::delete("/fraccionamiento", [
            FraccionamientoController::class,
            "destroyMultiple",
        ])->name("fraccionamiento.multiple.destroy");
    });

Route::prefix("administrar-Trabajov")
    ->middleware(["auth", "verified", "role:admin"])
    ->group(function () {
        Route::resource("trabajosvar", TrabajosVariosController::class)->except([
            "create",
            "show",
            "edit",
        ]);
        Route::delete("/trabajosvar", [
            TrabajosVariosController::class,
            "destroyMultiple",
        ])->name("trabajosvar.multiple.destroy");
    });

    
Route::prefix("administrar-propiedadh")
->middleware(["auth", "verified", "role:admin"])
->group(function () {
    Route::resource("propiedadh", PropiedadHorizontalController::class)->except([
        "create",
        "show",
        "edit",
    ]);
    Route::delete("/propiedadh", [
        PropiedadHorizontalController::class,
        "destroyMultiple",
    ])->name("propiedadh.multiple.destroy");
});



    
Route::prefix("administrar-aforos")
->middleware(["auth", "verified", "role:admin"])
->group(function () {
    Route::resource("aforos", AforosController::class)->except([
        "create",
        "show",
        "edit",
    ]);
    Route::delete("/aforos", [
        AforosController::class,
        "destroyMultiple",
    ])->name("aforos.multiple.destroy");
});