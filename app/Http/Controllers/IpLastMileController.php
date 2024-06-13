<?php

namespace App\Http\Controllers;

use App\Http\Requests\LastMileNapsRequest;
use Illuminate\Http\Request;
use App\Models\IpLastMile;
use App\Models\IpDistribution;
use Inertia\Inertia;
class IpLastMileController extends Controller {
    public function index() {
        return Inertia::render("Ips/LastMileNaps", [
            "DistributionNaps" => IpDistribution::all(),
            "LastMileNaps" => IpLastMile::getLastMileNaps(),
        ]);
    }

    public function store(LastMileNapsRequest $request) {
        // Validar y obtener los datos de la solicitud  
       IpLastMile:: create($request->validated());
    
        return redirect()->route("lastmileNaps.index");
    }
  

    public function update(LastMileNapsRequest $request, $id) {
        $distributionNap = IpLastMile::findOrFail($id);
        $distributionNap->update($request->validated());
        return redirect()->route("lastmileNaps.index");
    }

    public function destroy($id) {
        IpLastMile::findOrFail($id)->delete();
        return redirect()->route("lastmileNaps.index");
    }

    public function destroyMultiple(Request $request) {
        $ids = $request->input("ids");
        IpLastMile::whereIn("last_mile_nap_id", $ids)->delete();
        return redirect()->route("lastmileNaps.index");
    }
}
