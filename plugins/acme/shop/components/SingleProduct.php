<?php namespace Acme\Shop\Components;

use Acme\Shop\Models\Product;
use Acme\Shop\Models\Wish;
use Auth;

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
      $page = post('page', null);
      if (isset($page) && !empty($page)) {
        $id = $page;
      } else {
        $id = $this->param('id');
      }

      $product = Product::with(['gallery', 'tags'])->with(['comments' => function($query) {
        $query->orderBy('sort_order', 'asc')->where('status', 1);
      }])->with(['categories' => function($query) {
        $query->orderBy('sort_order', 'asc')->where('is_show', 1)->get(['id', 'parent_id', 'title', 'slug']);
      }])->with(['brand' => function($query) {
        $query->where([['is_active', 1]])->select(['id', 'title'])->get();
      }])->with(['featured' => function($query) {
        $query->orderBy('sort_order', 'asc')->where('is_active', 1)->get(['id', 'code', 'title', 'image']);
      }])->with(['options' => function($query) {
        $query->with(['product_option' => function($query) {
          $query->select(['id', 'type', 'name'])->get();
        }])->with(['option_value' => function($query) {
          $query->select(['id', 'name'])->get();
        }])->get();
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
        $breadcrumbs[] = ['title' => 'Меню', 'url' => 'catalog'];
        foreach($product->categories as $category) {
          $breadcrumbs[] = [ 'title' => $category->title, 'url' => $category->slug, 'category' => true ];
        }
        $breadcrumbs[] = [ 'title' => $this->page->title, 'url' => $product->id, 'category' => true ];
        $this->page['breadcrumbs'] = $breadcrumbs;
      }

      if ($product->categories[0]) {
        $this->page['additionals'] = Product::select(['id', 'title', 'slug', 'image', 'sale_price', 'price'])->where([['is_active', 1], ['id', '!=', $product->id]])->orderBy('sort_order', 'asc')->limit(4)->get();
      }

      $user = $this->checkUser();
      if ($user) {
        $this->page['user_id'] = $user->id;
        $this->page['is_wish'] = $this->isProductWish($user->id, $product->id);
      }
    }

    public function onRun()
    {
      $this->prepareVars();
    }

    public function onFeature()
    {
      $this->prepareVars();
    }

    private function checkUser() {
      if (!$user = Auth::getUser()) {
        return null;
      }
      if (!Auth::isImpersonator()) {
          $user->touchLastSeen();
      }
      return $user;
    }

    private function isProductWish($user_id, $product_id) {
      $wish = Wish::where('user_id', $user_id)->first();
      if ($wish) {
        $products = $wish->products;
        if(is_array($products)) {
          return array_search($product_id, $products) !== false;
        }
        return false;
      }
    }
}