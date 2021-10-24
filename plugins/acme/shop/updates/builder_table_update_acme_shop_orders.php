<?php namespace Acme\Shop\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableUpdateAcmeShopOrders extends Migration
{
    public function up()
    {
        Schema::table('acme_shop_orders', function($table)
        {
            $table->renameColumn('title', 'name');
        });
    }
    
    public function down()
    {
        Schema::table('acme_shop_orders', function($table)
        {
            $table->renameColumn('name', 'title');
        });
    }
}
