<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ConAddress;
use App\Http\Requests\ClientRequest;
use App\Models\ConClient;
use Inertia\Inertia;

class ConClientController extends Controller {
    public function index() {
        return Inertia::render("Customers/Client", [
            "Addresses" => ConAddress::all(),
            "Clients" => ConClient::getClients(),
        ]);
    }

    public function store(ClientRequest $clientRequest) {
        ConClient::create($clientRequest->validated());
        return to_route("clients.index");
    }

    public function update(ClientRequest $clientRequest, $id) {
        $client = ConClient::findOrFail($id);
        $client->update($clientRequest->validated());
        return to_route("clients.index");
    }

    public function destroy($id) {
        ConClient::find($id)->delete();
        return to_route("clients.index");
    }

    public function destroyMultiple(Request $request) {
        $ids = $request->input("ids");
        ConClient::whereIn("client_id", $ids)->delete();
        return to_route("clients.index");
    }
}
