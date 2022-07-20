<?php namespace Acme\Settings\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableUpdateAcmeSettingsSlider3 extends Migration
{
    public function up()
    {
        Schema::table('acme_settings_slider', function($table)
        {
            $table->text('props')->nullable();
        });
    }
    
    public function down()
    {
        Schema::table('acme_settings_slider', function($table)
        {
            $table->dropColumn('props');
        });
    }
}
