<?php namespace Acme\Shop\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableUpdateAcmeShopOptionValue2 extends Migration
{
    public function up()
    {
        Schema::table('acme_shop_option_value', function($table)
        {
            $table->integer('sort_order')->nullable()->default(0);
        });
    }
    
    public function down()
    {
        Schema::table('acme_shop_option_value', function($table)
        {
            $table->dropColumn('sort_order');
        });
    }
}
