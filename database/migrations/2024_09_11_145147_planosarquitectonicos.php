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
        Schema::create("planos_arquitectonicos", function (Blueprint $table) {
            $table->id("id_planosarq");
            $table->unsignedBigInteger("id_tramite");
            $table->boolean("anteproyecto");
            $table->boolean("definitivo");
            $table->boolean("modificatorio");
            $table->boolean("ampliatorio");
            $table->string("uso_suelo", 20);
            $table->decimal("area_construccion", total: 8, places: 2);
            $table->decimal("area_construccion2", total: 8, places: 2)->nullable();
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
        Schema::dropIfExists("planos_arquitectonicos");
    }
};
