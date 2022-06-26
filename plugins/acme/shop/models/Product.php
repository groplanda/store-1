<?php namespace Acme\Shop\Models;

use Model;
/**
 * Model
 */
class Product extends Model
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
    public $table = 'acme_shop_product';

    protected $jsonable = ['props'];
    protected $slugs = ['slug' => 'title'];

    /**
     * @var array Validation rules
     */
    public $rules = [
      'title' => 'required',
      'gallery.*' => 'image|max:1000|dimensions:min_width=100,min_height=100'
    ];

    public $attachMany = [
      'gallery' => ['System\Models\File', 'delete' => true ]
    ];

    public function afterDelete() {
      foreach ($this->gallery as $image) {
          $image->delete();
      }
    }

    public $belongsToMany = [
      'categories' => [
          'Acme\Shop\Models\Category',
          'table' => 'acme_shop_product_categories',
      ],
      'tags' => [
        'Acme\Shop\Models\Tag',
        'table' => 'acme_shop_product_tags',
      ],
      'featured' => [
        \Acme\Shop\Models\Product::class,
        'table'    => 'acme_shop_product_featured',
        'key'      => 'product_id',
        'otherKey' => 'featured_id',
        'order'    => 'title'
      ],
    ];

    public $belongsTo = [
      'brand' => [\Acme\Shop\Models\Brand::class],
    ];

    public $hasMany  = [
      'comments' => [\Acme\Shop\Models\Comment::class, 'key' => 'product_id'],
      'options' => [\Acme\Shop\Models\ProductOptionValue::class, 'key' => 'product_id']
    ];

    public static $allowedSortingOptions = [
      'sort_order asc' => 'По умолчанию',
      'price asc' => 'Цена по возрастанию',
      'price desc' => 'Цена по убыванию',
      'created_at desc' => 'По новинкам',
      'sale_price desc' => 'По скидкам',
      'is_featured desc' => 'Вначале популярные',
      //'rating desc' => 'По рейтингу',
    ];

    public function scopeListFrontEnd($query, $options = [], $perPage = 6)
    {

      extract(array_merge([
          'page'       => 1,
          'perPage'    => $perPage,
          'categories' => null,
          'colors' => null,
          'sizes' => null,
          'sort' => 'price asc',
          'min' => null,
          'max' => null,
          'brand' => null
      ], $options));

      //categories
      if($categories !== null) {
          if(!is_array($categories)) {
              $categories = [$categories];
          }
          foreach($categories as $category) {
              $query->whereHas('categories', function($q) use ($category) {
                  $q->where('id', '=', $category);
              });
          }
      }

      //colors
      if(!empty($colors)) {
          foreach($colors as $color) {
              $query->whereHas('options', function($q) use ($colors) {
                  $q->whereIn('id', $colors);
              });
          }
      }

      //sizes
      if(!empty($sizes)) {
          foreach($sizes as $size) {
              $query->whereHas('options', function($q) use ($sizes) {
                  $q->whereIn('id', $sizes);
              });
          }
      }

      //brand
      if(!empty($brand)) {
        $query->whereHas('brand', function($q) use ($brand) {
          $q->whereIn('id', $brand);
        });
      }

      //sortable
      if(!is_array($sort)) {
          $sort = [$sort];
      }
      foreach($sort as $_sort) {
          if(in_array($_sort, array_keys(self::$allowedSortingOptions))) {
              $parts = explode(' ', $_sort);
              if(count($parts) < 2) {
                  array_push($parts, 'desc');
              }
              list($sortField, $sortDirecton) = $parts;
              if($sortField === 'rating') {
                  $query->whereHas('comments', function($q) {
                      $q->sortBy('avg(rating)')->orderBy($sortField, 'desc');
                  });
              } else {
                  $query->orderBy($sortField, $sortDirecton);
              }

          }
      }

      //price
      if($min !== null && $max !== null) {
          $query->whereBetween('price', [$min, $max]);
      }

      $lastPage = $query->paginate($perPage, $page)->lastPage();

      if($lastPage < $page){
          $page = 1;
      }

      return $query->paginate($perPage, $page);
    }

    public function scopeActive($query)
    {
      return $query->where('is_active', '1');
    }

    public function scopeFeatured($query)
    {
      return $query->where('is_featured', '1');
    }

    public function afterSave()
    {
      $self = $this;
      $list = [];
      foreach($this->featured as $row) {
        $list[] = $row->id;
      }

      $products = Product::select('id')->whereIn('id', $list)->get();
      foreach($products as $product) {
        $diff = array_diff($list, [$product->id]);
        array_push($diff, $self->id);
        $product->featured()->sync($diff);
      }

      $allProducts = Product::select('id')->whereNotIn('id', $list)->get();
      foreach($allProducts as $product) {
        $featured = $product->featured;
        if (count($featured)) {
          foreach($featured as $f) {
            if (!in_array($f->id, $list)) {
              $product->featured()->detach($f->id);
            }
          }
        }
      }

    }

}
