<?php namespace Acme\Shop\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableUpdateAcmeShopOrders5 extends Migration
{
    public function up()
    {
        Schema::table('acme_shop_orders', function($table)
        {
            $table->integer('user_delivery')->nullable();
            $table->string('user_entrance', 25)->nullable();
            $table->string('user_flat', 25);
        });
    }
    
    public function down()
    {
        Schema::table('acme_shop_orders', function($table)
        {
            $table->dropColumn('user_delivery');
            $table->dropColumn('user_entrance');
            $table->dropColumn('user_flat');
        });
    }
}
