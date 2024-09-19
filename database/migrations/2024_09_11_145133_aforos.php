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
        Schema::create("aforos", function (Blueprint $table) {
            $table->id("id_aforo");
            $table->unsignedBigInteger("id_tramite");
            $table->string("uso_suelo", 20);
            $table->string("local_comercial", 150);
            $table->integer("aforo_personas");
            $table->decimal("area_construccion", total: 8, places: 2);
            $table->date("inspeccion");
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
        Schema::dropIfExists("aforos");
    }
};
