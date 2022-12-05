$(document).ready(function () {
  $(".myNavLink").each(function () {
    if (this.href == window.location.href) {
      $(this).addClass("active fw-bold");
    }
  });
});
$(document).ready(function () {
  if (window.location.href == "http://localhost:8000/search") {
    $(this).addClass("active fw-bold");
  }
});

function addToWishlist(productId) {
  $.ajax({
    url: "/add/wishlist/" + productId,
    method: "post",
    success: (response) => {
      if (response) {
        $("#productCard").load(location.href + " #productCard>*", "");
      } else {
        alert("something went wrong");
        console.log("not added");
      }
    },
  });
}

function removeFromWishlist(productId) {
  $.ajax({
    url: "/remove/wishlist/" + productId,
    method: "post",
    beforeSend: function () {
      return confirm("Press OK to remove item from wishlist");
    },
    success: (response) => {
      if (response) {
        $("#productCard").load(location.href + " #productCard>*", "");
      } else {
        alert("something went wrong");
        console.log("not removed");
      }
    },
  });
}

function removeFromCart(productId, productQty) {
  $.ajax({
    url: "/remove/cart/" + productId + "/" + productQty,
    method: "post",
    beforeSend: function () {
      return confirm(
        "Press OK to remove the item from cart. Note: if you applied any coupon, it will be removed."
      );
    },
    success: (response) => {
      if (response) {
        $("#productCard").load(location.href + " #productCard>*", "");
      } else {
        alert("something went wrong");
        console.log("not removed");
      }
    },
  });
}

function addToCart(productId) {
  $.ajax({
    url: "/add/cart/" + productId,
    method: "post",
    success: (response) => {
      if (response) {
        $("#productCard").load(location.href + " #productCard>*", "");
      } else {
        alert("something went wrong");
        console.log("not added");
      }
    },
  });
}

function increasePriceByQty(productId) {
  $.ajax({
    url: "/increment/qty/cart/" + productId,
    method: "post",
    success: (response) => {
      if (response) {
        $("#productCard").load(location.href + " #productCard>*", "");
      } else {
        alert("something went wrong");
        console.log("not added");
      }
    },
  });
}

function decreasePriceByQty(productId) {
  $.ajax({
    url: "/decrement/qty/cart/" + productId,
    method: "post",
    success: (response) => {
      if (response) {
        $("#productCard").load(location.href + " #productCard>*", "");
      } else {
        alert("something went wrong");
        console.log("not added");
      }
    },
  });
}

function placeOrder() {
  let payment_method = document.getElementById("cod").checked
    ? "cash_on_delivery"
    : "razerpay";
  let addressId = document.getElementById("address").value;
  let couponId = document.getElementById("coupon").value;
  $.ajax({
    url: "/checkout/confirm",
    method: "post",
    data: {
      payment_method,
    },
    beforeSend: function () {
      return confirm("Press OK to continue with the order");
    },
    success: (response) => {
      if (response.codSuccess) {
        console.log("response.status => " + response.codSuccess);
        window.location.href =
          "/order_success/" + payment_method + "/" + addressId + "/" + couponId;
      } else {
        razorpayPayment(response);
      }
    },
  });
}

function razorpayPayment(order) {
  console.log("orderId from jQuery " + order.order.id);
  var options = {
    key: "rzp_test_g5EMovE0Fdz2IM", // Enter the Key ID generated from the Dashboard
    amount: order.order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: "INR",
    name: "t-Ravel",
    description: "Test Transaction",
    image: "",
    order_id: order.order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    // callback_url: "https://eneqd3r9zrjok.x.pipedream.net/",
    handler: function (response) {
      verifyPayment(response, order);
    },
    prefill: {
      name: "t-Ravels",
      email: "gaurav.kumar@example.com",
      contact: "9999999999",
    },
    notes: {
      address: "Razorpay Corporate Office",
    },
    theme: {
      color: "#3399cc",
    },
  };
  function verifyPayment(payment, order) {
    let payment_method = document.getElementById("cod").checked
      ? "cash_on_delivery"
      : "razerpay";
    let addressId = document.getElementById("address").value;
    let couponId = document.getElementById("coupon").value;
    $.ajax({
      url: "/verify_payment",
      data: {
        payment,
        order,
      },
      method: "post",
      success: (response) => {
        if (response.status) {
          window.location.href =
            "/order_success/" +
            payment_method +
            "/" +
            addressId +
            "/" +
            couponId;
        } else {
          alert("payment failed");
        }
      },
    });
  }
  var rzp1 = new Razorpay(options);
  rzp1.open();
}

function user_cancel_order(itemId, orderId) {
  $.ajax({
    url: "/user_cancel_order/" + itemId + "/" + orderId,
    method: "post",
    beforeSend: function () {
      return confirm("Press OK to Cancel the order");
    },
    success: (response) => {
      if (response) {
        $("#myOrders").load(location.href + " #myOrders>*");
      } else {
        alert("something went wrong");
        console.log("not changed");
      }
    },
  });
}

function apply_coupon() {
  let couponId = document.getElementById("coupon").value;
  $.ajax({
    url: "/apply_coupon",
    method: "post",
    data: {
      couponId,
    },
    beforeSend: function () {
      if (couponId != "Check coupons") {
        return confirm("Press OK to apply the coupon");
      } else {
        return confirm("No coupon selected!!");
      }
    },
    success: (response) => {
      if (response) {
        $("#checkoutCouponApplied").load(
          location.href + " #checkoutCouponApplied>*"
        );
      } else {
        alert("something went wrong");
        console.log("not changed");
      }
    },
  });
}

// Admin side

function edit_order_status(itemId, orderId, status) {
  $.ajax({
    url: "/admin/orders/update_status/" + itemId + "/" + orderId + "/" + status,
    method: "post",
    beforeSend: function () {
      return confirm("Press OK to change order status");
    },
    success: (response) => {
      if (response) {
        $("#productsTable").load(location.href + " #productsTable>*");
      } else {
        alert("something went wrong");
        console.log("not changed");
      }
    },
  });
}

function delete_banner(bannerId) {
  $.ajax({
    url: "/admin/banner/delete/" + bannerId,
    method: "get",
    beforeSend: function () {
      return confirm("Press OK to delete this banner");
    },
    success: (response) => {
      if (response) {
        $("#bannerTable").load(location.href + " #bannerTable>*", "");
      } else {
        alert("something went wrong");
        console.log("not deleted");
      }
    },
  });
}

function restore_banner(bannerId) {
  $.ajax({
    url: "/admin/banner/restore/" + bannerId,
    method: "get",
    beforeSend: function () {
      return confirm("Press OK to restore this banner");
    },
    success: (response) => {
      if (response) {
        $("#bannerTable").load(location.href + " #bannerTable>*", "");
      } else {
        alert("something went wrong");
        console.log("not resored");
      }
    },
  });
}

function delete_product(prodId) {
  $.ajax({
    url: "/admin/product/delete/" + prodId,
    method: "get",
    beforeSend: function () {
      return confirm("Press OK to restore this banner");
    },
    success: (response) => {
      if (response) {
        $("#adminProd").load(location.href + " #adminProd>*", "");
      } else {
        alert("something went wrong");
        console.log("not deleted");
      }
    },
  });
}

function restore_product(prodId) {
  $.ajax({
    url: "/admin/product/restore/" + prodId,
    method: "get",
    beforeSend: function () {
      return confirm("Press OK to restore this banner");
    },
    success: (response) => {
      if (response) {
        $("#adminProd").load(location.href + " #adminProd>*", "");
      } else {
        alert("something went wrong");
        console.log("not restored");
      }
    },
  });
}

function disable_coupon(couponId) {
  $.ajax({
    url: "/admin/coupon/disable/" + couponId,
    method: "get",
    beforeSend: function () {
      return confirm("Press OK to disable this banner");
    },
    success: (response) => {
      if (response) {
        $("#adminCoupon").load(location.href + " #adminCoupon>*", "");
      } else {
        alert("something went wrong");
        console.log("not disabled");
      }
    },
  });
}

function enable_coupon(couponId) {
  $.ajax({
    url: "/admin/coupon/enable/" + couponId,
    method: "get",
    beforeSend: function () {
      return confirm("Press OK to enable this banner");
    },
    success: (response) => {
      if (response) {
        $("#adminCoupon").load(location.href + " #adminCoupon>*", "");
      } else {
        alert("something went wrong");
        console.log("not enabled");
      }
    },
  });
}
