//* MAIN
// Récupération champs de recherche et type vers page rechercher.html

if (location.href.includes("/pages/")) {

	document.querySelector("#search-btn").addEventListener('click', function() {
		document.getElementById("searchFormPC").submit();
	});

	document.querySelector("#search-btn-mobile").addEventListener('click', function() {
		document.getElementById("searchFormMobile").submit();
	});
}