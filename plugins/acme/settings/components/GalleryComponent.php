<?php namespace Acme\Settings\Components;

use Acme\Settings\Models\Gallery;

class GalleryComponent extends \Cms\Classes\ComponentBase
{
  public $gallery;

    public function componentDetails()
    {
        return [
            'name' => 'Галерея',
            'description' => 'Показать фото'
        ];
    }

    public function defineProperties()
    {
      return [
          'templateSlider' => [
            'title'       => 'Выбор',
            'type'        => 'dropdown',
            'default'     => 'default',
            'placeholder' => 'Выберите...',
            'options'     => ['default' => 'Обычный', 'docs' => 'Сертификаты']
          ],
          'galleryId' => [
            'title'             => 'Выберите галерею',
            'type'              => 'dropdown',
            'default'           => 'us'
          ]
      ];
    }

    public function onRender()
    {
      $view = $this->property('templateSlider');

      if($view == 'docs') {
        return $this->renderPartial('@_docs.htm');
      }
    }

    public function getGalleryIdOptions()
    {
        return Gallery::all()->lists('title', 'id');
    }

    public function onRun()
    {
      $conditional = ['id' => $this->property('galleryId')];
      $this->gallery = Gallery::where($conditional)->first();
    }

}
