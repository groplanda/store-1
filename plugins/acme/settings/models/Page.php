<?php namespace Acme\Settings\Models;

use Model;

/**
 * Model
 */
class Page extends Model
{
    use \October\Rain\Database\Traits\Validation;
    use \October\Rain\Database\Traits\Sortable;


    /**
     * @var string The database table used by the model.
     */
    public $table = 'acme_settings_page';
    protected $slugs = ['slug' => 'title'];

    /**
     * @var array Validation rules
     */
    public $rules = [
      'title' => 'required'
    ];

    public function scopeActive($query)
    {
      return $query->where('is_active', 1);
    }
}
