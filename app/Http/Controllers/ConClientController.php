<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ConSector;
use App\Http\Requests\ClientRequest;
use App\Models\ConClient;
use Inertia\Inertia;

class ConClientController extends Controller {
    public function index() {
        return Inertia::render("Customers/Client", [
            "Sectors" => ConSector::all(),
            "Clients" => ConClient::getClients(),
        ]);
    }

    public function store(ClientRequest $clientRequest) {
        ConClient::create($clientRequest->validated());
        return to_route("clients.index");
    }

    public function update(ClientRequest $clientRequest, $client) {
        $client = ConClient::findOrFail($client);
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
