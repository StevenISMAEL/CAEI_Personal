<?php

namespace App\Services;

use App\Models\ConContract;

class DashboardService {
    public function getSalesFunnelData() {
        return ConContract::join(
            "con_status",
            "con_contracts.status_id",
            "=",
            "con_status.status_id"
        )
            ->groupBy("con_status.status_name")
            ->selectRaw("con_status.status_name, count(*) as count")
            ->orderBy("count", "desc")
            ->get();
    }

    public function getClientsByPlanData() {
        return ConContract::join(
            "pla_plans",
            "con_contracts.plan_id",
            "=",
            "pla_plans.plan_id"
        )
            ->groupBy("pla_plans.plan_id", "pla_plans.plan_name")
            ->selectRaw("pla_plans.plan_name, count(*) as count")
            ->orderBy("count", "desc")
            ->get();
    }

    public function getMonthlySalesData() {
        return ConContract::selectRaw(
            'DATE_FORMAT(installation_date, "%Y-%m") as month, count(*) as count'
        )
            ->groupBy("month")
            ->orderBy("month")
            ->get();
    }

    public function getClientsByParishData() {
        return ConContract::join(
            "con_clients",
            "con_contracts.client_id",
            "=",
            "con_clients.client_id"
        )
            ->join(
                "con_sector",
                "con_clients.sector_id",
                "=",
                "con_sector.sector_id"
            )
            ->join(
                "con_parishes",
                "con_sector.parish_id",
                "=",
                "con_parishes.parish_id"
            )
            ->groupBy("con_parishes.parish_name")
            ->selectRaw("con_parishes.parish_name, count(*) as count")
            ->orderBy("count", "desc")
            ->get();
    }

    public function getDiscountsAppliedData() {
        return ConContract::join(
            "con_discounts",
            "con_contracts.discount_id",
            "=",
            "con_discounts.discount_id"
        )
            ->groupBy(
                "con_discounts.discount_id",
                "con_discounts.discount_name"
            )
            ->selectRaw("con_discounts.discount_name, count(*) as count")
            ->orderBy("count", "desc")
            ->get();
    }
}
