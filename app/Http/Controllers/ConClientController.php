<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Con_Cliente;
use Inertia\Inertia;

class ConClientController extends Controller {
    public function index() {
        return Inertia::render("Customers/Client");
    }

    public function store(Request $request) {
        $validatedData = $request->validate([
            "cedula" => "required|string|unique:con_clientes",
            "id_direccion" => "nullable|string",
            "nombres_cliente" => "nullable|string",
            "correo_cliente" => "nullable|email",
        ]);

        Con_Cliente::create($validatedData);

        return to_route("customers");
    }
}
