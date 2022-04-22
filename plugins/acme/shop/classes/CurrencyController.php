<?php

namespace Acme\Shop\Classes;

use Illuminate\Routing\Controller;
use Cms\Classes\Theme;
use Cookie;

class CurrencyController extends Controller
{

  public function get()
  {
    static $rates = 1;
    $theme = Theme::getActiveTheme();

    if ((int)$theme->show_currency) {
      $data = $this->CBR_XML_Daily_Ru();
      if ($data) {
        $rates = $data->Valute->USD->Value;
      } else if ($theme->manual_currency) {
        $rates = (int)$theme->manual_currency;
      }
    }
    return response()->json(['value' => $rates]);
  }

  public function CBR_XML_Daily_Ru()
  {
    return json_decode(file_get_contents('https://www.cbr-xml-daily.ru/daily_json.js'));
  }

}
