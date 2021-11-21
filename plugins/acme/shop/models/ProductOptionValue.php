<?php namespace Acme\Shop\Models;

use Model;

/**
 * Model
 */
class ProductOptionValue extends Model
{
    use \October\Rain\Database\Traits\Validation;

    /*
     * Disable timestamps by default.
     * Remove this line if timestamps are defined in the database table.
     */
    public $timestamps = false;


    /**
     * @var string The database table used by the model.
     */
    public $table = 'acme_shop_product_option_value';

    protected $casts = [
      'id' => 'integer',
      'product_id' => 'integer',
      'option_id' => 'integer',
      'option_value_id' => 'integer',
      'price' => 'integer',
      'sale_price' => 'integer',
      'quantity' => 'integer',
      'key' => 'integer'
    ];

    /**
     * @var array Validation rules
     */
    public $rules = [
    ];

    public $belongsTo = [
      'product_option' => [\Acme\Shop\Models\Option::class, 'key' => 'option_id', 'otherKey' => 'id'],
      'option_value' => [\Acme\Shop\Models\OptionValue::class, 'key' => 'option_value_id', 'otherKey' => 'id']
    ];

}
