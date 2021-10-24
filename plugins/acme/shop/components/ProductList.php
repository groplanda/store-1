<?php namespace Acme\Shop\Components;

use Acme\Shop\Models\Product;
use Acme\Shop\Models\Category;

class ProductList extends \Cms\Classes\ComponentBase
{
    public function componentDetails()
    {
        return [
            'name' => 'Список товаров',
            'description' => 'Показать товары'
        ];
    }

    public function defineProperties()
    {
        return [
            'maxItems' => [
                'title'             => 'Товаров на странице',
                'default'           => 12,
                'type'              => 'string',
                'validationPattern' => '^[0-9]+$',
                'validationMessage' => 'Можно использовать только цифры'
            ]
        ];
    }

    function prepareVars()
    {
        $slug = $this->param('slug');
        $options = post('filter', []);
        $perPage = $this->property('maxItems');
        $breadcrumbs = [];

        if ($slug == null) {
            $this->page['products'] = Product::active()->listFrontEnd($options, $perPage);
        } else {
            $category = Category::where('slug', $slug)->with(['products' => function($query) {
              $query->select(['id', 'title', 'slug', 'image', 'sale_price', 'price', 'brand_id'])->where('is_active', 1)->with('tags')->with(['brand' => function($query) {
                return $query->where([['is_active', 1]])->select(['id', 'title'])->get();
              }])->get();
            }])->withCount('products')->first();

            if($category == null) {
              return \Response::make($this->controller->run('404'), 404);
            }

            $breadcrumbs[] = ['title' => 'Главная', 'url' => 'home'];
            $breadcrumbs[] = ['title' => 'Каталог', 'url' => 'catalog'];

            if (isset($category->parent_id) && !empty($category->parent_id)) {
              $this->page['categories'] = Category::where([['parent_id', $category->parent_id], ['is_show', 1], ['id', '!=', $category->id]])->select(['id', 'title', 'slug', 'image'])->get();
              $parentCat= Category::where([['id', $category->parent_id], ['is_show', 1]])->select(['id', 'title', 'slug'])->first();
              $breadcrumbs[] = [ 'title' => $parentCat->title, 'url' => $parentCat->slug, 'category' => true ];
              $this->page['parentCat'] = $parentCat;
            }

            $products = $category->products()->listFrontEnd($options, $perPage);

            // filters
            $this->page['maxPrice'] = $category->products()->max('price');
            $this->page['minPrice'] = $category->products()->min('sale_price') ? $category->products()->min('sale_price') : $category->products()->min('price');

            $this->page->title = $category->title;
            $this->page->meta_title = $category->meta_title;
            $this->page->meta_description = $category->meta_description;
            $this->page['category'] = $category;
            $this->page['products'] = $products;
            $this->page['countLabel'] = $this->choseWordForm($category->products_count, 'товар', 'товара', 'товаров');
            $this->page['brands'] = $this->prepareBrands($category->products);
            $breadcrumbs[] = [ 'title' => $this->page->title, 'url' => $category->slug, 'category' => true ];
        }
        $this->page['currentPage'] = $this->page['products']->currentPage();
        $this->page['pages'] = $this->page['products']->lastPage();
        $this->page['perPage'] = $perPage;
        $this->page['breadcrumbs'] = $breadcrumbs;
    }

    public function onRun()
    {
        $this->prepareVars();
    }

    public function onFilterProduct()
    {
        $this->prepareVars();
    }

    private function choseWordForm(int $count, string $form1, string $form2, string $form5) {
      $count = abs($count) % 100;
      $count1 = $count % 10;
      if ($count > 10 && $count < 20) return $form5;
      if ($count1 > 1 && $count1 < 5) return $form2;
      if ($count1 == 1) return $form1;
      return $form5;
    }

    private function prepareBrands($products) {
      $brands = [];
      foreach($products as $product) {
        if (isset($product->brand) && !empty($product->brand)) {
          $brands[] = [ 'title' => $product->brand['title'], 'id' => $product->brand['id'] ];
        }
      }
      return array_map('unserialize', array_unique(array_map('serialize', $brands)));
    }
}
