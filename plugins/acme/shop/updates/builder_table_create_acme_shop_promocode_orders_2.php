<?php namespace Acme\Shop\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableCreateAcmeShopPromocodeOrders2 extends Migration
{
    public function up()
    {
        Schema::create('acme_shop_promocode_orders', function($table)
        {
            $table->engine = 'InnoDB';
            $table->smallInteger('promocode_id');
            $table->smallInteger('order_id');
            $table->primary(['promocode_id','order_id']);
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('acme_shop_promocode_orders');
    }
}
