let items, errors;
let spinner = $("#spinnderLi");
let card = $("#cardBody");
let errorLi = $("#errorLi");
let itemsUl = $("#itemsList");


$.ajax({
  url: "./items.js",

  success: (res) => {
    items = JSON.parse(res);
  },
  error: (err) => {
    errors = err;
  },
  complete: () => {
    loading();
  },
});
const loading = (elem) => {
  setTimeout(() => {
    renderRespons();
  }, 1000);
};

function renderRespons() {
  spinner.addClass("d-none");
  if (items) {
    // loading(card);
    for (let [key, item] of Object.entries(items)) {
      addingElementToTheView(item, key);
    }
  } else {
    errorLi.removeClass("d-none");
  }
}
// const importingData = async () => {
//   await import("../items.js")
//     .then(({ data }) => {
//       items = data;
//     })
//     .catch((err) => {
//       errors = err;
//     });


// ===========================================================================
// ========================================================== dragging section
$(function () {
  $(".draggable").draggable({ revert: "invalid" });
  $("#droppable").sortable();
  $("#droppable").droppable({
    drop: function (event, ui) {
      var dropped = ui.draggable;
      var droppedOn = $(this);
      dropped.draggable({ disabled: true });
      $(dropped).css({ top: 0, left: 0 }).appendTo(droppedOn);
      //get the price of dropped elment
      let id = dropped.find("#id").val();
      let price = +dropped.find(`#price_${id}`).text();
      //update total due
      updateTotals(price);
      //repeate it in item section in item
      itemsUl.append(ui.draggable.clone());
      //replace add to cart span
      replaceAddWithRemove(dropped, id);
      //add quantity btns
      addQtyMarks(dropped, id);
    },
  });
});
// ====================================================================================
// ========================================================== calclation functions
let total = 0;
function calculateQuantity(price, qty) {
  updateTotals(price* (qty-(qty-1)))
}
function updateTotals(amount) {
  total += +amount;
  console.log(+amount)
  if(total >  0){
    let tax = +calculateTax(total)
  
    $('#prices').text(total)
    $('#taxes').text(tax)
    let delivery = +$('#deliver').text()
    let coast =  tax+total+delivery;
   coast = (coast > 300)?applyDiscount(coast):coast;
    $('#totls').text(coast)
    $("#totals").text(coast);
  }else{
    $('#discount').addClass('d-none');
    $('#prices').text(0)
    $('#taxes').text(0)
    $('#totls').text(0)
    $("#totals").text(0);
  }

}
function calculateTax(num) {
  return (num*0.14).toFixed(2)
}
function applyDiscount(amountDue){
  $('#discount').removeClass('d-none');
  
  return (amountDue*0.30).toFixed(3)

}
// ===============================================================================
// ========================================================== event listener
itemsUl.on("click", ".addToCartDiv", (e) => {
  let that = e.target;
  //get id
  let id = $(that).closest(".addToCartDiv").attr("id");
  //get price
  let price = +$(that).parents().find(`#price_${id}`).text();
  updateTotals(price);
  ///
  let cloned = $(that).parents().find(`#cardBody_${id}`).clone();
  //add to order  section
  addToOrders($(that).parents().find(`#cardBody_${id}`));
  //repeate the item in items list
  itemsUl.append(cloned);
});

$("#droppable").on("click", ".removeFromCartDiv", (e) => {
  let that = e.target;

  //get id
  let id = $(that).closest(".removeFromCartDiv").attr("id");
  //get price
  let price = +$(that).parents().find(`#price_${id}`).first().text();
  //return it
  let ele = $("#droppable").find(`#cardBody_${id}`).remove();
 
  updateTotals(-price);
});

// $(".btn-number").click(function (e) {
$("#droppable").on("click", ".signBtn", (e) => {
  e.preventDefault();
  e.stopPropagation();
  let that = e.target;
  
  //plus or minus
  //note: closest cuz he could press on the i tag not alway the btn
  type = $(that).closest(".signBtn").attr("data-type");
  let id = $(that).closest(".qtySpan").attr("data-target");
  input = $("#droppable").find(`#item_${id}`);

  var currentVal = +input.val();
  if (!isNaN(currentVal)) {
    switch (type) {
      case "minus":
        //if it is > 1
        if (currentVal > input.attr("min")) {
          input.val(currentVal - 1).change();
        }
        //if it has reached 1
        if (parseInt(input.val()) == input.attr("min")) {
          $(this).attr("disabled", true);
        }
        break;
      case "plus":
        if (currentVal < input.attr("max")) {
          input.val(currentVal + 1).change();
        }
        if (parseInt(input.val()) == input.attr("max")) {
          $(this).attr("disabled", true);
        }
        break;
    }
  } else {
    input.val(0);
  }
});

$("#droppable").on("focusin", ".input-number", function (e) {
  $(this).data("oldValue", $(this).val()); //{ old-value: value-now }
});
$("#droppable").on("change", ".input-number", function (e) {
  e.stopPropagation();
  minValue = +$(this).attr("min");
  maxValue = +$(this).attr("max");
  valueCurrent = +$(this).val();

  let id = $(this).parent().find(".qtySpan").attr("data-target");
  let price = $("#droppable").find(`#price_${id}`).text();

  qty = $(this).attr("name");
  if (valueCurrent >= minValue) {
    $(".btn-number[data-type='minus'][data-field=' qty ']").removeAttr("disabled");
  } else {
    $(this).val($(this).data("oldValue"));
  }
  if (valueCurrent <= maxValue) {
    $(".btn-number[data-type='plus'][data-field=' qty ']").removeAttr("disabled");
  } else {
    $(this).val($(this).data("oldValue"));
  }
  calculateQuantity(price, +$(this).val());
});
// keyup
$("#droppable").on("keyup", ".input-number", function (e) {
  // Allow: backspace, delete, tab, escape, enter and .
  if (
    $.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
    // Allow: Ctrl+A
    (e.keyCode == 65 && e.ctrlKey === true) ||
    // Allow: home, end, left, right
    (e.keyCode >= 35 && e.keyCode <= 39)
  ) {
    // let it happen, don't do anything
    return;
  } else {
    $(this).change();
  }
});
// ====================================================================================
// ========================================================== adding/replace  structure
const replaceAddWithRemove = (ele, id) => {
  let target = ele.find(`div[id=${id}]`);

  let del = `<div class="col-md-2 d-flex justify-content-center align-items-center removeFromCartDiv"id=${id}>
<span class="removeFromCart">
<i class="fa-solid fa-trash-can  fa-xl"></i></span>
</div>`;
  target.replaceWith(del);
};

const addToOrders = (ele) => {
  $("#droppable").find("#holder").remove();
  $("#droppable").append(ele);
  let id = ele.find("#id").val();
  replaceAddWithRemove(ele, id);
  //add quantity btns
  addQtyMarks(ele, id);
};

const addingElementToTheView = (obj, index) => {
  let structure = `<li class="card list-group-item h-50 draggable " id="cardBody_${index}">
<div class=" " >
<input type="hidden" id="id" name="Id" value=${index}>
  <div class="row g-0">
    <div class="col-md-3 col-sm-3">
      <img src="./assets/${obj["photo"]}" id="photo_${index}" class="img-fluid rounded-start img-thumbnail" alt="..." />
    </div>
    <div class="col-md-7  col-sm-7 cardData">
      <div class="card-body p-1">
        <h5 class="card-title" id="name_${index}">${obj["name"]}</h5>
        <h6 class="card-subtitle mb-2 text-muted" id="type_${index}">${obj["type"]}</h6>
        <p class="card-text mb-1" id="description_${index}">${obj["description"]}.</p>
        <span class="badge alert-success">price: <span id="price_${index}">${obj["Price"]}</span> EG</span>
        <p class="card-text" id="qtySection_${index}"><small class="text-muted">Last updated 3 mins ago</small></p>
      </div>
    </div>
    <div class="col-md-2 d-flex justify-content-center align-items-center addToCartDiv"id=${index}>
      <span class="addToCart">
        <i class="fa-solid fa-cart-plus fa-xl"></i>
      </span>
    </div>
  </div>
</div>
</li>`;
  $(".draggable").draggable({
    revert: "invalid",
    stop: function () {
      $("#droppable").find("#holder").remove();
    },
  });
  itemsUl.append(structure);
};
const addQtyMarks = (ele, id) => {
  let target = ele.find(`#qtySection_${id}`);
  let marks = `<div class="input-group w-75 mt-1">
    <span class="input-group-btn qtySpan" data-target=${id}>
        <button type="button" class="btn btn-danger btn-number signBtn"  data-type="minus" data-field="qty">
          <span ><i class="fa-solid fa-minus"></i></span>
        </button>
    </span>
    <input type="text" name="qty" id="item_${id}" class="form-control input-number" value="1" min="1" max="20">
    <span class="input-group-btn qtySpan" data-target=${id}>
        <button type="button" class="btn btn-success btn-number signBtn" data-type="plus" data-field="qty">
            <span ><i class="fa-solid fa-plus"></i></span>
        </button>
    </span>
</div>`;
  target.replaceWith(marks);

  target.remove();

  // ele.append(marks);
};
