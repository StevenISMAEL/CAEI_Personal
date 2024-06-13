<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sup_type_order', function (Blueprint $table) {
            $table->string("type_order_id", 8)->primary();
            $table->string("name_type_order",50);
            $table->string("description_type_order",150);
        });

        Schema::create('sup_type_report', function (Blueprint $table) {
            $table->string("type_report_id", 8)->primary();
            $table->string("type_order_id", 8);
            $table->string("name_type_report",50);
            $table->string("description_type_report",150);
            $table->foreign("type_order_id")->references("type_order_id")->on("sup_type_order")->cascadeOnDelete()->cascadeOnUpdate();
        });

        Schema::create('sup_work_orders', function (Blueprint $table) {
            $table->string('work_order_id', 8)->primary();
            $table->dateTime('solution_date');
            $table->dateTime('issue_date');
            $table->string('employee_id', 7);
            $table->string('movement_id', 8);
            $table->string('type_report_id', 8);
            $table->string('order_channel', 150);
            $table->string('order_abclaim', 250);
            $table->string('order_initial_abis', 150);
            $table->string('order_initial_potency', 150);
            $table->string('order_final_abis', 150);
            $table->string('order_initial_diagnosis', 250);
            $table->string('order_solution', 250);
            $table->boolean('order_relevant')->default(false);
            $table->string('order_current_potency', 150);
            $table->string('order_status', 50);

            $table->foreign('type_report_id')
                  ->references('type_report_id')->on('sup_type_report')
                  ->cascadeOnDelete()
                  ->cascadeOnUpdate();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sup_work_orders', function (Blueprint $table) {
            $table->dropForeign(['type_report_id']);
        });
        Schema::dropIfExists('sup_work_orders');

        Schema::table('sup_type_report', function (Blueprint $table) {
            $table->dropForeign(['type_order_id']);
        });
        Schema::dropIfExists('sup_type_report');

        Schema::dropIfExists('sup_type_order');
    }
};
