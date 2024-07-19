<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Inertia\Inertia;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . "/../routes/web.php",
        commands: __DIR__ . "/../routes/console.php",
        health: "/up"
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(
            append: [
                \App\Http\Middleware\HandleInertiaRequests::class,
                \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            ]
        );

        $middleware->alias([
            "role" => \Spatie\Permission\Middleware\RoleMiddleware::class,
            "permission" =>
                \Spatie\Permission\Middleware\PermissionMiddleware::class,
            "role_or_permission" =>
                \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
            "throttle" =>
                \Illuminate\Routing\Middleware\ThrottleRequests::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->respond(function (
            Response $response,
            Throwable $exception,
            Request $request
        ) {
            if (
                !app()->environment(["local", "testing"]) &&
                in_array($response->getStatusCode(), [500, 502, 503, 404, 403])
            ) {
                return Inertia::render("ErrorPage", [
                    "status" => $response->getStatusCode(),
                ])
                    ->toResponse($request)
                    ->setStatusCode($response->getStatusCode());
            } elseif ($response->getStatusCode() === 419) {
                return back()
                    ->with([
                        "message" =>
                            "La página ha caducado, por favor inténtalo de nuevo.",
                    ])
                    ->with("type", "warning");
            } elseif ($response->getStatusCode() === 429) {
                return back()
                    ->with([
                        "message" =>
                            "Demasiadas peticiones, por favor espera un minuto.",
                    ])
                    ->with("type", "error");
            } elseif ($response->getStatusCode() === 401) {
                return back()
                    ->with([
                        "message" => "No autorizado, por favor inicia sesión.",
                    ])
                    ->with("type", "error");
            } elseif ($response->getStatusCode() === 400) {
                return back()
                    ->with([
                        "message" =>
                            "Solicitud incorrecta, por favor verifica los datos enviados.",
                    ])
                    ->with("type", "error");
            } elseif ($response->getStatusCode() === 422) {
                return back()
                    ->with([
                        "message" =>
                            "Entidad no procesable, por favor revisa los errores de validación.",
                    ])
                    ->with("type", "error");
            } elseif ($response->getStatusCode() === 408) {
                return back()
                    ->with([
                        "message" =>
                            "Tiempo de espera de la solicitud agotado, por favor intenta de nuevo.",
                    ])
                    ->with("type", "error");
            }
            return $response;
        });
    })
    ->create();
