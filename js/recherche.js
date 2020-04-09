//Fonctions =========================================================
// Fonction qui appelle selon texte de recherche et type choisis
function callListe(name, type) {
    txt = txt.toString().toLowerCase();
    var listeAlbum;

    switch (type) {
        case "titre" :
            listeAlbum = searchByTitre(name);
            break;
        case "serie" :
            listeAlbum = searchBySerie(name);
            break;
        case "auteur" :
            listeAlbum = searchByAuteur(name);
            break;
        case "prix_max" :
            listeAlbum = searchByPrix(name);
            break;
        default:
            throw new Error("Type invalide : " + type);
    }

    if (location.href.includes("/pages/rechercher.html")) {
        var nbResult = document.getElementById("nbResult");
        nbResult.innerHTML = listeAlbum.size;
    }

    var liste_bd = new Catalogue(auteurs, series, listeAlbum);
    liste_bd.getAlbumsImages();

    liste_bd.affiche_catalogue();
    return liste_bd;
}

//Fonction pour recherche par titre
function searchByTitre(titre) {
    var result = new Map();

    albums.forEach(function (value, key, map) {
        if (((value.titre).toString().toLowerCase()).includes(titre)) {
            result.set(key, value);
        }
    });

    return result;
}

//Fonction pour recherche par série
function searchBySerie(serie) {
    var result = new Map();
    var resultSeries = [];

    series.forEach(function (value, key, map) {
        if (((value.nom).toString().toLowerCase()).includes(serie)) {
            resultSeries.push(key);
        }
    });

    albums.forEach(function (value, key, map) {
        if (resultSeries.includes(value.idSerie)) {
            result.set(key, value);
        }
    });

    return result;
}

//Fonction pour recherche par auteur
function searchByAuteur(auteur) {
    var result = new Map();
    var resultAuteurs = [];

    auteurs.forEach(function (value, key, map) {
        if (((value.nom).toString().toLowerCase()).includes(auteur)) {
            resultAuteurs.push(key);
        }
    });

    albums.forEach(function (value, key, map) {
        if (resultAuteurs.includes(value.idAuteur)) {
            result.set(key, value);
        }
    });

    return result;
}

//Fonction pour recherche par prix
function searchByPrix(prix) {
    var result = new Map();

    albums.forEach(function (value, key, map) {
        if (parseFloat(value.prix) < parseFloat(prix)) {
            result.set(key, value);
        }
    });

    return result;
}

//MAIN RECHERCHE ============================================================
var url = new URL(window.location);
var txt = url.searchParams.get("txt");
var type = url.searchParams.get("type");

if (txt != null && type != null) {
    var liste_bd = callListe(txt, type);
}

if (location.href.includes("/pages/rechercher.html")) {
    var txtResult = document.getElementById("txtResult");
    txtResult.innerHTML = txt.toString();
}

if (type != null) {
    var selectPC = document.getElementById("recherche");
    for (let i = 0; i < selectPC.length; i++) {
        if (selectPC[i].value == type) {
            selectPC[i].selected = true;
        }
    }

    var selectMobile = document.getElementById("recherche_mobile");
    for (let i = 0; i < selectMobile.length; i++) {
        if (selectMobile[i].value == type) {
            selectMobile[i].selected = true;
        }
    }
}