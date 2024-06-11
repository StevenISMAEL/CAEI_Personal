<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ConPhone;
use App\Http\Requests\PhoneRequest;
use App\Models\ConClient;
use Inertia\Inertia;

class ConPhoneController extends Controller {
    public function index() {
        return Inertia::render("Customers/Phone", [
            "Clients" => ConClient::all(),
            "Phones" => ConPhone::getPhones(),
        ]);
    }

    public function store(PhoneRequest $phoneRequest) {
        ConPhone::create($phoneRequest->validated());
        return to_route("phones.index");
    }

    public function update(PhoneRequest $phoneRequest, $id) {
        $phone = ConPhone::findOrFail($id);
        $phone->update($phoneRequest->validated());
        return to_route("phones.index");
    }

    public function destroy($id) {
        ConPhone::find($id)->delete();
        return to_route("phones.index");
    }

    public function destroyMultiple(Request $request) {
        $phoneNumbers = $request->input("ids");
        ConPhone::whereIn("phone_number", $phoneNumbers)->delete();
        return to_route("phones.index");
    }
}
