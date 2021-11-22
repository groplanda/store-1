<?php namespace Acme\Shop\Models;

use Model;

/**
 * Model
 */
class Category extends Model
{
    use \October\Rain\Database\Traits\Validation;
    use \October\Rain\Database\Traits\Sortable;
    use \October\Rain\Database\Traits\Sluggable;
    use \October\Rain\Database\Traits\SimpleTree;

    /*
     * Disable timestamps by default.
     * Remove this line if timestamps are defined in the database table.
     */
    public $timestamps = false;


    /**
     * @var string The database table used by the model.
     */
    public $table = 'acme_shop_categories';
    protected $slugs = ['slug' => 'title'];
    protected $columns = ['id', 'title', 'slug', 'description', 'image', 'is_show', 'meta_description', 'meta_title', 'parent_id', 'sort_order'];

    protected $casts = [
      'id' => 'integer',
      'is_show' => 'boolean',
    ];

    /**
     * @var array Validation rules
     */
    public $rules = [
      'title' => 'required'
    ];

    public $belongsToMany = [
      'products' => [
          'Acme\Shop\Models\Product',
          'table' => 'acme_shop_product_categories'
      ]
    ];

    public function children()
    {
      return $this->hasMany('Acme\Shop\Models\Category', 'parent_id');
    }

    public function scopeExclude($query, $value = [])
    {
      return $query->select(array_diff($this->columns, (array) $value));
    }

}
