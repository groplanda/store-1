<?php namespace Acme\Settings\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableCreateAcmeSettingsGallery extends Migration
{
    public function up()
    {
        Schema::create('acme_settings_gallery', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id')->unsigned();
            $table->string('title')->nullable();
            $table->string('page')->nullable();
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('acme_settings_gallery');
    }
}
