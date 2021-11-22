<?php namespace Acme\Settings\Components;

use Cms\Classes\ComponentBase;
use Acme\Settings\Models\Contact;

class ContactModal extends ComponentBase
{

  public function componentDetails()
  {
      return [
          'name'          => 'Список городов',
          'description'   => 'Список городов'
      ];
  }

  public function prepareVars()
  {
    return Contact::active()->orderBy('sort_order', 'asc')->get();
  }

  public function onRun()
  {
    if (isset($_COOKIE['selected_city']) && !empty($_COOKIE['selected_city'])) {
      $cidyId = $_COOKIE['selected_city'];
    } else {
      $cidyId = 1;
    }

    $this->page['contacts'] = $this->prepareVars();
    $this->page['selectedId'] = $cidyId;
  }

}