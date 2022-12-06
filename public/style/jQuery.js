$(document).ready(function () {
  $(".myNavLink").each(function () {
    if (this.href == window.location.href) {
      $(this).addClass("active fw-bold");
    }
  });
});

function addToWishlist(productId) {
  $.ajax({
    url: "/add/wishlist/" + productId,
    method: "post",
    success: (response) => {
      if (response) {
        $("#productCard").load(location.href + " #productCard>*", "");
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });

        Toast.fire({
          icon: "success",
          title: "Product added to wishlist!",
        });
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
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });
        Toast.fire({
          icon: "warning",
          title: "Product removed from wishlist!",
        });
      } else {
        Swal.fire("Changes are not saved", "", "info");
      }
    },
  });
}

function removeFromCart(productId, productQty) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      title: "Are you sure?",
      text: "Your product will be removed from the cart!!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          url: "/remove/cart/" + productId + "/" + productQty,
          method: "post",
          success: (response) => {
            if (response) {
              $("#productCard").load(location.href + " #productCard>*", "");
              swalWithBootstrapButtons.fire(
                "removed!",
                "Product removed from cart.",
                "success"
              );
            } else {
              swalWithBootstrapButtons.fire(
                "Error",
                "Something went wrong",
                "error"
              );
            }
          },
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire(
          "Cancelled",
          "Your product is still safe in the cart :)",
          "error"
        );
      }
    });
}

function addToCart(productId) {
  $.ajax({
    url: "/add/cart/" + productId,
    method: "post",
    success: (response) => {
      if (response) {
        $("#productCard").load(location.href + " #productCard>*", "");
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });
        Toast.fire({
          icon: "success",
          title: "Product added to cart!",
        });
      } else {
        swalWithBootstrapButtons.fire("Error", "Something went wrong", "error");
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
        swalWithBootstrapButtons.fire("Error", "Something went wrong", "error");
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
        swalWithBootstrapButtons.fire("Error", "Something went wrong", "error");
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

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      title: "Continue With Order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Continue!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          url: "/checkout/confirm",
          method: "post",
          data: {
            payment_method,
          },
          success: (response) => {
            if (response.codSuccess) {
              console.log("response.status => " + response.codSuccess);
              window.location.href =
                "/order_success/" +
                payment_method +
                "/" +
                addressId +
                "/" +
                couponId;
            } else {
              razorpayPayment(response);
            }
          },
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire(
          "Cancelled",
          "You canceled the order",
          "error"
        );
      }
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
          swalWithBootstrapButtons.fire(
            "Error",
            "Something went wrong",
            "error"
          );
        }
      },
    });
  }
  var rzp1 = new Razorpay(options);
  rzp1.open();
}

function user_cancel_order(itemId, orderId) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel this order!",
      cancelButtonText: "No, don't cancel!",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          url: "/user_cancel_order/" + itemId + "/" + orderId,
          method: "post",
          success: (response) => {
            if (response) {
              $("#myOrders").load(location.href + " #myOrders>*");
              swalWithBootstrapButtons.fire(
                "Canceled!",
                "Your order has been canceled.",
                "success"
              );
            } else {
              swalWithBootstrapButtons.fire(
                "Error",
                "Something went wrong",
                "error"
              );
            }
          },
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire(
          "Didn't canceled",
          "Your order is safe :)",
          "error"
        );
      }
    });
}

function apply_coupon() {
  let couponId = document.getElementById("coupon").value;
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          url: "/apply_coupon",
          method: "post",
          data: {
            couponId,
          },
          success: (response) => {
            if (response) {
              $("#checkoutCouponApplied").load(
                location.href + " #checkoutCouponApplied>*"
              );
              swalWithBootstrapButtons.fire(
                "Success!",
                "Coupon applied successfully",
                "success"
              );
            } else {
              swalWithBootstrapButtons.fire(
                "Error",
                "Something went wrong",
                "error"
              );
            }
          },
        });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          "Cancelled",
          "Apply coupon failed",
          "error"
        );
      }
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
        swalWithBootstrapButtons.fire("Error", "Something went wrong", "error");
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
        swalWithBootstrapButtons.fire("Error", "Something went wrong", "error");
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
        swalWithBootstrapButtons.fire("Error", "Something went wrong", "error");
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
        swalWithBootstrapButtons.fire("Error", "Something went wrong", "error");
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
        swalWithBootstrapButtons.fire("Error", "Something went wrong", "error");
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
        swalWithBootstrapButtons.fire("Error", "Something went wrong", "error");
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
        swalWithBootstrapButtons.fire("Error", "Something went wrong", "error");
      }
    },
  });
}
