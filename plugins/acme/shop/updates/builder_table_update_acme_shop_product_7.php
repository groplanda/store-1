<?php namespace Acme\Shop\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableUpdateAcmeShopProduct7 extends Migration
{
    public function up()
    {
        Schema::table('acme_shop_product', function($table)
        {
            $table->decimal('price', 10, 2)->nullable(false)->unsigned(false)->default(null)->change();
            $table->decimal('sale_price', 10, 2)->nullable(false)->unsigned(false)->default(null)->change();
        });
    }
    
    public function down()
    {
        Schema::table('acme_shop_product', function($table)
        {
            $table->integer('price')->nullable(false)->unsigned(false)->default(null)->change();
            $table->integer('sale_price')->nullable(false)->unsigned(false)->default(null)->change();
        });
    }
}
