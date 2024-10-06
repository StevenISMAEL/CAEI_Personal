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
use App\Http\Controllers\UnificacionLController;
use App\Http\Controllers\DocumentacionController;
use App\Http\Controllers\NotificacionesController;
use App\Http\Controllers\AuditController;

use Inertia\Inertia;

Route::prefix("administrar-tramites")
    ->middleware(["auth", "verified", "role:admin|secretaria"])
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

        Route::get("/Tramitefechas", [
            TramitesController::class,
            "index2",
        ])->name("Tramitefechas.index");

        Route::get("/Tramitefechas/datos", [
            TramitesController::class,
            "obtenerDatos",
        ])->name("Tramitefechas.datos");
    });

Route::prefix("administrar-planosarq")
    ->middleware(["auth", "verified", "role:admin|arquitectorevisor"])
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

        Route::get("/planosfechas", [
            PlanoArqController::class,
            "index2",
        ])->name("planosfechas.index");

        Route::get("/planosfechas/datos", [
            PlanoArqController::class,
            "obtenerDatos",
        ])->name("planosfechas.datos");
    });

Route::prefix("administrar-tipotramites")
    ->middleware(["auth", "verified", "role:admin|arquitectorevisor|secretaria"])
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
    ->middleware(["auth", "verified", "role:admin|arquitectorevisor"])
    ->group(function () {
        Route::resource(
            "fraccionamiento",
            FraccionamientoController::class
        )->except(["create", "show", "edit"]);
        Route::delete("/fraccionamiento", [
            FraccionamientoController::class,
            "destroyMultiple",
        ])->name("fraccionamiento.multiple.destroy");

        Route::get("/fraccionamientofecha", [
            FraccionamientoController::class,
            "index2",
        ])->name("fraccionamientosfecha.index");

        Route::get("/fraccionamientofecha/datos", [
            FraccionamientoController::class,
            "obtenerDatos",
        ])->name("fraccionamiento.datos");
    });

Route::prefix("administrar-Trabajov")
    ->middleware(["auth", "verified", "role:admin|arquitectorevisor"])
    ->group(function () {
        Route::resource("trabajosvar", TrabajosVariosController::class)->except(
            ["create", "show", "edit"]
        );
        Route::delete("/trabajosvar", [
            TrabajosVariosController::class,
            "destroyMultiple",
        ])->name("trabajosvar.multiple.destroy");

        Route::get("/trabajosfechas", [
            TrabajosVariosController::class,
            "index2",
        ])->name("trabajosfechas.index");

        Route::get("/trabajosfechas/datos", [
            TrabajosVariosController::class,
            "obtenerDatos",
        ])->name("trabajos.datos");
    });

Route::prefix("administrar-propiedadh")
    ->middleware(["auth", "verified", "role:admin|arquitectorevisor"])
    ->group(function () {
        Route::resource(
            "propiedadh",
            PropiedadHorizontalController::class
        )->except(["create", "show", "edit"]);
        Route::delete("/propiedadh", [
            PropiedadHorizontalController::class,
            "destroyMultiple",
        ])->name("propiedadh.multiple.destroy");

        Route::get("/propiedadhfechas", [
            PropiedadHorizontalController::class,
            "index2",
        ])->name("propiedadhfechas.index");

        Route::get("/propiedadhfechas/datos", [
            PropiedadHorizontalController::class,
            "obtenerDatos",
        ])->name("propiedadh.datos");
    });

Route::prefix("administrar-aforos")
    ->middleware(["auth", "verified", "role:admin|arquitectorevisor"])
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

        Route::get("/aforosfechas", [AforosController::class, "index2"])->name(
            "aforosfechas.index"
        );

        Route::get("/aforosfechas/datos", [
            AforosController::class,
            "obtenerDatos",
        ])->name("aforosf.datos");
    });

Route::prefix("administrar-unificaciones")
    ->middleware(["auth", "verified", "role:admin|arquitectorevisor"])
    ->group(function () {
        Route::resource(
            "unificacionlotes",
            UnificacionLController::class
        )->except(["create", "show", "edit"]);
        Route::delete("/unificacionlotes", [
            UnificacionLController::class,
            "destroyMultiple",
        ])->name("unificacionlotes.multiple.destroy");

        Route::get("/unificacionesfechas", [
            UnificacionLController::class,
            "index2",
        ])->name("unificacionfechas.index");

        Route::get("/unificacionesfechas/datos", [
            UnificacionLController::class,
            "obtenerDatos",
        ])->name("unificacionf.datos");
    });

Route::prefix("administrar-documentacion")
    ->middleware(["auth", "verified", "role:admin|arquitectorevisor|secretaria"])
    ->group(function () {
        Route::resource(
            "documentaciones",
            DocumentacionController::class
        )->except(["create", "show", "edit"]);
        
        Route::delete("/documentaciones", [
            DocumentacionController::class,
            "destroyMultiple",
        ])->name("documentaciones.multiple.destroy");

        Route::get("documentaciones/{id}/{nombre}", [
            DocumentacionController::class,
            "showWithFileName",
        ])->name("documentaciones.showWithFileName");
    });

    
Route::prefix("administrar-notificaciones")
->middleware(["auth", "verified", "role:admin|arquitectorevisor|secretaria"])
->group(function () {
    Route::resource("notificaciones", NotificacionesController::class)->except([
        "create",
        "show",
        "edit",
    ]);
    Route::delete("/notificaciones", [
        NotificacionesController::class,
        "destroyMultiple",
    ])->name("notificaciones.multiple.destroy");
 

});

Route::get("/audit", [AuditController::class, "index"])
    ->name("audit.index")
    ->middleware(["auth", "verified", "role:admin"]);