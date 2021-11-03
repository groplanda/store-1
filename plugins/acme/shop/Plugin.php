<?php namespace Acme\Shop;

use App;
use System\Classes\PluginBase;
use Illuminate\Foundation\AliasLoader;

class Plugin extends PluginBase
{
    public function registerComponents()
    {
      return [
        'Acme\Shop\Components\Notification'        => 'Notification',
        'Acme\Shop\Components\CategoryList'        => 'CategoryList',
        'Acme\Shop\Components\ProductList'         => 'ProductList',
        'Acme\Shop\Components\SingleProduct'       => 'SingleProduct',
        'Acme\Shop\Components\PopularProducts'     => 'PopularProducts',
        'Acme\Shop\Components\CategoryMenu'        => 'CategoryMenu',
        'Acme\Shop\Components\BrandList'           => 'BrandList',
        'Acme\Shop\Components\SingleBrand'         => 'SingleBrand',
        'Acme\Shop\Components\SingleBrand'         => 'SingleBrand',
        \Acme\Shop\Components\HeaderSession::class => 'HeaderSession'
      ];
    }

    public function registerMailLayouts()
    {
      return [
        'order' => 'acme.shop::layouts.order'
      ];
    }

    public function registerMailTemplates()
    {
      return [
          'acme.shop::mail.order',
          'acme.shop::mail.message',
          'acme.shop::mail.restore'
      ];
    }

    public function registerSettings()
    {
    }

    public function registerFormWidgets()
    {
        return [
            'Acme\Shop\FormWidgets\Parentbox' => [
                'label' => 'Parent box',
                'code' => 'parentbox'
            ],
            'Acme\Shop\FormWidgets\FeaturedBox' => [
              'label' => 'Featured box',
              'code' => 'featuredbox'
            ],
            'Acme\Shop\FormWidgets\BrandBox' => [
              'label' => 'Brand box',
              'code' => 'brandbox'
            ]
        ];
    }

    public function boot()
    {
      $this->app['Illuminate\Contracts\Http\Kernel']
      ->pushMiddleware('Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse');
    }

}
