<?php namespace Acme\Profile\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class AddNewFields extends Migration
{

    public function up()
    {
        Schema::table('users', function($table)
        {
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->boolean('is_subscribe')->nullable();
        });
    }

    public function down()
    {
      $table->dropDown([
        'phone',
        'address',
        'is_subscribe'
      ]);
    }

}
