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
$(".side-nav-menu i.open-close-icon").on('click', toggleSideNav);
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

    const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
    const data = await response.json();
    console.log(data); // للتحقق من البيانات المسترجعة
    displayCategories(data.categories);
    $(".inner-loading-screen").fadeOut(300);
}
function displayCategories(arr) {
    if (!arr) {
        console.error("No categories data available");
        return;
    }
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

    const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
    const data = await response.json();
    console.log(data); // للتحقق من البيانات المسترجعة
    displayArea(data.meals);
    $(".inner-loading-screen").fadeOut(300);
}

function displayArea(arr) {
    if (!arr) {
        console.error("No area data available");
        return;
    }
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

    const response = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list");
    const data = await response.json();
    console.log(data); // للتحقق من البيانات المسترجعة
    displayIngredients(data.meals);
    $(".inner-loading-screen").fadeOut(300);
}

function displayIngredients(arr) {
    if (!arr) {
        console.error("No ingredients data available");
        return;
    }
    let content = arr.map(ingredient =>
        `<div class="col-md-3">
            <div onclick="getIngredientsMeals('${ingredient.strIngredient}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                <i class="fas fa-drumstick-bite fa-3x"></i>
                <h3>${ingredient.strIngredient}</h3>
                <p>${ingredient.strDescription.split(" ").slice(0, 20).join(" ")}</p>
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
    searchContainer.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <input onkeyup="searchByName(this.value)" type="text" class="form-control bg-transparent text-white" placeholder="Search By Name">
            </div>
            <div class="col-md-6">
                <input onkeyup="searchByFirstLetter(this.value)" maxlength="1" type="text" class="form-control bg-transparent text-white" placeholder="Search By First Letter">
            </div>
        </div>`;
    rowData.innerHTML = "";
}
async function searchByName(term) {
    rowData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(300);

    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
    data.meals ? displayMeals(data.meals) : displayMeals([]);
    $(".inner-loading-screen").fadeOut(300);
}
async function searchByFirstLetter(term) {
    rowData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(300);

    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`);
    data.meals ? displayMeals(data.meals) : displayMeals([]);
    $(".inner-loading-screen").fadeOut(300);
}
function showContacts() {
    rowData.innerHTML = `
        <div class="contact min-vh-100 d-flex justify-content-center align-items-center">
            <div class="container w-75 text-center text-white">
                <div class="row g-4">
                    <div class="col-md-6">
                        <input id="nameInput" type="text" class="form-control" placeholder="Enter Your Name">
                        <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Special Characters and Numbers are not allowed
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="emailInput" type="email" class="form-control" placeholder="Enter Your Email">
                        <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Enter a valid email. *Ex: xxx@yyy.zzz
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="phoneInput" type="text" class="form-control" placeholder="Enter Your Phone">
                        <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Enter valid Phone Number
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="ageInput" type="number" class="form-control" placeholder="Enter Your Age">
                        <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Enter valid age
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="passwordInput" type="password" class="form-control" placeholder="Enter Your Password">
                        <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Enter valid password *Minimum eight characters, at least one letter and one number:*
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="repasswordInput" type="password" class="form-control" placeholder="Retype Your Password">
                        <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Enter valid Repassword
                        </div>
                    </div>
                </div>
                <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
            </div>
        </div>`;
    submitBtn = document.getElementById("submitBtn");
    $('#nameInput, #emailInput, #phoneInput, #ageInput, #passwordInput, #repasswordInput').on('input', validateForm);
}
function validateForm() {
    const nameValid = validateName();
    const emailValid = validateEmail();
    const phoneValid = validatePhone();
    const ageValid = validateAge();
    const passwordValid = validatePassword();
    const repasswordValid = validateRepassword();

    submitBtn.disabled = !(nameValid && emailValid && phoneValid && ageValid && passwordValid && repasswordValid);
}
function validateName() {
    const regex = /^[a-zA-Z ]+$/;
    const nameInput = document.getElementById("nameInput");
    const nameAlert = document.getElementById("nameAlert");
    const valid = regex.test(nameInput.value);
    nameAlert.classList.toggle('d-none', valid);
    return valid;
}
function validateEmail() {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailInput = document.getElementById("emailInput");
    const emailAlert = document.getElementById("emailAlert");
    const valid = regex.test(emailInput.value);
    emailAlert.classList.toggle('d-none', valid);
    return valid;
}
function validatePhone() {
    const regex = /^[0-9]{10,}$/;
    const phoneInput = document.getElementById("phoneInput");
    const phoneAlert = document.getElementById("phoneAlert");
    const valid = regex.test(phoneInput.value);
    phoneAlert.classList.toggle('d-none', valid);
    return valid;
}
function validateAge() {
    const ageInput = document.getElementById("ageInput");
    const ageAlert = document.getElementById("ageAlert");
    const valid = ageInput.value > 0;
    ageAlert.classList.toggle('d-none', valid);
    return valid;
}
function validatePassword() {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const passwordInput = document.getElementById("passwordInput");
    const passwordAlert = document.getElementById("passwordAlert");
    const valid = regex.test(passwordInput.value);
    passwordAlert.classList.toggle('d-none', valid);
    return valid;
}
function validateRepassword() {
    const passwordInput = document.getElementById("passwordInput");
    const repasswordInput = document.getElementById("repasswordInput");
    const repasswordAlert = document.getElementById("repasswordAlert");
    const valid = passwordInput.value === repasswordInput.value;
    repasswordAlert.classList.toggle('d-none', valid);
    return valid;
}
