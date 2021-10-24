<?php

namespace Acme\Shop\Classes;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Validator;
use Mail;
use Backend\Models\User;
use Acme\Shop\Models\Order;
use Acme\Shop\Models\Promocode;
use Acme\Settings\Models\Demand;
use YooKassa\Client;

class OrderController extends Controller
{
  /**
   *
   *
   * @return Response
   */
  public function add(Request $request)
  {

    $rules = [
      'user_name'       => 'required|min:4|max:50',
      'user_phone'      => 'required|min:11|max:50',
      'user_address'    => 'max:100',
      'user_email'      => 'email',
      'user_comment'    => 'max:500',
      'user_payment'    => 'required',
      'products'        => 'required',
      'user_sum'        => 'required',
      'user_promocode'  => 'numeric'
    ];

    $messages = [
      'required' => 'Поле обязательно к заполнению!',
      'min'      => 'Минимум :min символов!',
      'max'      => 'Максимум :max символов!',
      'email'    => 'Некорректный e-mail',
      'user_payment.required' => 'Выберите тип оплаты!'
    ];
    $validator = Validator::make($request->all(), $rules, $messages);

    if ($validator->fails()) {

      $validatorErrors = $validator->errors()->toArray();
      return response()->json(array_merge(['status' => 'error'], $validatorErrors));

    } else {
      $total = $request->get('user_sum');
      $promocode = $this->checkPromocode($request->get('user_promocode'), $request->get('user_sum'));

      if ($this->hasProp($promocode)) {
        $total -= $promocode->value;
      }

      date_default_timezone_set('Europe/Moscow');
      $time = date('m/d/Y H:i:s', time());

      Mail::send('acme.shop::mail.message', $request->all(), function($message) {
        $message->to($this->getUserMail(), 'Admin Person');
        $message->subject('Новый заказ с сайта');
      });

      if ($request->get('user_email')) {
        $vars = $request->all();
        Mail::send('acme.shop::mail.order', $vars, function($message) use ($vars, $time) {
          $message->to($vars["user_email"], 'Admin Person');
          $message->subject('Заказ - '. $time);
        });
      };

      if ($request->get('user_payment') == 0) { //online
        $products = $this->createProductArray($request->get('products'));
        $client = new Client();
        $client->setAuth(env('SHOP_ID'), env('KASSA_KEY')); // keys
        $payment = $client->createPayment(
          [
            'amount' => [
              'value' => $total.'.00',
              'currency' => 'RUB',
            ],
            'confirmation' => [
              'type' => 'redirect',
              'return_url' => env('MIX_URL').'/success-order?id='.$time,
            ],
            'receipt' => [
              'customer' => [
                'full_name' => $request->get('user_name'),
                'phone' => $request->get('user_phone'),
              ],
              'items' => $products,
            ],
          ],
          uniqid('', true)
        );
        //вставка в базу данных
        $this->insertData($request, $payment['_id'], $time, $total, $promocode);
        return response()->json(['status' => 'redirect', 'message' => $payment->getConfirmation()->getConfirmationUrl()]);

      } else {
        $this->insertData($request, null, $time, $total, $promocode);
        return response()->json(
          [
            'status' => 'success',
            'message' => 'Спасибо за ваш заказ, вскоре мы с вами свяжемся!',
            'id' => $time
          ]);
      }

    }
  }

  public function send(Request $request)
  {

    $rules = [
      'user_name'  => 'required|min:4|max:50',
      'user_phone' => 'required|min:11|max:50',
      'user_subject' => 'required|min:11|max:50',
      'user_email'  => 'email',
      'user_message' => 'max:500',
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
      $this->insertDemand($request);
      Mail::send('acme.shop::mail.request', $request->all(), function($message) {
        $message->to($this->getUserMail(), 'Admin Person');
        $message->subject('E-mail');
      });

      return response()->json(['status' => 'success', 'message' => 'Сообщение отправлено!']);
    }
  }

  public function getUserMail()
  {
    return User::where('is_superuser', 1)->value('email');
  }

  public function getPayStatus($order_id)
  {
    $client = new Client();
    $client->setAuth(env('SHOP_ID'), env('KASSA_KEY')); // keys

    try {
        $response = $client->getPaymentInfo($order_id);
    } catch (\Exception $e) {
        $response = $e;
    }

    dd($response);
  }

  private function insertData($request, $u_id, $time, $total, $promocode) {

    $order = new Order;
    $order->name = $time;
    $order->ip = $_SERVER['REMOTE_ADDR'];
    $order->status = 'new';
    $order->user_name = $request->get('user_name');
    $order->user_phone = $request->get('user_phone');
    $order->user_mail = $request->get('user_email');
    $order->user_address = $request->get('user_address');
    $order->user_comment = $request->get('user_comment');
    $order->products = $request->get('products');
    $order->user_payment = $request->get('user_payment');
    $order->user_id = $request->get('user_id');
    $order->total = $total;

    if($this->hasProp($u_id)) {
      $order->order_id = $u_id;
    }

    if($this->hasProp($promocode)) {
      $order->promocode = $promocode->id;
    }

    $query = $order->save();
    return $query;
  }

  private function createProductArray($products) {
    $result = [];
    foreach($products as $product) {
      $price = $product['price'].'.00';
      if (isset($product['sale_price']) && !empty($product['sale_price'])) {
        $price = $product['sale_price'].'.00';
      }
      $result[] = [
        'description' => $product['title'],
        'quantity' => $product['amount'],
        'vat_code' => '2',
        'amount' => [
          'value' => $price,
          'currency' => 'RUB'
        ],
        'payment_mode' => 'full_prepayment',
        'payment_subject' => 'commodity',
      ];
    };
    return $result;
  }

  private function insertDemand($request) {

    $data = new Demand;
    $data->user_name = $request->get('user_name');
    $data->user_phone = $request->get('user_phone');
    $data->user_mail = $request->get('user_email');
    $data->user_subject = $request->get('user_subject');
    $data->user_message = $request->get('user_message');

    $query = $data->save();
    return $query;
  }

  private function hasProp($prop) {
    return isset($prop) && !empty($prop);
  }

  private function checkPromocode($id, $condition) {
    return Promocode::where([['id', $id], ['condition', '<=', $condition], ['is_active', 1]])->first();
  }
}
