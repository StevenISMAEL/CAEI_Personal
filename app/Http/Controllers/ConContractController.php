<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\ContractRequest;
use App\Models\ConContract;
use App\Models\ConClient;
use App\Models\Plans;
use App\Models\Ips;
use App\Models\IpOlts;
use App\Models\IpLastMile;
use App\Models\IpDistribution;
use App\Models\ConDiscount;
use App\Models\ConStatus;

use Inertia\Inertia;

class ConContractController extends Controller {
    public function index() {
        return Inertia::render("Contracts/contract", [
            "Clients" => ConClient::all(),
            "Plans" => Plans::all(),
            "Olts" => IpOlts::all(),
            "LastMiles" => IpLastMile::all(),
            "Distributions" => IpDistribution::all(),
            "Ips" => Ips::all(),
            "Status" => ConStatus::all(),
            "Discounts" => ConDiscount::all(),
            "Contracts" => ConContract::getContracts(),
        ]);
    }
    public function store(ContractRequest $contractRequest) {
        $contract = ConContract::create($contractRequest->validated());
        $ip = Ips::find($contract->ip_address);

        // Cambiar el estado de la IP
        if ($ip) {
            $ip->ip_status = "1";
            $ip->save();
        }
        return to_route("contracts.index");
    }
    public function update(ContractRequest $contractRequest, $id) {
        $contract = ConContract::findOrFail($id);
        if ($contract->ip_address != $contractRequest->ip_address) {
            // Cambiar el estado de la IP anterior a 0
            $oldIp = Ips::find($contract->ip_address);
            if ($oldIp) {
                $oldIp->ip_status = "0";
                $oldIp->save();
            }

            // Cambiar el estado de la nueva IP a 1
            $newIp = Ips::find($contractRequest->ip_address);
            if ($newIp) {
                $newIp->ip_status = "1";
                $newIp->save();
            }

            // Actualizar la dirección IP en el contrato
            $contract->ip_address = $contractRequest->ip_address;
        }
        $contract->update($contractRequest->validated());
        return to_route("contracts.index");
    }
    public function destroy($id) {
        ConContract::find($id)->delete();
        return to_route("contracts.index");
    }

    public function destroyMultiple(Request $request) {
        $ids = $request->input("ids");
        ConContract::whereIn("contract_num", $ids)->delete();
        return to_route("contracts.index");
    }
}
