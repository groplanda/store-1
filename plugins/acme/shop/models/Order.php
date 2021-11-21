<?php namespace Acme\Shop\Models;

use Model;

/**
 * Model
 */
class Order extends Model
{
    use \October\Rain\Database\Traits\Validation;


    /**
     * @var string The database table used by the model.
     */
    public $table = 'acme_shop_orders';

    protected $casts = [
      'id' => 'integer',
      'user_id' => 'integer',
      'user_delivery' => 'integer',
    ];

    /**
     * @var array Validation rules
     */
    public $rules = [
      'name' => 'required'
    ];

    protected $jsonable = ['products'];

    public $belongsTo  = [
      'user' => [\RainLab\User\Models\User::class, 'key' => 'user_id']
    ];

    public $hasOne = [
      'promocode' => [\Acme\Shop\Models\Promocode::class, 'key' => 'id']
    ];
}
