<?php

namespace Acme\Shop\Classes;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Validator;
use Backend\Models\User;
use Acme\Shop\Models\Promocode;

class PromocodeController extends Controller
{
  /**
   *
   *
   * @return Response
   */
  public function add(Request $request)
  {

    $rules = [
      'name'    => 'required|max:255',
      'total'    => 'required',
    ];

    $messages = [
      'required' => 'Поле обязательно к заполнению!',
      'min'      => 'Минимум :min символов!',
      'max'      => 'Максимум :max символов!',
    ];

    $validator = Validator::make($request->all(), $rules, $messages);

    if ($validator->fails()) {

      $validatorErrors = $validator->errors()->toArray();
      return response()->json(array_merge(['status' => 'error'], $validatorErrors));

    } else {
      $name = trim($request->get('name'));
      $total = $request->get('total');
      $promocode = Promocode::whereRaw("BINARY `name`= ?",[$name])->where([['condition', '<=', $total], ['is_active', 1]])->first();

      if (!$promocode) {
        return response()->json(['status' => 'error', 'message' => 'Такого промокода нет. Попробуйте другой']);
      }
      return response()->json(array_merge(['status' => 'success', 'message' => 'Промокод успешно применён! - скидка ' . $promocode->value .' ₽ '], ['promocode' => $promocode]));
    }
  }
}
