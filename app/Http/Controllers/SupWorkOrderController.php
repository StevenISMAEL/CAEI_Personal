<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ConContract;
use App\Models\ConClient;

use App\Models\User;
use App\Models\SupTypeReport;
use App\Models\SupWorkOrder;
use App\Http\Requests\SupWorkOrderRequest;
use App\Models\ConPhone;
use App\Models\ConSector;
use App\Models\Plans;

use App\Models\Ips;
use App\Models\IpOlts;
use App\Models\IpLastMile;
use App\Models\SupTypeOrder;
use App\Models\IpDistribution;
use Inertia\Inertia;

use Illuminate\Support\Facades\Log;

class SupWorkOrderController extends Controller {
    public function index() {
        return Inertia::render("Support/WorkOrder", [
            "Employees" => User::all(),
            "Clients" => ConClient::all(),
            "Plans" => Plans::all(),
            "Olts" => IpOlts::all(),
            "Distributions" => IpDistribution::all(),
            "LastMiles" => IpLastMile::all(),
            "Ips" => Ips::all(),
            "Sector" => ConSector::all(),
            "TypeReports" => SupTypeReport::all(),
            "TypeOrders" => SupTypeOrder::all(),
            "Contracts" => ConContract::all(),
            "Phones" => ConPhone::all(),
            "WorkOrders" => SupWorkOrder::getWorkOrders(),
        ]);
    }

    public function store(SupWorkOrderRequest $request) {
        SupWorkOrder::create($request->validated());
        return to_route("workorder.index");
    }

    public function update(SupWorkOrderRequest $request, $id) {
        $workOrder = SupWorkOrder::findOrFail($id);
        $workOrder->update($request->validated());
        return to_route("workorder.index");
    }

    public function destroy($id) {
        SupWorkOrder::find($id)->delete();
        return to_route("workorder.index");
    }

    public function destroyMultiple(Request $request) {
        $ids = $request->input("ids");
        $work = SupWorkOrder::whereIn("work_order_id", $ids)->get();

        foreach ($work as $order) {
            $order->delete();
        }
        return to_route("workorder.index");
    }
    public function updateStatus(Request $request) {
        try {
            $workOrderIds = $request->input("workOrderIds");
            $newStatus = $request->input("newStatus");

            $updated = SupWorkOrder::whereIn(
                "work_order_id",
                $workOrderIds
            )->update(["order_status" => $newStatus]);

            Log::info("Órdenes actualizadas: " . $updated);

            return redirect()
                ->route("workorder.index")
                ->with(
                    "success",
                    "Órdenes de trabajo actualizadas correctamente."
                );
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return redirect()
                ->route("workorder.index")
                ->with(
                    "error",
                    "Error al actualizar las órdenes de trabajo: " .
                        $e->getMessage()
                );
        }
    }
}
