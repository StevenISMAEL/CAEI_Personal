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
            "Cantons" => ConCanton::all(),
        ]);
    }

    public function store(CantonRequest $request) {
        ConCanton::create($request->validated());
        return to_route("cantons");
    }
}
