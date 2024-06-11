<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\AddressRequest;
use App\Models\ConParish;
use App\Models\ConAddress;
use Inertia\Inertia;

class ConAddressController extends Controller {
    public function index() {
        return Inertia::render("Customers/Address", [
            "Parishes" => ConParish::all(),
            "Addresses" => ConAddress::getAddresses(),
        ]);
    }

    public function store(AddressRequest $addressRequest) {
        ConAddress::create($addressRequest->validated());
        return to_route("addresses.index");
    }

    public function update(AddressRequest $addressRequest, $id) {
        $address = ConAddress::findOrFail($id);
        $address->update($addressRequest->validated());
        return to_route("addresses.index");
    }

    public function destroy($id) {
        ConAddress::find($id)->delete();
        return to_route("addresses.index");
    }

    public function destroyMultiple(Request $request) {
        $ids = $request->input("ids");
        ConAddress::whereIn("address_id", $ids)->delete();
        return to_route("addresses.index");
    }
}
