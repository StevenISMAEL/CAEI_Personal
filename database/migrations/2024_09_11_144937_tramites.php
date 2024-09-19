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
        Schema::create("tramites", function (Blueprint $table) {
            $table->id("id_tramite");
            $table->unsignedBigInteger("id_usuario"); //para el usuario 
            $table->string("id_tipotramite", 10);
            $table->string("tramite", 250);
            $table->string("propietario", 250);
            $table->date("fecha_ingreso");
            $table->date("fecha_salida")->nullable();
            $table->string("informe", 30)->nullable();
            $table->string("entregado", 250)->nullable();
            $table->date("fecha_entrega")->nullable();
            $table->string("reasignado", 250)->nullable();
            $table->date("fecha_reasignacion")->nullable();
            $table->string("arquitecto_responsable", 250)->nullable();
            $table->string("direccion", 300)->nullable();
            $table->string("clave_catastral", 150)->nullable();
            $table->string("estado_ingreso", 15)->nullable();
            $table->string("estado_tramite", 15)->nullable();
            $table->string("correo_electronico", 200);
            $table->timestamps();

            $table
            ->foreign("id_usuario")
            ->references("id")
            ->on("users")
            ->cascadeOnUpdate()
            ->cascadeOnDelete();
            
            $table
            ->foreign("id_tipotramite")
            ->references("id_tipotramite")
            ->on("tipos_tramites")
            ->cascadeOnUpdate()
            ->cascadeOnDelete();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("tramites");
    }
};
