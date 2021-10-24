<?php namespace Acme\Shop\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableCreateAcmeShopPromocode extends Migration
{
    public function up()
    {
        Schema::create('acme_shop_promocode', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id')->unsigned();
            $table->string('name')->nullable();
            $table->integer('type')->nullable();
            $table->boolean('is_active')->nullable()->default(1);
            $table->string('condition')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('acme_shop_promocode');
    }
}
