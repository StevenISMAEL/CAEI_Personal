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
        Schema::create("requisitos", function (Blueprint $table) {
            $table->string("id_requisito", 10)->primary();
            $table->string("descripcion", 600);
        });
        Schema::create("tramite_requisitos", function (Blueprint $table) {
            $table->string("id_requisito", 10);
            $table->unsignedBigInteger("id_tramite");
            $table->boolean("cumplido");
            $table->string("comentarios", 250)->nullable();

            $table
                ->foreign("id_requisito")
                ->references("id_requisito")
                ->on("requisitos")
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
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
        Schema::dropIfExists("tramite_requisitos");
        Schema::dropIfExists("requisitos");
    }
};
