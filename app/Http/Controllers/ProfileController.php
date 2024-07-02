<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Contracts\TwoFactorAuthenticationProvider;

class ProfileController extends Controller {
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response {
        return Inertia::render("Profile/Edit", [
            "mustVerifyEmail" => $request->user() instanceof MustVerifyEmail,
            "status" => session("status"),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty("email")) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route("profile.edit");
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse {
        $request->validate([
            "password" => ["required", "current_password"],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to("/");
    }

    // //2FA Fortify
    // public function enableTwoFactorAuthentication(Request $request) {
    //     $user = $request->user();
    //     $provider = app(TwoFactorAuthenticationProvider::class);
    //     $user
    //         ->forceFill([
    //             "two_factor_secret" => $provider->generateSecretKey(),
    //             "two_factor_recovery_codes" => $provider->generateRecoveryCodes(),
    //         ])
    //         ->save();

    //     return response()->json([
    //         "svg" => $provider->qrCodeSvg($user),
    //         "recovery_codes" => $provider->getRecoveryCodes($user),
    //     ]);
    // }

    // public function disableTwoFactorAuthentication(Request $request) {
    //     $user = $request->user();
    //     $user
    //         ->forceFill([
    //             "two_factor_secret" => null,
    //             "two_factor_recovery_codes" => null,
    //         ])
    //         ->save();

    //     return response()->json([
    //         "message" => "Two factor authentication disabled.",
    //     ]);
    // }
}
