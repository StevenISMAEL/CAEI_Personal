<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAuditsTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        $connection = config(
            "audit.drivers.database.connection",
            config("database.default")
        );
        $table = config("audit.drivers.database.table", "audits");

        Schema::create("audits", function (Blueprint $table) {
            $table->bigIncrements("id");
            $table->string("auditable_type");
            $table->string("auditable_id"); // Configurado como string para manejar claves primarias de tipo string
            $table->string("event");
            $table->text("old_values")->nullable();
            $table->text("new_values")->nullable();
            $table->text("url")->nullable();
            $table->ipAddress("ip_address")->nullable();
            $table->string("user_agent", 1023)->nullable();
            $table->string("tags")->nullable();
            $table->unsignedBigInteger("user_id")->nullable(); // Asegúrate de que esta columna esté incluida
            $table->string("user_type")->nullable(); // Opcional, si estás utilizando user_type
            $table->timestamps();

            $table->index(["auditable_id", "auditable_type"]);
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        $connection = config(
            "audit.drivers.database.connection",
            config("database.default")
        );
        $table = config("audit.drivers.database.table", "audits");

        Schema::connection($connection)->drop($table);
    }
}