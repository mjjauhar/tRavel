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
    url: "/remove/cart/" + productId +"/"+ productQty,
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
    url: "/increment/qty/cart/" + productId +"/"+ productPrice,
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
    url: "/decrement/qty/cart/" + productId +"/"+ productPrice,
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
