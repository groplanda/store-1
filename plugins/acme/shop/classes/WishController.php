<?php

namespace Acme\Shop\Classes;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Validator;
use Acme\Shop\Models\Wish;
use Acme\Shop\Models\Product;

class WishController extends Controller {

  public function wish(Request $request) {
    $rules = [
      'product_id' => 'required',
      'user_id'    => 'required'
    ];
    $validator = Validator::make($request->all(), $rules);

    if ($validator->fails()) {
      return;
    }
    $user_id = $request->get('user_id');
    $product_id = $request->get('product_id');

    $wish = Wish::where('user_id', $user_id)->first();

    if (!$wish) {
      $this->saveWish([$product_id], $user_id);
      return response()->json((['message' => 'Товар добавлен в избранное']), 200);
    }
    $products = $wish->products;

    if (is_array($products)) {
      $searchIndex = array_search($product_id, $products);
      if ($searchIndex === false) {
        array_push($products, $product_id);
        $message = 'Товар добавлен в избранное';
      } else {
        array_splice($products, $searchIndex, 1);
        $message = 'Товар убран из избранного';
      }
    } else {
      $products = [$product_id];
      $message = 'Товар добавлен в избранное';
    }
    Wish::where('user_id', $user_id)->update(['products'=> json_encode($products)]);
    return response()->json((['message' => $message]), 200);
  }

  public function wishlist($user) {
    $query = Wish::where('user_id', $user)->select(['products'])->first();

    if (!$query || !$query->products) {
      return null;
    }

    $id_array = $query->products;
    if (count($id_array) > 0) {
      return Product::select('id','title','image','price','sale_price')->whereIn('id', $id_array)->with(['options'])->get();
    }
  }

  public function wishcount($user) {
    $query = Wish::where('user_id', $user)->select(['products'])->first();
    if ($query && is_array($query->products)) {
      return response()->json(count($query->products), 200);
    }
  }

  private function saveWish($products, $user_id) {
    $wish = new Wish;
    $wish->products = $products;
    $wish->user_id = $user_id;
    $wish->save();
  }
}