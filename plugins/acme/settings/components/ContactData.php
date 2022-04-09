<?php namespace Acme\Settings\Components;

use Cms\Classes\ComponentBase;
use Acme\Settings\Models\Contact;
use Cookie;

class ContactData extends ComponentBase
{

  public function componentDetails()
  {
      return [
          'name'          => 'Блок контактов',
          'description'   => 'показать контакты'
      ];
  }

  public function defineProperties()
    {
      return [
          'templateType' => [
            'title'       => 'Выбор',
            'type'        => 'dropdown',
            'default'     => 'default',
            'placeholder' => 'Выберите...',
            'options'     => ['default' => 'Шапка', 'footer' => 'Подвал']
          ]
      ];
    }

  public function onRender()
  {
    $view = $this->property('templateType');

    if($view == 'footer') {
      return $this->renderPartial('@_footer.htm');
    }
  }

  public function prepareVars()
  {
    if (isset($_COOKIE['selected_city']) && !empty($_COOKIE['selected_city'])) {
      $cidyId = $_COOKIE['selected_city'];
      $data = Contact::findOrFail((int)$cidyId);
    } else {
      $data = Contact::active()->orderBy('sort_order', 'asc')->first();
    }
    $count = Contact::active()->count();
    return [
      'data' => $data,
      'count' => $count
    ];
  }

  public function onRun()
  {
    $result = $this->prepareVars();
    $this->page['contact'] = $result['data'];
    $this->page['count'] = $result['count'];
  }


}
