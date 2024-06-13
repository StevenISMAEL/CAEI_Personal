<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Requests\DistributionNapsRequest;
use App\Models\IpDistribution;
use App\Models\IpOlts;

class IpDistributionController extends Controller
{
    public function index() {
        return Inertia::render("Ips/DistributionNaps", [
            "Olts" => IpOlts::all(),
            "DistributionNaps" => IpDistribution::getDistributionNaps(),
        ]);
      
    }

    public function store(DistributionNapsRequest $request) {
        IpDistribution::create($request->validated());
        return redirect()->route("distributionNaps.index");
    }

    public function update(DistributionNapsRequest $request, $id) {
        $distributionNap = IpDistribution::findOrFail($id);
        $distributionNap->update($request->validated());
        return redirect()->route("distributionNaps.index");
    }

    public function destroy($id) {
        IpDistribution::findOrFail($id)->delete();
        return redirect()->route("distributionNaps.index");
    }

    public function destroyMultiple(Request $request) {
        $ids = $request->input("ids");
        IpDistribution::whereIn("distribution_nap_id", $ids)->delete();
        return redirect()->route("distributionNaps.index");
    }
}
