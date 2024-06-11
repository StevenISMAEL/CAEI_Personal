<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\IpOlts;
class IpOltsController extends Controller
{
    public function index() {
        return Inertia::render("Ips/Olt", [
            "Olts" => IpOlts::all(),
        ]);
    }

    public function store(Request $request) {
        $validatedData = $request->validate([
            'olt_name' => 'required|string|max:50',
            'olt_address' => 'required|string|max:100',
            'olt_coordx' => 'required|string|max:25',
            'olt_coordy' => 'required|string|max:25',
            'olt_ports' => 'required|integer',
        ]);

        IpOlts::create($validatedData);

        return to_route("olts.index");
    }

    public function update(Request $request, $id) {
        $ipOlts = IpOlts::findOrFail($id);

        $validatedData = $request->validate([
            'olt_name' => 'required|string|max:50',
            'olt_address' => 'required|string|max:100',
            'olt_coordx' => 'required|string|max:25',
            'olt_coordy' => 'required|string|max:25',
            'olt_ports' => 'required|integer',
        ]);

        $ipOlts->update($validatedData);

        return to_route("olts.index");
    }

    public function destroy($id) {
        IpOlts::findOrFail($id)->delete();

        return to_route("olts.index");
    }

    public function destroyMultiple(Request $request) {
        $ids = $request->input('ids');
        IpOlts::whereIn('olt_id', $ids)->delete();

        return to_route("olts.index");
    }
}
