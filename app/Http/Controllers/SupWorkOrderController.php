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



class SupWorkOrderController extends Controller
{
    public function index()
    {
        return Inertia::render("Support/WorkOrder", [
            "Employees" => User::all(),
            "Clients" => ConClient::all(),
            "Plans" => Plans::all(),
            "Olts" => IpOlts::all(),
            "Distributions" => IpDistribution::all(),
            "LastMiles" => IpLastMile::all(),
            "Ips" => Ips::all(),
            "Sector"=>ConSector::all(),
            "TypeReports" => SupTypeReport::all(),
            "TypeOrders" => SupTypeOrder::all(),
            "Contracts" => ConContract::all(),
            "Phones" => ConPhone::all(),
            "WorkOrders" => SupWorkOrder::getWorkOrders(),
        ]);
    }

    public function store(SupWorkOrderRequest $request)
    {
       SupWorkOrder::create($request->validated());
        return to_route("workorder.index");
    }

    public function update(SupWorkOrderRequest $request, $id)
    {
        $workOrder = SupWorkOrder::findOrFail($id);
        $workOrder->update($request->validated());
        return to_route("workorder.index");
    }

    public function destroy($id)
    {
        SupWorkOrder::find($id)->delete();
        return redirect()->route("workorder.index");
    }

    public function destroyMultiple(Request $request)
    {
        $ids = $request->input("ids");
        SupWorkOrder::whereIn("work_order_num", $ids)->delete();
        return redirect()->route("workorder.index");
    }
}
