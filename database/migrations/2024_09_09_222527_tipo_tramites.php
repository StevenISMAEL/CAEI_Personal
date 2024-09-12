<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create("categorias", function (Blueprint $table) {
            $table->string("id_categoria", 7)->primary();
            $table->string("nombre", 200);
        });
        Schema::create("tipos_tramites", function (Blueprint $table) {
            $table->string("id_tipotramite", 7)->primary();
            $table->string("nombre", 300);
            $table->string("id_categoria", 7);

            $table
                ->foreign("id_categoria")
                ->references("id_categoria")
                ->on("categorias")
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
       
        Schema::dropIfExists("tipos_tramites");
        Schema::dropIfExists("categorias");
    }
};
