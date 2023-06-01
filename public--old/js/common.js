

//meal section multi select
$('#topping_ids, #key_ids, #dietary_ids, #like_ids').select2({
	placeholder: "Select your choices",
});

//meal add page multiple field
$(document).ready(function () {
	
	$(".allownumericwithoutdecimal").on("keypress keyup blur",function (event) {    
        $(this).val($(this).val().replace(/[^\d].+/, ""));
         if ((event.which < 48 || event.which > 57)) {
             event.preventDefault();
         }
     });
    // Allow only decimal number //
	$('.allownumericwithdecimal').on('input', function() {		
		this.value = this.value
		.replace(/[^\d.]/g, '')             // numbers and decimals only
		//.replace(/(^[\d]{2})[\d]/g, '$1')   // not more than 2 digits at the beginning
		.replace(/(\..*)\./g, '$1')         // decimal can't exist more than once
		.replace(/(\.[\d]{2})./g, '$1');    // not more than 4 digits after decimal
	});

	


	var selectedRadio = $('input[name="radiouser"]:checked').val(); //alert(selectedRadio)
	//getMealsByMealType($('#mealtype_id').val());
	if (selectedRadio == "customer") {
		$('#user_id').rules('add', { required: true, messages: { required: "Please select customer" } });
		//$('#guest_email').rules('remove');
	}

	var maxField = 10; //Input fields increment limitation
	var addButton = $('.add_button'); //Add button selector
	var wrapper = $('.field_wrapper'); //Input field wrapper
	var x = 1; //Initial field counter is 1

	//Once add button is clicked
	$(addButton).click(function () {
		var fieldHTML = '<div><div class="form-group row col-lg-12"><label>Heading:</label><input type="text" name="heading[]" class="form-control" placeholder="Enter Title" value=""/></div><div class="form-group row col-lg-12"><label>Description:</label><textarea name="desc[]" id="content' + x + '" class="ckeditor form-control" placeholder="Enter Description"></textarea></div><a href="javascript:void(0);" class="remove_button">Remove</a></div>';
		//New input field html 
		//Check maximum number of input fields
		if (x < maxField) {
			$(wrapper).append(fieldHTML); //Add field html
			// CKEDITOR.replace('content', {
			//     toolbar: 'Basic'
			// });
			CKEDITOR.replace('content' + x, {});
			x++; //Increment field counter
		}
	});

	//Once remove button is clicked
	$(wrapper).on('click', '.remove_button', function (e) {
		e.preventDefault();
		$(this).parent('div').remove(); //Remove field html
		x--; //Decrement field counter
	});

	$('#user_id').select2({
		placeholder: "Select a user"
	});

	$('#package_id').select2({
		placeholder: "Select a package"
	});

	$('#plan_id').change(function () {
		$('#buildCustomPackageContainer').html('')
		$('#fillPackageContainer').html('')
	});





});

$(document).on("change", ".radiouserClass", function () {
	//	alert($(this).val())
	//$(".radiouserClass").change(function() { alert("xca")
	if ($(this).val() == "guest") {
		$('#userHolder').css('display', 'none');
		$('#user_id').prop('selected', false);
		$('#guestUserHolder').css('display', 'block');
		//$('#guest_email').rules('add', {required: true,messages: {required: "Please select guest email" }});
		$('#user_id').rules('remove');
	}
	if ($(this).val() == "customer") {
		$('#guestUserHolder').css('display', 'none');
		$('#guest_email').val('');
		$('#userHolder').css('display', 'block');
		$('.select2-container').css('width', '544.5px');
		$('#user_id').rules('add', { required: true, messages: { required: "Please select customer" } });
		//$('#guest_email').rules('remove');
	}
});

$('.close_btn_pic').click(function (e) {
	$(this).parent('div').remove();
});

$('.confirmation').on('click', function () {
	var result = confirm('Are you sure?');
	$(".privoiusorders").remove();
	if (result === true) {
		$('#change_default').val("yes");
		$('#fillPackageContainer').css('display', 'block');
		$('.buttonselect').prop('disabled', true);
		var seletedPlanMeal = $("#plan_id option:selected").attr('data-attr'); //alert(seletedPlanMeal)
		var resultTotal = countItem(); //alert(resultTotal)

		if (resultTotal == seletedPlanMeal) {
			$(".quantity").find('.plus').attr("disabled", true);
		}
		else if (resultTotal < seletedPlanMeal && resultTotal > 0) {
			$(".quantity").find('.plus').attr("disabled", false);
			$(".quantity").find('.plus').attr('onclick', 'addItem(' + parseInt(minval) + ',' + parseInt(maxval) + ',"' + pfrom + '","' + cid + '");');
			$('.quantity .plus[onclick*="addItem"]').attr('onclick');
		}
	}
	else {
		return false;
	}
});

$('.confirmationbp').on('click', function () {
	var result = confirm('Are you sure?');
	$(".privoiusorders").remove();
	if (result === true) {
		$('#change_default').val("yes");
		$('#buildCustomPackageContainer').css('display', 'block');
		$('.buttonselect').prop('disabled', true);
		$('#plan_id').prop('disabled', false);

		var mealtype_id = $('#mealtype_id').val();
		getMealsByMealType(mealtype_id);
	}
	else {
		return false;
	}
});

$('.removecpdiv').on('click', function () {
	$('#change_default').val("no");
	$('.buttonselect').prop('disabled', false);
	$('#buildCustomPackageContainer').css('display', 'none');
});

$('.removebsdiv').on('click', function () {
	$('#change_default').val("no");
	$('.buttonselect').prop('disabled', false);
	$('#fillPackageContainer').css('display', 'none');
});


$('.hitorder').click(function (e) {
	e.preventDefault();
	$("#quantity-error").remove();
	//$('#user_id').rules('add', { required: true });
	/* quantity */
	var strQty = $('#orderQuantity').val();
	var lastCharQty = strQty.slice(-1);
	if (lastCharQty == ',') {
		strQty = strQty.slice(0, -1);
	}
	document.getElementById('orderQuantity').value = strQty;
	/* quantity */

	/* price */
	var strPrice = $('#orderMealPrice').val();
	var lastCharPrice = strPrice.slice(-1);
	if (lastCharPrice == ',') {
		strPrice = strPrice.slice(0, -1);
	}
	document.getElementById('orderMealPrice').value = strPrice;
	/* price */

	/* meal_id */
	var strmealId = $('#orderMealId').val();
	var lastCharMid = strmealId.slice(-1);
	if (lastCharMid == ',') {
		strmealId = strmealId.slice(0, -1);
	}
	document.getElementById('orderMealId').value = strmealId;
	/* meal_id */
	//$('#CreateOrder').submit();
});

function deleteMealImage(image) {
	var result = confirm("Are you sure to delete?");
	if (result) {
		var apiBaseURL = `${window.location.origin}`;
		var id = $("#mid").val(); // value in field email
		// alert('id' + ' ' + id);
		$.ajax({
			type: 'post',
			url: apiBaseURL + "/delete-meal-images", // put your real file name 
			data: {
				id: id,
				image: image
			},
			success: function (msg) {
				// if (msg) {
				//     document.getElementById('imgMsg').style.display = 'block';
				// } else {
				//     document.getElementById('imgMsg').style.display = 'none';
				// }
			}
		});
	} else {
		$('.widget31__pic_outer').show();
		//return false;
	}
}

function getOrderId(status) {
	var apiBaseURL = `${window.location.origin}`;
	var id = $("#orderid").val(); // value in field email
	var nextOrderStatus = $("#next_order_status").val(); // value in field email

	$.ajax({
		type: 'post',
		url: apiBaseURL + "/orders/completed", // put your real file name 
		data: {
			id: id,
			status: status,
			next_order_status: nextOrderStatus
		},

		success: function (msg) {
			if (msg) {
				toastr.success('Order status has been updated.', 'Success!', {
					positionClass: 'toast-top-right'
				});
			}
		}
	});
}


function getPlansByPackage(pkg_id) {
	var apiBaseURL = `${window.location.origin}`;

	$.ajax({
		type: 'get',
		url: apiBaseURL + "/plan/by/package/" + pkg_id, // put your real file name 

		success: function (result) {
			var html = "<option value=''>Select</option>";
			if (result.data.length > 0) {
				$.each(result.data, function (index, val) {
					html += "<option value=" + val._id + " data-attr=" + val.box + ">" + val.box + " meals at $" + val.price + "</option>"
					$('#plan_id').html(html);
					$('.plan_id').html(html);
				});

			} else {
				$('#plan_id').html(html);
				$('.plan_id').html(html);
			}
		}
	});
}

function showMealSelectionDiv(val) {
	if (val != '') {
		$("#secMealSelection").css({ "display": "block" });
	}
	else {
		$("#secMealSelection").css({ "display": "none" });
	}
}

function removeItem(rowId, sendfrom) {
	var thisId = rowId;
	var currentItem = parseInt($('#row_' + thisId).find('.qtycount').val()); //alert("currentItem>>158>>"+currentItem);
	var seletedPlanMeal = $("#plan_id option:selected").attr('data-attr'); //alert("seletedPlanMeal>>159>>"+seletedPlanMeal);
	if (currentItem == 1 && sendfrom == "bs") {
		$('#row_' + thisId).remove();
		var sum = 0;
		$(".quantity").each(function () {
			sum = sum + parseInt($('.qtycount').val());
		});
		//alert("sum>>"+sum)
		$('.itemcount').find('span').text(sum + '/' + seletedPlanMeal);
		$(".quantity").find('.plus').attr("disabled", false);
		$('.buttonselect').prop('disabled', true);
	}

	else {
		var removedItem = currentItem - 1; //alert("removedItem>>"+removedItem)
		$('#row_' + thisId).find('.qty').val(removedItem);
		$('#row_' + thisId).find('#qtycount_' + thisId).val(removedItem);
		if ($('#row_' + thisId).find('.qty').val() == 0 || $('#row_' + thisId).find('#qtycount_' + thisId).val() == 0) {
			$('#row_' + thisId).find('.minus').css('display', 'none');
		}
		setTimeout(function () {
			//	alert(sendfrom)
			var result = countDownItem(rowId, sendfrom); //alert("result>>174>>" + result)
			$("#already_added").val(result);
			if (result >= seletedPlanMeal) {  //alert("aaa");
				$(".quantity").find('.plus').attr("disabled", true);
				$('.buttonselect').prop('disabled', false);
			}
			else if (result < seletedPlanMeal && result > 0) { //alert("bbb");
				$('.itemcount').find('span').text(result + '/' + seletedPlanMeal);
				$(".quantity").find('.plus').attr("disabled", false);
				$('.buttonselect').prop('disabled', true);
			}
			else if (result == 0) { //alert('ccc');
				$('.itemcount').find('span').text(result + '/' + seletedPlanMeal);

			}
		}, 500);
	}
}

function addItem(rowId, sendfrom) {
	var thisId = rowId;
	var currentItem = parseInt($('#row_' + thisId).find('.qtycount').val()); //alert("currentItem>>"+currentItem);
	//console.log(currentItem);
	if (currentItem <= parseInt($("#plan_id option:selected").attr('data-attr')) - 1) {
		var addedItem = currentItem + 1; //alert("addedItem>>"+addedItem);
	}
	else {
		return false;
	}
	var seletedPlanMeal = $("#plan_id option:selected").attr('data-attr');  //alert("seletedPlanMeal>>"+seletedPlanMeal);
	$('#row_' + thisId).find('.qty').val(addedItem);
	$('#row_' + thisId).find('#qtycount_' + thisId).val(addedItem);
	var arr = [];
	if (sendfrom == "cp") {
		let getQuantity = $('#row_' + thisId).find('#qtycount_' + thisId).val(); //alert("getQuantity>>"+getQuantity);
		let getmealPrice = $('#row_' + thisId).find('#mprice_' + thisId).val(); //alert("getmealPrice>>"+getmealPrice);
		let getMealId = $('#row_' + thisId).find('#meal_' + thisId).val(); //alert("getMealId>>"+getMealId)

		document.getElementById('orderQuantity').value += getQuantity + ",";
		document.getElementById('orderMealId').value += getMealId + ",";
		document.getElementById('orderMealPrice').value += getmealPrice + ",";
	}

	//	setTimeout(function () {
	var result = countItem(rowId, sendfrom); //alert("result>>"+result);
	if (result == seletedPlanMeal) { //alert("seletedPlanMeal>>"+seletedPlanMeal);
		if (sendfrom == "cp") {
			$("#already_added").val(result);
			$(".column").find('.plus').attr("disabled", true);
			$('.buttonselect').attr('disabled', false);
			//alert("You have already selected the required meal!")
		}
		else {
			$(".quantity").find('.plus').attr("disabled", true);
			$('.buttonselect').attr('disabled', false);
			alert("You have already selected the required meal!")
		}
	}
	else if (result < seletedPlanMeal && result > 0) {
		if (sendfrom == "cp") {
			$("#already_added").val(result);
			$('#row_' + thisId).find('.minus').css('display', 'inline-block');
			let quantity = $('#row_' + thisId).find('#qtycount_' + thisId).val(); //alert(quantity);
			let price = $('#row_' + thisId).find('#mprice_' + thisId).val(); //alert(price);
			let mid = $('#row_' + thisId).find('#meal_' + thisId).val(); //alert(mid);
		}
		$('.itemcount').find('span').text(result + '/' + seletedPlanMeal);
	}
	//	}, 500);
}

function countItem(rId, sendfrom) {
	var seletedPlanMeal = $("#plan_id option:selected").attr('data-attr'); //alert(seletedPlanMeal);
	if (sendfrom == "cp") {
		var alreadtAddedItem = parseInt($("#already_added").val());  //alert("alreadtAddedItem>>"+alreadtAddedItem);
		if (alreadtAddedItem < seletedPlanMeal) {
			var sum = 0;
			sum = parseInt(sum) + 1;
			var total = parseInt(sum) + parseInt(alreadtAddedItem); //alert("total>>"+total);
		}
		//	alert("total" + total)
		if (alreadtAddedItem == seletedPlanMeal) {
			$('.itemcount').find('span').text(total + '/' + seletedPlanMeal);
			$(".column").find('.plus').attr("disabled", true);
			var total = seletedPlanMeal;
			$('.buttonselect').attr('disabled', false);
			alert("You have already selected the required meal1!")
		}
		if (total == seletedPlanMeal) {
			$('.itemcount').find('span').text(total + '/' + seletedPlanMeal);
			$(".column").find('.plus').attr("disabled", true);
			$('.buttonselect').attr('disabled', false);
			//$(".quantity").find('.plus').attr("disabled", true );
			//	alert("You have already selected the required meal2!")
			//return false;
		}
		else if (total < seletedPlanMeal && total > 0) {
			$('.itemcount').find('span').text(total + '/' + seletedPlanMeal);
		}
		return total;
	}
	else {
		var sum = 0;
		$(".qtycount").each(function () {
			var nowval = $(this).val();
			sum = sum + parseInt(nowval);
		});
		if (sum >= seletedPlanMeal) {
			$('.itemcount').find('span').text(sum + '/' + seletedPlanMeal);
			$(".quantity").find('.plus').attr("disabled", true);
			$('.buttonselect').attr('disabled', false);
			return false;
		}
		else if (sum < seletedPlanMeal && sum > 0) {
			$('.itemcount').find('span').text(sum + '/' + seletedPlanMeal);
		}
		return sum;
	}
}

function countDownItem(rId, sendfrom) {
	var seletedPlanMeal = $("#plan_id option:selected").attr('data-attr'); //alert(seletedPlanMeal);
	if (sendfrom == "cp") {
		var alreadtAddedItem = parseInt($("#already_added").val());  //alert("alreadtAddedItem>>"+alreadtAddedItem);
		if (alreadtAddedItem < seletedPlanMeal) {
			var sum = 0;
			sum = parseInt(sum) + 1;
			var total = parseInt(alreadtAddedItem) - parseInt(sum); //alert("total>>"+total);
		}
		else {
			var total = parseInt(seletedPlanMeal) - 1;
		}
		//	alert("total" + total)

		if (total < seletedPlanMeal && total > 0) {
			$('.itemcount').find('span').text(total + '/' + seletedPlanMeal);
		}
		return total;
	}
	else {
		var sum = 0;
		$(".qtycount").each(function () {
			var nowval = $(this).val();
			sum = sum + parseInt(nowval);
		});
		if (sum >= seletedPlanMeal) {
			$('.itemcount').find('span').text(sum + '/' + seletedPlanMeal);
			$(".quantity").find('.plus').attr("disabled", true);
			$('.buttonselect').attr('disabled', false);
			return false;
		}
		else if (sum < seletedPlanMeal && sum > 0) {
			$('.itemcount').find('span').text(sum + '/' + seletedPlanMeal);
		}
		return sum;
	}
}

function getBestSellerProducts() {
	$("#submitform").val("bs");
	$("#fillPackageContainer").css("display", "block");
	$("#buildCustomPackageContainer").css("display", "none");
	var seletedPlanMeal = $("#plan_id option:selected").attr('data-attr'); //alert(seletedPlanMeal);
	var apiBaseURL = `${window.location.origin}`;
	$.ajax({
		type: 'get',
		url: apiBaseURL + "/meals/get/bestsellers",
		success: function (result) {
			console.log(result);
			var html = '<section>';
			html += '<div class="pt-4 wish-list">';
			html += '<h5 class="mb-4 itemcount">Your Package (<span>' + result.data.length + '/' + seletedPlanMeal + '</span> items)</h5>';
			for (var i = 0; i < result.data.length; i++) {
				html += '<div id="row_' + result.data[i]._id + '" class="row mb-4 item">'
				html += '<div class="col-md-5 col-lg-3 col-xl-3">'
				html += '<div class="view zoom overlay z-depth-1 rounded mb-3 mb-md-0">'
				html += '<img src="/uploads/meal/thumb/' + result.data[i].meals.meal_images[0] + '" alt="Sample" height="50" width="50">'
				html += '</div>'
				html += '</div>';
				html += '<div class="col-md-7 col-lg-9 col-xl-9">';
				html += '<div>';
				html += '<div class="d-flex justify-content-between">';
				html += '<div>';
				html += '<h5>' + result.data[i].meals.title + '</h5>';
				html += '</div>';
				html += '<div>';
				html += '<div class="quantity buttons_added">';
				html += '<input type="button" value="-" class="minus" onClick=removeItem("' + result.data[i]._id + '","bs");><input type="number" step="1" min="1"  name="quantity" value="1" title="Qty" class="input-text qty text" size="4" pattern="" inputmode=""><input type="hidden" class="qtycount" id="qtycount_' + result.data[i]._id + '" name="qtycount" value="1"><input type="hidden" class="mprice" id="mprice_' + result.data[i]._id + '" name="meal_price" value="' + result.data[i].meals.price + '"><input type="hidden" class="mealid" id="meal_' + result.data[i]._id + '" name="meal_id" value="' + result.data[i].meals._id + '"><input type="button" value="+" class="plus" onClick=addItem("' + result.data[i]._id + '","bs");>';
				html += '</div>';
				html += '</div>';
				html += '</div>';
				html += '</div>';
				html += '</div>';
				html += '</div>';
			}
			html += '<hr class="mb-4">';
			html += '</div>';
			html += '</section>';

			$('#fillPackageContainer').html(html);
			$('#fillPackageContainer').fadeIn('slow').delay(3000);

			setTimeout(function () {
				var resultTotal = countItem();

				if (resultTotal == seletedPlanMeal) {
					$(".quantity").find('.plus').attr("disabled", true);
				}
				else if (resultTotal < seletedPlanMeal && resultTotal > 0) {
					$(".quantity").find('.plus').attr("disabled", false);
					//$(".quantity").find('.plus').attr('onclick','addItem('+parseInt(minval)+','+parseInt(maxval)+',"'+pfrom+'","'+cid+'");');
					//$('.quantity .plus[onclick*="addItem"]').attr('onclick');
				}
			}, 500);
		}
	});
}

function buildYourPackage() {
	$("#submitform").val("cp");
	$("#buildCustomPackageContainer").css("display", "block");
	$("#fillPackageContainer").css("display", "none");
	var seletedPlanMeal = $("#plan_id option:selected").attr('data-attr'); //alert(seletedPlanMeal)
	var apiBaseURL = `${window.location.origin}`;
	var url = apiBaseURL + "/meals/build/package";
	$.ajax({
		type: 'get',
		url: url, // put your real file name
		//dataType:"json",
		success: function (result) {
			$('#buildCustomPackageContainer').html(result);
			setTimeout(function () {
				$('.itemcount').find('span').text('0/' + seletedPlanMeal);
				var mId = $('#mealtype_id').val();
				getMealsByMealType(mId);
			}, 500);
		}
	});
}

function getMealsByMealType(mealTypeId) {
	var apiBaseURL = `${window.location.origin}`;
	var url = apiBaseURL + "/mealstype/" + mealTypeId;
	var seletedPlanMeal = $("#plan_id option:selected").attr('data-attr'); //alert(seletedPlanMeal)
	$.ajax({
		type: 'get',
		url: url,
		success: function (result) {
			$('#mealsConteiner').html(result);
			setTimeout(function () {
				var alreadtAddedItem = parseInt($("#already_added").val());
				//$(".column").find('.minus').attr("disabled", false );
				if (alreadtAddedItem == seletedPlanMeal) {
					$(".column").find('.plus').attr("disabled", true);
					alert("You have already selected the required meal!")
				}
				$(".column").find('.minus').css('display', 'none');
			}, 500);
		}
	});
}


$(function () {
	var dtToday = new Date();

	var month = dtToday.getMonth() + 1;
	var day = dtToday.getDate();
	var year = dtToday.getFullYear();

	if (month < 10)
		month = '0' + month.toString();
	if (day < 10)
		day = '0' + day.toString();

	var maxDate = year + '-' + month + '-' + day;
	$('#expiry_date').attr('min', maxDate);
});

function couponVerify() {
	var code = $('#coupon_code').val();
	var apiBaseURL = `${window.location.origin}`;
	$.ajax({
		type: 'post',
		url: apiBaseURL + "/verify-coupon", // put your real file name 
		data: {
			code: code
		},
		success: function (msg) {
			if (msg) {
				$('#coupon_code').val("");
				document.getElementById('coupon-message').style.display = 'block';
				return false;
			} else {
				document.getElementById('coupon-message').style.display = 'none';
			}
		}
	});
}

function couponVerify2(c) {
	var code = $('#coupon_code').val();
	if (c != code) {
		var apiBaseURL = `${window.location.origin}`;
		$.ajax({
			type: 'post',
			url: apiBaseURL + "/verify-coupon", // put your real file name 
			data: {
				code: code
			},
			success: function (msg) {
				if (msg) {
					$('#coupon_code').val(c);
					document.getElementById('coupon-message').style.display = 'block';
					return false;
				} else {
					document.getElementById('coupon-message').style.display = 'none';
				}
			}
		});
	}
}

$('#replyBtn').click(function () {

	$('#replyToCustomer').show('slow');
	$('html,body').animate({
		scrollTop: $("#replyToCustomer").offset().top
	}, 'slow');

});

$('#cancelBtn').click(function () {
	$('#replyToCustomer').hide('slow');
});

//add ingredients

$(function () {
	var i = 1;

	if ($("#editCurrentIndex").val()) {
		var i = $("#editCurrentIndex").val();
	}
	$("#addMore").click(function (e) {
		e.preventDefault();
		var unitIngredients = $(".unit-ingredients").html();
		var ingredientIngredients = $(".ingredient-ingredients").html();
		$("#fieldList").append(`<div class="row row-` + i + `">
		<div class="col-lg-2">
				<label>Quantity:</label>
				<input type="text" name="quantity[]" required  class="form-control"
						pattern="^[1-9].*" placeholder="Enter Quantity">
		</div>
		<div class="col-lg-2">
				`+ unitIngredients + `
		</select>
		</div>
		<div class="col-lg-3">
		`+ ingredientIngredients + `
		</select>
		</div>
		<div class="col-lg-3">
				<label>Preparation Steps:</label>
				<input type="text" name="preparation_style[]" required  class="form-control"
					 placeholder="Enter Preparation Steps">
		</div>
		<div class="col-lg-2">
    <button class="btn btn-danger" type="button" onclick="removeIn(`+ i + `)" style="margin-top: 24px;">Remove <i class="fas fa-trash"></i></button>
    </div>
</div>`);
		i++;
	});
});

function removeIn(index) {
	$('.row-' + index).remove();
}
//end

