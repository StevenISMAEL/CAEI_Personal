<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create("inv_products", function (Blueprint $table) {
            $table->string("product_id", length: 8)->primary();
            $table->string("product_name", length: 50);
            $table->string("product_description", length: 150);
            $table->decimal("product_price", total: 8, places: 2);
            $table->bigInteger("product_quantity");
            $table->string("product_brand", length: 50);
            $table->decimal("product_vat", total: 8, places: 2);
        });

        Schema::create("inv_movements", function (Blueprint $table) {
            $table->string("movement_id", length: 8)->primary();
            $table->string("product_id", length: 8);
            $table->date("movement_date");
            $table->bigInteger("movement_quantity");
            $table->decimal("movement_total", total: 8, places: 2);
            $table->enum("movement_type", ["Entrada", "Salida"]);

            $table
                ->foreign("product_id")
                ->references("product_id")
                ->on("inv_products")
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
            /*
            

            $table
                ->foreign("work_order_id")
                ->references("work_order_id")
                ->on("sup_work_orders")
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
            $table
                ->foreign("product_id")
                ->references("product_id")
                ->on("inv_products")
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
                */
        });

        Schema::create("sup_work_orders", function (Blueprint $table) {
            $table->string("work_order_id", length: 8)->primary();
            $table->string("movement_id", length: 8);
            $table->dateTime("solution_date", precision: 0);
            $table->dateTime("issue_date", precision: 0);
            $table->string("employee_id", length: 7);
            $table->string("order_channel", length: 150);
            $table->string("order_abclaim", length: 250);
            $table->string("order_initial_abis", length: 150);
            $table->string("order_initial_potency", length: 150);
            $table->string("order_final_abis", length: 150);
            $table->string("order_initial_diagnosis", length: 250);
            $table->string("order_solution", length: 250);
            $table->boolean("order_relevant");
            $table->string("order_current_potency", length: 150);
            $table->string("order_status", length: 50);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::table("inv_movements", function (Blueprint $table) {
            $table->dropForeign(["product_id"]);
        });
        /*
        Schema::table("inv_movements", function (Blueprint $table) {
            $table->dropForeign(["work_order_id"]);
        });
        Schema::table("inv_movements", function (Blueprint $table) {
            $table->dropForeign(["movement_type_id"]);
        });
        */
        Schema::dropIfExists("inv_products");
        Schema::dropIfExists("inv_movements");
        Schema::dropIfExists("sup_work_orders");
    }
};
