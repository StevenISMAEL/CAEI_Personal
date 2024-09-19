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
        Schema::create("propiedad_horizontal", function (Blueprint $table) {
            $table->id("id_propiedadh");
            $table->unsignedBigInteger("id_tramite");
            $table->boolean("definitivo");
            $table->boolean("modificatorio");
            $table->string("uso_suelo", 20);
            $table->decimal("area_construccion", total: 8, places: 2);
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
        Schema::dropIfExists("propiedad_horizontal");
    }
};
