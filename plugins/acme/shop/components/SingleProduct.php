<?php namespace Acme\Shop\Components;

use Acme\Shop\Models\Product;

class SingleProduct extends \Cms\Classes\ComponentBase
{
    public function componentDetails()
    {
      return [
        'name' => 'Товар',
        'description' => 'Показать товар'
      ];
    }


    function prepareVars()
    {
      $id = $this->param('id');
      $product = Product::with(['gallery', 'tags'])->with(['comments' => function($query) {
        $query->orderBy('sort_order', 'asc')->where('status', 1);
      }])->with(['categories' => function($query) {
        $query->orderBy('sort_order', 'asc')->where('is_show', 1)->get(['id', 'parent_id', 'title', 'slug']);
      }])->with(['brand' => function($query) {
        $query->where([['is_active', 1]])->select(['id', 'title'])->get();
      }])->where('id', $id)->first();

      if($product == null) {
          return \Response::make($this->controller->run('404'), 404);
      }
      $this->page['product'] = $product;
      $this->page->title = $this->page['product']->title;
      $this->page->meta_title = $this->page['product']->meta_title;
      $this->page->meta_description = $this->page['product']->meta_description;

      if ($product->categories) {
        $breadcrumbs = [];
        $breadcrumbs[] = ['title' => 'Главная', 'url' => 'home'];
        $breadcrumbs[] = ['title' => 'Каталог', 'url' => 'catalog'];
        foreach($product->categories as $category) {
          $breadcrumbs[] = [ 'title' => $category->title, 'url' => $category->slug, 'category' => true ];
        }
        $breadcrumbs[] = [ 'title' => $this->page->title, 'url' => $product->id, 'category' => true ];
        $this->page['breadcrumbs'] = $breadcrumbs;
      }

      if ($product->categories[0]) {

        $this->page['additionals'] = Product::select(['id', 'title', 'slug', 'image', 'sale_price', 'price'])->where([['is_active', 1], ['id', '!=', $product->id]])->orderBy('sort_order', 'asc')->limit(4)->get();
      }
    }

    public function onRun()
    {
      $this->prepareVars();
    }

    public function getBreadcrumbs() {

    }
}