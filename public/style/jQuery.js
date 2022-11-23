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

function placeOrder(index) {
  let num = parseInt(index);
  let paymentMethod = document.getElementById("cod").checked
    ? "COD"
    : "Razorpay";
  $.ajax({
    url: "/placeOrder",
    data: {
      index: num,
      paymentMethod: paymentMethod,
    },
    method: "post",
    success: (response) => {
      if (response.codSuccess) {
        location.href = "/orderSuccess";
      } else {
        razorpayPayment(response);
      }
    },
  });
}

function confirmCheckout(cartId) {
  $.ajax({
    url: "/checkout/confirm",
    method: "post",
    success: (response) => {
      if (response) {
        console.log("order success");
        window.location.href = "/order_success";
      } else {
        alert("something went wrong");
        console.log("order failed");
      }
    },
  });
}
