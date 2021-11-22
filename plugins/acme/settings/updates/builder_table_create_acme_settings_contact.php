<?php namespace Acme\Settings\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableCreateAcmeSettingsContact extends Migration
{
    public function up()
    {
        Schema::create('acme_settings_contact', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id')->unsigned();
            $table->string('name')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->integer('sort_order')->nullable();
            $table->boolean('is_active')->nullable()->default(1);
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('acme_settings_contact');
    }
}
