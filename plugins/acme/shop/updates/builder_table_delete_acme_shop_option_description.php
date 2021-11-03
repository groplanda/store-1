<?php namespace Acme\Shop\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableDeleteAcmeShopOptionDescription extends Migration
{
    public function up()
    {
        Schema::dropIfExists('acme_shop_option_description');
    }
    
    public function down()
    {
        Schema::create('acme_shop_option_description', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id')->unsigned();
            $table->integer('option_id');
            $table->string('name', 255);
        });
    }
}
