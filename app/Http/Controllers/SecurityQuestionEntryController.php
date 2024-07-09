<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Bluecloud\SecurityQuestionHelpers\SecurityQuestionEntry;
use Illuminate\Support\Facades\Auth;

class SecurityQuestionEntryController extends Controller {
    public function store(Request $request) {
        $validated = $request->validate([
            "security_question_id" => "required|exists:security_questions,id",
            "answer" => "required|string",
        ]);

        $entry = SecurityQuestionEntry::create([
            "user_id" => Auth::id(),
            "security_question_id" => $validated["security_question_id"],
            "answer" => $validated["answer"],
        ]);

        return response()->json(
            [
                "message" => "Security question entry created successfully",
                "entry" => $entry,
            ],
            201
        );
    }

    public function index() {
        try {
            $entries = SecurityQuestionEntry::where("user_id", Auth::user()->id)
                ->with("question")
                ->get();

            return response()->json([
                "entries" => $entries,
            ]);
        } catch (\Exception $e) {
            return response()->json(
                [
                    "error" =>
                        "Ocurrió un error al obtener las preguntas de seguridad",
                ],
                500
            );
        }
    }

    public function destroy($id) {
        $entry = SecurityQuestionEntry::where(
            "user_id",
            Auth::id()
        )->findOrFail($id);
        $entry->delete();

        return response()->json([
            "message" => "Security question entry deleted successfully",
        ]);
    }
}
