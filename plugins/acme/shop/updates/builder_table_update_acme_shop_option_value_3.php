<?php namespace Acme\Shop\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableUpdateAcmeShopOptionValue3 extends Migration
{
    public function up()
    {
        Schema::table('acme_shop_option_value', function($table)
        {
            $table->increments('id')->change();
        });
    }
    
    public function down()
    {
        Schema::table('acme_shop_option_value', function($table)
        {
            $table->integer('id')->change();
        });
    }
}
