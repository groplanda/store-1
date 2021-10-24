<?php namespace Acme\Shop\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableUpdateAcmeShopPromocodeCategories extends Migration
{
    public function up()
    {
        Schema::rename('acme_shop_promocode_orders', 'acme_shop_promocode_categories');
        Schema::table('acme_shop_promocode_categories', function($table)
        {
            $table->dropPrimary(['promocode_id','order_id']);
            $table->renameColumn('order_id', 'category_id');
            $table->primary(['promocode_id','category_id']);
        });
    }
    
    public function down()
    {
        Schema::rename('acme_shop_promocode_categories', 'acme_shop_promocode_orders');
        Schema::table('acme_shop_promocode_orders', function($table)
        {
            $table->dropPrimary(['promocode_id','category_id']);
            $table->renameColumn('category_id', 'order_id');
            $table->primary(['promocode_id','order_id']);
        });
    }
}
