<?php

namespace App\Http\Middleware;

use Bluecloud\SecurityQuestionHelpers\SecurityQuestion;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware {
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = "app";

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array {
        return [
            ...parent::share($request),
            "auth" => [
                "user" => $request->user(),
            ],
            "flash" => [
                "message" => fn() => $request->session()->get("message"),
                "type" => fn() => $request->session()->get("type"),
            ],
            "env" => [
                "SESSION_LIFETIME" => config("session.lifetime"),
            ],
            "logoArquitectos" => asset("images/logoArquitectos.png"),
            'securityQuestions' => SecurityQuestion::all(),
        ];
    }
}
