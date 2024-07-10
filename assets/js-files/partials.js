const head = `
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<!--font awesome cdn-->

<script src="https://kit.fontawesome.com/11b6095cfd.js" crossorigin="anonymous"></script>

<link rel="stylesheet" href="/assets/css-files/theme.css">

<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>`

const indexhead = `
<title>Dashboard</title>
<!--swiperjs cdn -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

<!--internal stylesheet-->
  <link rel="stylesheet" href="/assets/css-files/common-styles.css">
<link rel="stylesheet" href="/assets/css-files/history.css">
<link rel="stylesheet" href="/assets/css-files/profile.css">
<link rel="stylesheet" href="/assets/css-files/home.css">
<link rel="stylesheet" href="/assets/css-files/index.css">`

const popUpAlert = `
<div id="alertBox" class="alert-box">

<span class="icon" id="icon">



</span>

<p id="res-message">

</p>
<button id="okButton" class="ok-btn"></button>
</div>`

const bootstrap =` <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>`



module.exports = {
  head,
  indexhead,
  popUpAlert,
  bootstrap
};