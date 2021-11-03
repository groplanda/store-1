<?php namespace Acme\Shop\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableCreateAcmeShopOptionDescription extends Migration
{
    public function up()
    {
        Schema::create('acme_shop_option_description', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id')->unsigned();
            $table->integer('option_id');
            $table->string('name');
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('acme_shop_option_description');
    }
}
