<?php namespace Acme\Shop\Models;

use Model;

/**
 * Model
 */
class Comment extends Model
{
    use \October\Rain\Database\Traits\Validation;
    use \October\Rain\Database\Traits\Sortable;


    /**
     * @var string The database table used by the model.
     */
    public $table = 'acme_shop_comment';

    protected $casts = [
      'id' => 'integer',
      'star' => 'integer',
      'status' => 'integer',
    ];

    /**
     * @var array Validation rules
     */
    public $rules = [
    ];

    public $belongsTo = [
      'product' => \Acme\Shop\Models\Product::class,
      'key' => 'comment_id'
    ];
}
