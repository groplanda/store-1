<?php namespace Acme\Shop\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableCreateAcmeShopOptionValue extends Migration
{
    public function up()
    {
        Schema::create('acme_shop_option_value', function($table)
        {
            $table->engine = 'InnoDB';
            $table->integer('id');
            $table->string('name')->nullable();
            $table->integer('option_id')->nullable();
            $table->primary(['id']);
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('acme_shop_option_value');
    }
}
