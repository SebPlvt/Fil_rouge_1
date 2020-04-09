
//Fonctions ==========================================================
function getInfos(num) {
    var idSerie = document.getElementById("idSerie");
    var numero = document.getElementById("numero");
    var titre = document.getElementById("titre");
    var idAuteur = document.getElementById("idAuteur");
    var prix = document.getElementById("prix");
    var albumId = document.getElementById("album");

    // emplacement des images des albums en grand
    const srcAlbum = "../albums/"; 

    var album = albums.get(num); 

    if (album === undefined) {
        idSerie.innerHTML = "";
        numero.innerHTML = "";
        titre.innerHTML = "";
        idAuteur.innerHTML = "";
        prix.innerHTML = 0;

    } else {
        var serie = series.get(album.idSerie);
        var auteur = auteurs.get(album.idAuteur);

        //Affichage des infos dans la page detail
        idSerie.innerHTML = serie.nom;
        numero.innerHTML = album.numero;
        titre.innerHTML = album.titre;
        idAuteur.innerHTML = auteur.nom;
        prix.innerHTML = album.prix + " €";

        //Affichage de l'image
        var nomFic = (serie.nom + "-"
            + album.numero + "-"
            + album.titre).replace(/'|!|\?|\.|"|:|\$/g, "");
        albumId.setAttribute('src', srcAlbum + nomFic + ".jpg");
    }
}

//Récupération id le la bd choisie
var url = new URL(window.location);
var id = url.searchParams.get("id");

// Récupération donnée concernant la bd + affichage
getInfos(id);

var bd_id = location.href.split("?id=")[1];
var bd_field_qty = document.getElementById("quantite_detail");
var bd_qty = bd_field_qty.value;
bd_field_qty.addEventListener("change", function () {
    bd_qty = bd_field_qty.value;
 });

//Event qui envoie sur nouvelle url quand on ckique sur le bouton
document.getElementById("ajouter_btn").addEventListener("click", (function () {
    panier.ajout(bd_id, bd_qty);
}));
