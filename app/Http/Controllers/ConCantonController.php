<?php

namespace App\Http\Controllers;

use App\Http\Requests\CantonRequest;
use App\Models\ConCanton;
use App\Models\ConProvince;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConCantonController extends Controller {
    public function index() {
        return Inertia::render("Customers/Canton", [
            "Provinces" => ConProvince::all(),
            "Cantons" => ConCanton::getCantons(),
        ]);
    }

    public function store(CantonRequest $cantonRequest) {
        ConCanton::create($cantonRequest->validated());
        return to_route("cantons");
    }

    public function destroy($id) {
        ConCanton::find($id)->delete();
        return to_route("cantons");
    }

    public function destroyMultiple(Request $request) {
        $ids = $request->input("ids");
        ConCanton::whereIn("canton_id", $ids)->delete();
        return to_route("cantons");
    }
}
