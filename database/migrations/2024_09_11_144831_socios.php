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
        Schema::create("socios", function (Blueprint $table) {
            $table->string("id_socio", 7)->primary();
            $table->string("nombres", 200);
            $table->string("apellidos", 200);
            $table->string("telefono", 10);
            $table->string("correo_electronico", 200);
            $table->string("universidad", 200);
            $table->string("direccion", 300);
            $table->date("fecha_nacimiento");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("socios");
    }
};
