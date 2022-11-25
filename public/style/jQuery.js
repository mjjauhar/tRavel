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

function increasePriceByQty(productId, productPrice) {
  $.ajax({
    url: "/increment/qty/cart/" + productId + "/" + productPrice,
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

function decreasePriceByQty(productId, productPrice) {
  $.ajax({
    url: "/decrement/qty/cart/" + productId + "/" + productPrice,
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
  let payment_method = document.getElementById("cod").checked ? "cash_on_delivery" : "razerpay"
  let addressId = document.getElementById("address").value;
  $.ajax({
    url: "/checkout/confirm",
    method: "post",
    // data: $("#checkout-form").serialize(),
    data: {
      addressId,
      payment_method,
    },
    success: (response) => {
      if (response.codSuccess) {
        console.log("response.status => "+response.codSuccess);
        window.location.href = "/order_success";
      } else {
        razorpayPayment(response);
      }
    },
  });
};

function razorpayPayment(order) {
  var options = {
    key: "rzp_test_g5EMovE0Fdz2IM", // Enter the Key ID generated from the Dashboard
    amount: 1200, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
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
    $.ajax({
      url: "/verify-payment",
      data: {
        payment,
        order,
      },
      method: "post",
      success: (response) => {
        if (response.status) {
          location.href = "/order_success";
        } else {
          alert("payment failed");
        }
      },
    });
  }
  var rzp1 = new Razorpay(options);
  rzp1.open();
}
