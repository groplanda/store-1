<?php namespace Acme\Shop\Models;

use Model;

/**
 * Model
 */
class OptionValue extends Model
{
    use \October\Rain\Database\Traits\Validation;


    /**
     * @var string The database table used by the model.
     */
    public $table = 'acme_shop_option_value';

    /**
     * @var array Validation rules
     */
    public $rules = [

    ];

    public $hasMany = [
      'option_value' => [\Acme\Shop\Models\OptionValue::class],
      'product_option_value' => [\Acme\Shop\Models\ProductOptionValue::class, 'key' => 'option_value_id']
    ];
}
