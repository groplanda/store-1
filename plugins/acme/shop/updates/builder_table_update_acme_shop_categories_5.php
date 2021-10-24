<?php namespace Acme\Shop\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableUpdateAcmeShopCategories5 extends Migration
{
    public function up()
    {
        Schema::table('acme_shop_categories', function($table)
        {
            $table->string('meta_description')->nullable();
            $table->renameColumn('is_quiz', 'meta_title');
        });
    }
    
    public function down()
    {
        Schema::table('acme_shop_categories', function($table)
        {
            $table->dropColumn('meta_description');
            $table->renameColumn('meta_title', 'is_quiz');
        });
    }
}
