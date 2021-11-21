<?php namespace Acme\Shop\Models;

use Model;

/**
 * Model
 */
class Wish extends Model
{
    use \October\Rain\Database\Traits\Validation;


    /**
     * @var string The database table used by the model.
     */
    public $table = 'acme_shop_wish';

    protected $casts = [
      'id' => 'integer',
      'user_id' => 'integer'
    ];

    protected $jsonable = ['products'];

    public $belongsTo  = [
      'user' => [\RainLab\User\Models\User::class, 'key' => 'user_id']
    ];
    /**
     * @var array Validation rules
     */
    public $rules = [
    ];
}
