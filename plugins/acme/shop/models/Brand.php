<?php namespace Acme\Shop\Models;

use Model;

/**
 * Model
 */
class Brand extends Model
{
    use \October\Rain\Database\Traits\Validation;
    use \October\Rain\Database\Traits\Sortable;

    /*
     * Disable timestamps by default.
     * Remove this line if timestamps are defined in the database table.
     */
    public $timestamps = false;


    /**
     * @var string The database table used by the model.
     */
    public $table = 'acme_shop_brands';

    /**
     * @var array Validation rules
     */
    public $rules = [
    ];

    public $hasMany = [
      'products' => [\Acme\Shop\Models\Product::class, 'key' => 'brand_id']
    ];
}
