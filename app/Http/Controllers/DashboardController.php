<?php

namespace App\Http\Controllers;

use App\Models\Audit;
// use App\Services\DashboardService;
use Inertia\Inertia;

class DashboardController extends Controller {
  
    public function index() {
        return Inertia::render("Dashboard");
    }
}
