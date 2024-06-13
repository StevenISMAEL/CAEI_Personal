<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\MovementRequest;
use App\Models\InvMovement;
use App\Models\InvProduct;
use Inertia\Inertia;

class InvMovementController extends Controller {
    public function index() {
        return Inertia::render("Inventory/Movement", [
            "Products" => InvProduct::all(),
            "Movements" => InvMovement::getMovements(),
        ]);
    }
    public function store(MovementRequest $movementRequest) {
        InvMovement::create($movementRequest->validated());
        return to_route("movements.index");
    }
    public function update(MovementRequest $movementRequest, $id) {
        $movement = InvMovement::findOrFail($id);
        $movement->update($movementRequest->validated());
        return to_route("movements.index");
    }
    public function destroy($id) {
        InvMovement::find($id)->delete();
        return to_route("movements.index");
    }

    public function destroyMultiple(Request $request) {
        $ids = $request->input("ids");
        InvMovement::whereIn("movement_id", $ids)->delete();
        return to_route("movements.index");
    }
}
