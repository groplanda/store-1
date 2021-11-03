<?php namespace Acme\Shop\Models;

use Model;

/**
 * Model
 */
class Option extends Model
{
    use \October\Rain\Database\Traits\Validation;
    use \October\Rain\Database\Traits\Sortable;


    /**
     * @var string The database table used by the model.
     */
    public $table = 'acme_shop_option';

    /**
     * @var array Validation rules
     */
    public $rules = [
      'type' => 'required',
    ];

    public $hasMany = [
      'option_value' => [\Acme\Shop\Models\OptionValue::class, 'key' => 'option_id'],
      'product_option' => [\Acme\Shop\Models\ProductOptionValue::class, 'key' => 'option_id']
    ];
}
