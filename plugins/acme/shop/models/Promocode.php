<?php namespace Acme\Shop\Models;

use Model;

/**
 * Model
 */
class Promocode extends Model
{
    use \October\Rain\Database\Traits\Validation;


    /**
     * @var string The database table used by the model.
     */
    public $table = 'acme_shop_promocode';

    protected $casts = [
      'id' => 'integer',
      'type' => 'integer',
      'is_active' => 'boolean',
      'value' => 'integer'
    ];

    /**
     * @var array Validation rules
     */
    public $rules = [
    ];
}
