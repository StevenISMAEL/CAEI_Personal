<?php
// routes/security_questions.php

use Illuminate\Support\Facades\Route;
use Bluecloud\SecurityQuestionHelpers\Http\Controller\SecurityQuestionsController;

Route::middleware(["auth"])->group(function () {
    Route::get("/security-questions", [
        SecurityQuestionsController::class,
        "index",
    ])->name("security-questions.index");
    Route::post("/security-questions", [
        SecurityQuestionsController::class,
        "store",
    ])->name("security-questions.store");
    Route::delete("/security-question/{id}", [
        SecurityQuestionsController::class,
        "destroy",
    ])->name("security-questions.destroy");
});

use App\Http\Controllers\SecurityQuestionEntryController;

Route::middleware("auth")->group(function () {
    Route::post("/security-question-entries", [
        SecurityQuestionEntryController::class,
        "store",
    ])->name("security-question-entries.store");
    Route::get("/security-question-entries", [
        SecurityQuestionEntryController::class,
        "index",
    ])->name("security-question-entries.index");
    Route::delete("/security-question-entries/{id}", [
        SecurityQuestionEntryController::class,
        "destroy",
    ])->name("security-question-entries.destroy");
});

use App\Http\Controllers\SecurityQuestionVerificationController;

// Añade esta ruta para la verificación de preguntas de seguridad
Route::get('security-questions', [SecurityQuestionVerificationController::class, 'create'])
    ->name('password.security-questions');

Route::post('security-questions/verify', [SecurityQuestionVerificationController::class, 'verify'])
    ->name('password.security-questions.verify');
