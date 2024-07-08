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
use App\Models\ConPhone;

use Inertia\Inertia;

class ConContractController extends Controller {
    public function index() {
        return Inertia::render("Contracts/contract", [
            "Clients" => ConClient::getClientAllInfo(),
            "Plans" => Plans::all(),
            "Olts" => IpOlts::all(),
            "LastMiles" => IpLastMile::all(),
            "Distributions" => IpDistribution::all(),
            "Ips" => Ips::all(),
            "Status" => ConStatus::all(),
            "Discounts" => ConDiscount::all(),
            "Phones" => ConPhone::all(),
            "Contracts" => ConContract::getContracts(),
        ]);
    }
    public function store(ContractRequest $contractRequest) {
        $validatedData = $contractRequest->validated();

        // Encontrar la IP y actualizarla si existe
        $ip = Ips::find($validatedData["ip_address"]);
        if ($ip) {
            $ip->ip_status = "1";
            $ip->last_mile_nap_id = $validatedData["last_mile_nap_id"];
        }

        // Crear el contrato
        $contract = ConContract::create($validatedData);
        $ip->save();

        // Redirigir a la página de contratos
        return to_route("contracts.index");
    }
    public function update(ContractRequest $contractRequest, $id) {
        // Encontrar el contrato existente
        $contract = ConContract::findOrFail($id);

        // Validar y obtener los datos del request
        $validatedData = $contractRequest->validated();

        // Encontrar la IP anterior y actualizarla si existe
        $oldIp = Ips::find($contract->ip_address);
        if ($oldIp) {
            $oldIp->ip_status = "0"; // Cambiar estado de la IP anterior a 0
            $oldIp->last_mile_nap_id = null; // Resetear last_mile_id de la IP anterior
        }

        // Encontrar la nueva IP y actualizarla si existe
        $newIp = Ips::find($validatedData["ip_address"]);
        if ($newIp) {
            $newIp->ip_status = "1"; // Cambiar estado de la nueva IP a 1
            $newIp->last_mile_nap_id = $validatedData["last_mile_nap_id"]; // Actualizar last_mile_id de la nueva IP
        }

        $contract->ip_address = $validatedData["ip_address"];

        // Actualizar el contrato con los datos validados
        $contract->update($validatedData);
        $oldIp->save();
        $newIp->save();
        // Redirigir a la página de contratos
        return to_route("contracts.index");
    }

    public function destroy($id) {
        $contract = ConContract::find($id);

        // Cambiar el estado del contrato a inactivo u otro estado deseado
        $contract->status_id = "STS-0002"; // Por ejemplo, cambia "Inactivo" por el estado que necesites
        $contract->save();

        return to_route("contracts.index");
    }

    public function destroyMultiple(Request $request) {
        $ids = $request->input("ids");
        ConContract::whereIn("contract_num", $ids)->delete();
        return to_route("contracts.index");
    }
}
