
//*functions ===================================================================

/*initialise un tableau contenant les intervalles des id selon le
  nombre d'items par page*/
  function calc_intervals_pages(nb_items_par_page, nb_total) {

    var tab = [];
    var j = 0;
    // -1 car tab commence à zéro
    nb_items_par_page -= 1;
    while ( j <= nb_total) {
        if (j + nb_items_par_page < nb_total) {
            tab.push([j, j + nb_items_par_page]);
        }
        else {
            tab.push([j, nb_total])
        }
        j = j + nb_items_par_page + 1;
    }
    return tab;

}



//retourne nombre de pages selon nombre d'items par pages sélectionné
function get_nb_pages() {

    var items_page = document.getElementById("nb_items_page").value.toString();
    var total_items = document.getElementsByClassName("album").length;
    var npages = 0;
    var i = total_items;
    while ( i % items_page != 0 )  {
        i--;
    }
    npages = i / items_page;
    if (total_items - npages > 0){
        npages++;
    }

    return npages;

}



//* générer boutons pagination selon nb Pages  et page en cours
function genere_pagination(page_en_cours) {

    var nb_pages = get_nb_pages();
    if (nb_pages > 0) {
        var div_pagination = document.getElementById("pagination_b");
        div_pagination.innerHTML = "";
        //style
        div_pagination.style.display = "inline-flex";
        div_pagination.style.flexWrap = "wrap";
        div_pagination.style.justifyContent = "center";
        div_pagination.style.fontSize = "16px";
        div_pagination.style.marginTop = "25px";

        //généner boutons début, fin, précédent et suivant
        //début
        let debut = document.createElement("input");
        //attributes
        debut.value = "Début";
        debut.setAttribute("type", "button");
        debut.setAttribute("class", "pagination_btns");
        debut.setAttribute("id", "pagi_start");
        //style
        debut.style.cursor = "pointer";
        debut.style.marginLeft = "20px";
        //event
        debut.addEventListener("click", function () {
            current_page = 0;
            update_page(current_page);
        });
        //append
        div_pagination.appendChild(debut);


        //fin
        let fin = document.createElement("input");
        //attributes
        fin.value = "Fin";
        fin.setAttribute("type", "button");
        fin.setAttribute("class", "pagination_btns");
        fin.setAttribute("id", "pagi_end");
        //style
        fin.style.cursor = "pointer";
        fin.style.marginLeft = "5px";
        //event
        fin.addEventListener("click", function () {
            current_page = nb_pages - 1;
            update_page(current_page);
        });


        //précedent
        let precedent = document.createElement("input");
        //attributes
        precedent.value = "Précedent";
        precedent.setAttribute("type", "button");
        precedent.setAttribute("class", "pagination_btns");
        if (page_en_cours > 1) {
            precedent.setAttribute("id", "pagi_" + (page_en_cours - 1).toString());
        }
        else {
            precedent.setAttribute("id","prec_disabled");
        }
        //style
        precedent.style.cursor = "pointer";
        precedent.style.marginLeft = "5px";
        //event
        precedent.addEventListener("click", function () {
            if (current_page > 0){
                current_page -= 1;
                update_page(current_page);
            }

        });
        div_pagination.appendChild(precedent);

        //suivant
        let suivant = document.createElement("input");
        //attributes
        suivant.value = "Suivant";
        suivant.setAttribute("type", "button");
        suivant.setAttribute("class", "pagination_btns");
        if (page_en_cours < nb_pages -1) {
            suivant.setAttribute("id", "pagi_" + (page_en_cours + 1).toString());
        }
        else {
            suivant.setAttribute("id", "suiv_disabled");
        }
        //style
        suivant.style.marginLeft = "5px";
        suivant.style.cursor = "pointer";
        //event
        suivant.addEventListener("click", function () {
            if (current_page < nb_pages - 1) {
                current_page += 1;
                update_page(current_page);
            }
        });

        //crée boutons numéros pages
        for (let i=0; i < nb_pages; i++) {
            let btn_page = document.createElement("input");
            //attributes
            btn_page.value = (i + 1).toString();
            btn_page.setAttribute("id", "pagi_" + i.toString());
            btn_page.setAttribute("type", "button");
            btn_page.setAttribute("class", "pagination_btns");
            //style
            btn_page.style.marginLeft = "5px";
            btn_page.style.cursor = "pointer";

            //griser la page en cours
            if (i == page_en_cours) {
                btn_page.style.backgroundColor = "gray";
            }
            //event
            btn_page.addEventListener("click", function () {
                current_page = btn_page.value - 1;
                update_page(current_page);
            });
            //append
            div_pagination.appendChild(btn_page);

        }

        //ajouter boutons suivant et fin
        div_pagination.appendChild(suivant);
        div_pagination.appendChild(fin);
        //ajouter recap pagination
        var p_nb_pages = document.createElement("p");
        p_nb_pages.innerHTML = (current_page + 1).toString() +
                                " / " + nb_pages + " pages";
        p_nb_pages.style.marginLeft = "10px";

        //append pagination
        div_pagination.appendChild(p_nb_pages);

        //afficher uniquement boutons à MOINS 3 de la page courante
        // try/catch pour éviter id inexistantes ou out of range
        for (let j = page_en_cours - 1; j > page_en_cours - 4; j--) {
            try {
                document.getElementById("pagi_" + j.toString()).style.display = "block";
            }
            catch (e) {
                let error = e.message;
            }
        }
        for (let j = page_en_cours - 4; j >= 0 ; j--) {
            try {
                document.getElementById("pagi_" + j.toString()).style.display = "none";
            }
            catch (e) {
                let error = e.message;
            }
        }

        //afficher uniquement boutons à PLUS 3 de la page courante
        // try/catch pour éviter id inexistantes ou out of range
        for (let j = page_en_cours + 1; j < page_en_cours + 4; j++) {
            try {
                document.getElementById("pagi_" + j.toString()).style.display = "block";
            }
            catch (e) {
                let error = e.message;
            }
        }
        for (let j = page_en_cours + 4; j < nb_pages; j++) {
            try {
                document.getElementById("pagi_" + j.toString()).style.display = "none";
            }
            catch (e) {
                let error = e.message;
            }
        }
    }
}




//display none pour albums hors de la plage
// afficher en fonction du tableau selon num page
function affiche_page(num_page) {

    var nb_items_page = document.getElementById("nb_items_page").value.toString();
    var albums_items = document.getElementsByClassName("album");

    //création intervalles affichge selin id albums
    var pages_intervals = {};
    pages_intervals["16"] = calc_intervals_pages(16, albums_items.length);
    pages_intervals["32"] = calc_intervals_pages(32, albums_items.length);
    pages_intervals["48"] = calc_intervals_pages(48, albums_items.length);
    pages_intervals["64"] = calc_intervals_pages(64, albums_items.length);

    //boucle element id selon intervalle tableau
    for (let i=0; i<albums_items.length; i++) {
        let item = document.getElementById("li_" + i.toString());
        if ( i < pages_intervals[nb_items_page][num_page][0] ||
             i > pages_intervals[nb_items_page][num_page][1]) {
                item.style.display = "none";
            }
        else {
            item.style.display = "flex";
        }
    }

}



//maj page
function update_page(page) {

    genere_pagination(page);
    affiche_page(page);

 }

//*functions  END===============================================================


//* MAIN pagination ============================================================

//* event list articles par page
//modifier nb pages selon select
document.getElementById("nb_items_page").addEventListener("change",
    function () {
        current_page = 0;
        update_page(current_page);
    });

//* event tri
//modifier nb pages selon select
document.getElementById("tri_select").addEventListener("change",
    function () {
        //modifie contenu attribut liste_bd.tAlbums
        trier_par = document.getElementById("tri_select").value;
        liste_bd.sortby(trier_par);
        //maj affichage
        document.getElementById("catalogue_div").innerHTML = "";
        liste_bd.affiche_catalogue();
        //maj selon nb articles à afficher
        current_page = 0;
        update_page(current_page);
    });


//tri
var trier_par = "";
//affichage pagination
var current_page = 0;
update_page(current_page);

