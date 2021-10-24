<?php namespace Acme\Shop\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableUpdateAcmeShopOrders2 extends Migration
{
    public function up()
    {
        Schema::table('acme_shop_orders', function($table)
        {
            $table->string('user_payment')->nullable();
            $table->text('order_id')->nullable();
        });
    }
    
    public function down()
    {
        Schema::table('acme_shop_orders', function($table)
        {
            $table->dropColumn('user_payment');
            $table->dropColumn('order_id');
        });
    }
}
