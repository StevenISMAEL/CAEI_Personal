<?php

namespace App\Http\Controllers;

 use App\Services\DashboardService;
use Inertia\Inertia;

class DashboardController extends Controller {
  


    protected $dashboardService;

    public function __construct(DashboardService $dashboardService) {
        $this->dashboardService = $dashboardService;
    }

    public function index() {
        return Inertia::render("Dashboard", [
            "tramitesestado" => $this->dashboardService->getConteoTramitesPorEstado(),
            "tramitesporcategoria" => $this->dashboardService->getConteoTramitesPorCategoria(),

            
        ]);
    }
}
