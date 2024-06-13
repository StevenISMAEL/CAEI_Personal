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
        Schema::create('con_status', function (Blueprint $table) {
            $table->string("status_id", 8)->primary();
            $table->string("status_name", 50);
            $table->string("status_description",100);
        });

        Schema::create('pla_plans', function (Blueprint $table) {
            $table->string("plan_id", 8)->primary();
            $table->string("plan_name", 50);
            $table->double("plan_value");
            $table->integer("plan_megas");
            $table->string("plan_description", 250);
        });

        Schema::create('con_discounts', function (Blueprint $table) {
            $table->string("discount_id", 8)->primary();
            $table->string("discount_name", 50);
            $table->string("discount_description",100);
        });

        Schema::create('con_contracts', function (Blueprint $table) {
            $table->string('contract_id', 8)->primary();
            $table->string('client_id', 10);
            $table->string('ip_address', 15);
            $table->string('plan_id', 8);
            $table->string('discount_id', 8);
            $table->string('status_id', 8);
            $table->string('work_order_id', 8);
            $table->string('contract_num', 13);
            $table->date('installation_date');
            $table->foreign('client_id')
                  ->references('client_id')->on('con_clients')
                  ->cascadeOnDelete()
                  ->cascadeOnUpdate();

            $table->foreign('plan_id')
                  ->references('plan_id')->on('pla_plans')
                  ->cascadeOnDelete()
                  ->cascadeOnUpdate();

            $table->foreign('discount_id')
                  ->references('discount_id')->on('con_discounts')
                  ->cascadeOnDelete()
                  ->cascadeOnUpdate();

            $table->foreign('status_id')
                  ->references('status_id')->on('con_status')
                  ->cascadeOnDelete()
                  ->cascadeOnUpdate();

            $table->foreign('work_order_id')
                  ->references('work_order_id')->on('sup_work_orders')
                  ->cascadeOnDelete()
                  ->cascadeOnUpdate();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('con_contracts', function (Blueprint $table) {
            $table->dropForeign(['client_id']);
            $table->dropForeign(['plan_id']);
            $table->dropForeign(['discount_id']);
            $table->dropForeign(['status_id']);
            $table->dropForeign(['work_order_id']);
        });
    
        Schema::dropIfExists('con_contracts');
        Schema::dropIfExists('con_status');
        Schema::dropIfExists('pla_plans');
        Schema::dropIfExists('con_discounts');
    }
};
