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
        Schema::create("unificacion_lotes", function (Blueprint $table) {
            $table->id("id_unificacion");
            $table->unsignedBigInteger("id_tramite");
            $table->decimal("area_aprobada", total: 8, places: 2);
            $table->timestamps();
            
            $table
            ->foreign("id_tramite")
            ->references("id_tramite")
            ->on("tramites")
            ->cascadeOnUpdate()
            ->cascadeOnDelete();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("unificacion_lotes");
    }
};
