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
        Schema::create("documentos", function (Blueprint $table) {
            $table->id("id_documento");
            $table->unsignedBigInteger("id_tramite");
            $table->string("tipo_documento", 50);
            $table->text("observacion");
            $table->string("archivo", 300);
            $table->timestamps();
            $table
            ->foreign("id_tramite")
            ->references("id_tramite")
            ->on("tramites")
            ->cascadeOnUpdate()
            ->cascadeOnDelete();
        }); 

        Schema::create("notificaciones", function (Blueprint $table) {
            $table->id("id_notificacion");
            $table->unsignedBigInteger("id_tramite");
            $table->date("fecha_envio");
            $table->string("estado", 15); 

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
        Schema::dropIfExists("documentos");
        Schema::dropIfExists("notificaciones");

    }
};
