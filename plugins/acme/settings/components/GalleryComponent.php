<?php namespace Acme\Settings\Components;

use Acme\Settings\Models\Gallery;

class GalleryComponent extends \Cms\Classes\ComponentBase
{
    public $gallery;

    public function componentDetails()
    {
      return [
          'name' => 'Галерея',
          'description' => 'Показать галерею'
      ];
    }

    public function defineProperties()
    {
        return [
          'galleryName' => [
            'title'             => 'Выбор галереи',
            'default'           => 1,
            'type'              => 'dropdown',
            'placeholder'       => 'Выберите',
          ]
        ];
    }

    public function getGalleryNameOptions()
    {
      return Gallery::all()->lists('title', 'id');
    }

    public function onRun()
    {
      $this->gallery = Gallery::with(['images'])->where('id', $this->property('galleryName'))->first();
    }

}
