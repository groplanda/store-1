<?php namespace Acme\Shop\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableUpdateAcmeShopPromocode extends Migration
{
    public function up()
    {
        Schema::table('acme_shop_promocode', function($table)
        {
            $table->integer('value')->nullable();
        });
    }
    
    public function down()
    {
        Schema::table('acme_shop_promocode', function($table)
        {
            $table->dropColumn('value');
        });
    }
}
