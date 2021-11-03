<?php namespace Acme\Shop\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableUpdateAcmeShopOption extends Migration
{
    public function up()
    {
        Schema::table('acme_shop_option', function($table)
        {
            $table->string('name')->nullable();
            $table->string('value')->nullable();
        });
    }
    
    public function down()
    {
        Schema::table('acme_shop_option', function($table)
        {
            $table->dropColumn('name');
            $table->dropColumn('value');
        });
    }
}
