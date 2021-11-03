<?php namespace Acme\Shop\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableUpdateAcmeShopOption2 extends Migration
{
    public function up()
    {
        Schema::table('acme_shop_option', function($table)
        {
            $table->dropColumn('value');
        });
    }
    
    public function down()
    {
        Schema::table('acme_shop_option', function($table)
        {
            $table->string('value', 255)->nullable();
        });
    }
}
