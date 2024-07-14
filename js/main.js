/// <reference types="../@types/jquery" />
let rowData = document.getElementById('rowData');
let searchContainer = document.getElementById('searchContainer');
let submitBtn;
// ==========================
$(function () {
    searchByName('').then(() => {
        $('.loading-screen').fadeOut(500)
        $('body').css('overflow', 'visible')
    })
});
$(".side-nav-menu i.open-close-icon").on('click', toggleSideNav());
$(".side-nav-menu .links li").on('click', function(){
    const text = $(this).text();
    if (text === "Search") {
        showSearchInputs();
    } else if (text === "Categories") {
        getCategories();
    } else if (text === "Area") {
        getArea();
    } else if (text === "Ingredients") {
        getIngredients();
    } else if (text === "Contact Us") {
        showContacts();
    }
    closeSideNav();
})
function toggleSideNav() {
    if ($(".side-nav-menu").css("left") === "0px") {
        closeSideNav();
    } else {
        openSideNav();
    }
}
function openSideNav() {
    $(".side-nav-menu").animate({ left: 0 }, 500);
    $(".open-close-icon").removeClass("fa-align-justify").addClass("fa-x");
    $(".links li").each((i, el) => {
        $(el).animate({ top: 0 }, (i + 5) * 100);
    });
}
function closeSideNav() {
    const boxWidth = $(".side-nav-menu .nav-tab").outerWidth();
    $(".side-nav-menu").animate({ left: -boxWidth }, 500);
    $(".open-close-icon").addClass("fa-align-justify").removeClass("fa-x");
    $(".links li").animate({ top: 300 }, 500);
}
async function fetchMeals(url) {
    const response = await fetch(url);
    return await response.json();
}
function displayMeals(arr) {
    let mealDisplay = "";
    for (let i = 0; i < arr.length; i++) {
        mealDisplay += `
            <div class="col-md-3">
                <div id="mealDetails" onclick="getDetails('${arr[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2">
                    <img class="w-100" src="${arr[i].strMealThumb}" alt="${arr[i].strMeal}">
                    <div class="meal-title position-absolute d-flex align-items-center text-black p-2">
                        <h3>${arr[i].strMeal}</h3>
                    </div>
                </div>
            </div>
        `
    }
    rowData.innerHTML = mealDisplay
}
async function getCategories() {
    rowData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(300);
    searchContainer.innerHTML = "";

    const data = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
    displayCategories(data.categories);
    $(".inner-loading-screen").fadeOut(300);
}
function displayCategories(arr) {
    let content = arr.map(category =>
        `<div class="col-md-3">
            <div onclick="getCategoryMeals('${category.strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                <img class="w-100" src="${category.strCategoryThumb}" alt="">
                <div class="meal-layer position-absolute text-center text-black p-2">
                    <h3>${category.strCategory}</h3>
                    <p>${category.strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                </div>
            </div>
        </div>`
    ).join("");
    rowData.innerHTML = content;
}
async function getArea() {
    rowData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(300);
    searchContainer.innerHTML = "";

    const data = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
    displayArea(data.meals);
    $(".inner-loading-screen").fadeOut(300);
}
function displayArea(arr) {
    let content = arr.map(area =>
        `<div class="col-md-3">
            <div onclick="getAreaMeals('${area.strArea}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                <i class="fas fa-city fa-3x"></i>
                <h3>${area.strArea}</h3>
            </div>
        </div>`
    ).join('');
    rowData.innerHTML = content;
}
async function getIngredients() {
    rowData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(300);
    searchContainer.innerHTML = "";

    const data = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list");
    displayIngredients(data.meals);
    $(".inner-loading-screen").fadeOut(300);
}
function displayIngredients(arr) {
    let content = arr.map(ingredient =>
        `<div class="col-md-3">
            <div onclick="getIngredientsMeals('${ingredient.strIngredient}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                <i class="fas fa-drumstick-bite fa-3x"></i>
                <h3>${ingredient.strIngredient}</h3>
                <p>${description}</p>
            </div>
        </div>`
    ).join("");
    rowData.innerHTML = content;
}
async function getCategoryMeals(category) {
    rowData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(300);
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    displayMeals(data.meals.slice(0, 20));
    $(".inner-loading-screen").fadeOut(300);
}
async function getAreaMeals(area) {
    rowData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(300);

    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    displayMeals(data.meals.slice(0, 20));
    $(".inner-loading-screen").fadeOut(300);
}
async function getIngredientsMeals(ingredient) {
    rowData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(300);

    const data = await fetchMeals(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
    displayMeals(data.meals.slice(0, 20));
    $(".inner-loading-screen").fadeOut(300);
}
async function getMealDetails(mealID) {
    closeSideNav();
    rowData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(300);
    searchContainer.innerHTML = "";

    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    displayMealDetails(data.meals[0]);
    $(".inner-loading-screen").fadeOut(300);
}
function displayMealDetails(meal) {
    searchContainer.innerHTML = "";

    const ingredients = Array.from({ length: 20 }, (_, i) => {
        const ingredient = meal[`strIngredient${i + 1}`];
        const measure = meal[`strMeasure${i + 1}`];
        return ingredient ? `<li class="alert alert-info m-2 p-1">${measure} ${ingredient}</li>` : '';
    }).join('');

    const tags = meal.strTags ? meal.strTags.split(",").map(tag =>
        `<li class="alert alert-danger m-2 p-1">${tag}</li>`
    ).join('') : '';

    const mealDetails = `
        <div class="col-md-4">
            <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h2>${meal.strMeal}</h2>
        </div>
        <div class="col-md-8">
            <h2>Instructions</h2>
            <p>${meal.strInstructions}</p>
            <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
            <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
            <h3>Recipes :</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">
                ${ingredients}
            </ul>
            <h3>Tags :</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">
                ${tags}
            </ul>
            <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
            <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
        </div>
    `;
    rowData.innerHTML = mealDetails;
}
function showSearchInputs() {
    const searchInputs = `
        <div class="row py-4">
            <div class="col-md-6">
                <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
            </div>
            <div class="col-md-6">
                <input onkeyup="searchByFLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
            </div>
        </div>
    `;

    searchContainer.innerHTML = searchInputs;
    rowData.innerHTML = '';
}
async function searchByName(term) {
    closeSideNav();
    rowData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(300);

    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
    displayMeals(data.meals || []);
    $(".inner-loading-screen").fadeOut(300);
}
async function searchByFLetter(letter) {
    closeSideNav();
    rowData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(300);

    letter = letter.trim() || "a";

    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
    displayMeals(data.meals || []);
    $(".inner-loading-screen").fadeOut(300);
}





















function showContacts() {
    rowData.html(
        `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
            <div class="container w-75 text-center">
                <div class="row g-4">
                    <div class="col-md-6">
                        <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                        <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">Special characters and numbers not allowed</div>
                    </div>
                    <div class="col-md-6">
                        <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control" placeholder="Enter Your Email">
                        <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">Email not valid *example@yyy.zzz</div>
                    </div>
                    <div class="col-md-6">
                        <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Phone">
                        <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">Enter valid Phone Number</div>
                    </div>
                    <div class="col-md-6">
                        <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control" placeholder="Enter Your Age">
                        <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">Enter valid age</div>
                    </div>
                    <div class="col-md-6">
                        <input id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control" placeholder="Enter Your Password">
                        <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">Password must be at least 6 characters</div>
                    </div>
                    <div class="col-md-6">
                        <input id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control" placeholder="Re-enter Your Password">
                        <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">Passwords do not match</div>
                    </div>
                    <div class="col-12">
                        <button id="submitBtn" onclick="submitForm()" class="btn btn-primary">Submit</button>
                    </div>
                </div>
            </div>
        </div>`
    );
}

function inputsValidation() {
    const name = $("#nameInput").val();
    const email = $("#emailInput").val();
    const phone = $("#phoneInput").val();
    const age = $("#ageInput").val();
    const password = $("#passwordInput").val();
    const repassword = $("#repasswordInput").val();

    // Name Validation
    const nameAlert = $("#nameAlert");
    if (/[^a-zA-Z\s]/.test(name) || name.length === 0) {
        nameAlert.removeClass("d-none");
        nameInputTouched = false;
    } else {
        nameAlert.addClass("d-none");
        nameInputTouched = true;
    }

    // Email Validation
    const emailAlert = $("#emailAlert");
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email) || email.length === 0) {
        emailAlert.removeClass("d-none");
        emailInputTouched = false;
    } else {
        emailAlert.addClass("d-none");
        emailInputTouched = true;
    }

    // Phone Validation
    const phoneAlert = $("#phoneAlert");
    if (!/^\d{10}$/.test(phone) || phone.length === 0) {
        phoneAlert.removeClass("d-none");
        phoneInputTouched = false;
    } else {
        phoneAlert.addClass("d-none");
        phoneInputTouched = true;
    }

    // Age Validation
    const ageAlert = $("#ageAlert");
    if (age < 1 || age > 120 || age.length === 0) {
        ageAlert.removeClass("d-none");
        ageInputTouched = false;
    } else {
        ageAlert.addClass("d-none");
        ageInputTouched = true;
    }

    // Password Validation
    const passwordAlert = $("#passwordAlert");
    if (password.length < 6 || password.length === 0) {
        passwordAlert.removeClass("d-none");
        passwordInputTouched = false;
    } else {
        passwordAlert.addClass("d-none");
        passwordInputTouched = true;
    }

    // Re-password Validation
    const repasswordAlert = $("#repasswordAlert");
    if (repassword !== password || repassword.length === 0) {
        repasswordAlert.removeClass("d-none");
        repasswordInputTouched = false;
    } else {
        repasswordAlert.addClass("d-none");
        repasswordInputTouched = true;
    }

    // Enable Submit Button
    toggleSubmitButton();
}

function toggleSubmitButton() {
    const isValid = nameInputTouched && emailInputTouched && phoneInputTouched &&
        ageInputTouched && passwordInputTouched && repasswordInputTouched;
    $("#submitBtn").prop("disabled", !isValid);
}

function submitForm() {
    if (nameInputTouched && emailInputTouched && phoneInputTouched &&
        ageInputTouched && passwordInputTouched && repasswordInputTouched) {
        saveFormData();
        alert("Form submitted successfully!");
    }
}

function saveFormData() {
    const formData = {
        name: $("#nameInput").val(),
        email: $("#emailInput").val(),
        phone: $("#phoneInput").val(),
        age: $("#ageInput").val(),
        password: $("#passwordInput").val(),
    };
    localStorage.setItem('formData', JSON.stringify(formData));
}

function loadFormData() {
    const data = JSON.parse(localStorage.getItem('formData'));
    if (data) {
        $("#nameInput").val(data.name);
        $("#emailInput").val(data.email);
        $("#phoneInput").val(data.phone);
        $("#ageInput").val(data.age);
        $("#passwordInput").val(data.password);
    }
}