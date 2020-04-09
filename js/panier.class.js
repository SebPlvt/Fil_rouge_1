//? objet panier
function Panier (albums){

    //* attributes _____________________________________________________________
    //liste albums + liste id albums pour affichage panier
    this.liste_bd = albums;
    this.albums_id = Array.from(this.liste_bd.keys());
    //contenu panier
    this.items = []; //id + qté

    //* methods ////////////////////////////////////////////////////////////////

    // toggle cart elements whether it's empty or not
    this.cartEmptyToggle = function () {
        //TOPNAV VERSION
        if (this.items.length > 0) {
            $('#cart-dropdown .hidden').removeClass('hidden');
            $('#empty-cart-msg').hide();
        }
        else{
            $('#cart-dropdown, #cart-dropdown #go-to-cart').addClass('hidden');
            $('#empty-cart-msg').show();
        }

        //MOBILE VERSION
        // toggle cart elements whether it's empty or not
        if (this.items.length > 0) {
            $('#cart-dropdown-mobile .hidden').removeClass('hidden');
            $('#empty-cart-msg-mobile').hide();
        }
        else{
            $('#cart-dropdown-mobile, #cart-dropdown-mobile #go-to-cart-mobile').addClass('hidden');
            $('#empty-cart-msg-mobile').show();
        }
    }



    //*ajouter un article ======================================================
    this.ajout = function(id_article, quantite) {
        //panier depuis localstorage
        this.get_from_LS();
        var tArticle = [];
        //vérifier si article déjà présent
        var art_exists = false;
        if (this.items.length > 0) {
            for (let art in this.items) {
                tArticle = this.items[art].split("&");
                //si oui flag true
                if (tArticle[0] == id_article) {
                    tArticle[1] =
                        (parseInt(tArticle[1]) + parseInt(quantite)).toString();
                    this.items[art] = tArticle.join("&");
                    art_exists = true;
                    break;
                }
            }
            if (!art_exists) {
                // si inexistant l'ajouter
                this.items.push(id_article+ "&" + quantite);
                document.getElementById("panier_btn").innerHTML =
                "Mon panier (" + this.items.length + ")";
            }
            //ajout dropdown
            this.add_cart_dropdown(id_article, quantite);
        }
        else {
            //sinon l'ajouter
            this.items.push(id_article+ "&" + quantite);
            document.getElementById("panier_btn").innerHTML =
            "Mon panier (" + this.items.length + ")";

            //créer dropdowns
            this.add_cart_dropdown(id_article, quantite);
            this.cartEmptyToggle();

        }
        //sauver changements
        this.save();
        if (location.href.includes("/pages/panier.html")) {
            this.afficherPanier();
        }
    }
    // =========================================================================



    //*ajouter l'article à l'élément panier-survol
    this.add_cart_dropdown = function (id_article, quantite) {
        var cart = document.getElementById("go-to-cart");
        var cart_mobile = document.getElementById("go-to-cart-mobile");
        var article = document.createElement("div");
        var article_mob = document.createElement("div");
        article.innerHTML = this.liste_bd.get(id_article).titre + ", qté: " + quantite;
        cart.style.minWidth = "160px";
        cart.style.zIndex = "3000";
        article_mob.innerHTML = this.liste_bd.get(id_article).titre + ", qté: " + quantite;
        cart_mobile.style.zIndex = "3000";
        cart_mobile.style.minWidth = "160px";
        //panier grand
        cart.insertBefore(article, cart.firstChild);
        //panier mobile
        cart_mobile.appendChild(article_mob);
    }
    // =========================================================================



    //* supprimer un article du panier  ========================================
    this.enleve = function(id_art_supr) {
        var tArticle = [];
        this.get_from_LS();
        for (let art in this.items) {
            tArticle = this.items[art].split("&");
            if (tArticle[0] == id_art_supr.toString()) {
                this.items.splice(this.items.indexOf(this.items[art]), 1);
                document.getElementById("panier_btn").innerHTML =
                    "Mon panier (" + this.items.length + ")";
                document.getElementById("panier_icon").innerHTML =
                    "Mon panier (" + this.items.length + ")";
            }
        }
        //efface aperçu panier
        if (this.items.length == 0) {
            //TODO
            this.cartEmptyToggle();
            document.getElementById("panier_btn").innerHTML = "Mon panier";
        }
        //sauver changements
        this.save();
        if (location.href.includes("/pages/panier.html")) {
            this.afficherPanier();
        }
    }
    // =========================================================================



    //* modifier un article du panier  =========================================
    this.modifier = function(id_article, quantite) {

        this.get_from_LS();
        var tArticle = [];
        //vérifier si article déjà présent
        var art_exists = false;
        if (this.items.length > 0) {
            for (let art in this.items) {
                tArticle = this.items[art].split("&");
                //si oui flag true
                if (tArticle[0] == id_article) {
                    tArticle[1] = quantite.toString();
                    this.items[art] = tArticle.join("&");
                    art_exists = true;
                    document.getElementById("panier_btn").innerHTML =
                    "Mon panier (" + this.items.length + ")";
                    break;
                }
            }
            if (!art_exists) {
                // si inexistant erreur
                throw new Error("Erreur : l'article n'est pas " +
                                "présent dans le panier");
            }
        }
        else {
            //panier vide : erreur
            throw new Error("Erreur : Pas d'article dans le panier");
        }
        //sauver changements
        this.save();

    }
    // =========================================================================



    //* validation panier  =====================================================
    this.valide = function () {
        //?validation panier
        if(this.items.length > 0) {
            alert("Panier validé ! Merci :)");
        }
        else {
            alert("Erreur : Votre panier est vide...");
        }
    }
    // =========================================================================



    //* sauve le panier dans le local storage ==================================
    this.save = function () {
        localStorage.setItem("panier_bd", this.items);
    }
    // =========================================================================



    //* récupère panier depuis local storage si existant =======================
    this.get_from_LS = function () {
        if (localStorage.panier_bd) {
            var tRefresh = [];
            tRefresh = localStorage.panier_bd.split(",");
            this.items = Array.from(tRefresh);
            //reset cart dropdown
            document.getElementById("go-to-cart").innerHTML = "";
            document.getElementById("go-to-cart-mobile").innerHTML = "";
            document.getElementById("panier_btn").innerHTML =
                "Mon panier (" + this.items.length + ")";
            //articles dans cart dropdown
            for (let i in this.items) {
                let infos_art = this.items[i].split("&")
                let idArticle = infos_art[0];
                let quantite = infos_art[1];
                this.add_cart_dropdown(idArticle, quantite);
            }
        }
    }
    // =========================================================================



    //* reset panier ===========================================================
    this.reset = function () {
        this.items = [];
        localStorage.clear();
        document.getElementById("span_total").innerHTML = 0;
        this.afficherPanier();
        this.cartEmptyToggle();
        document.getElementById("go-to-cart").innerHTML = "";
        document.getElementById("go-to-cart-mobile").innerHTML = "";
        document.getElementById("panier_btn").innerHTML = "Mon panier";
    }
    // =========================================================================



//* affiche le panier ==========================================================
    this.afficherPanier = function () {

        this.get_from_LS();
        // "root" element
        var tab_panier = document.getElementById("cart-tablebody");
        tab_panier.innerHTML = "";
        if (this.items.length == 0) {
            tab_panier.innerHTML = "<h3></br>Le panier est vide...</h3>";
        }
        else {
            var prix_total = 0;

            for (let art in this.items) {
                let infos_art = this.items[art].split("&")
                let idArticle = infos_art[0];
                let quantite = infos_art[1];

                // child of cart container
                var item_row = document.createElement("tr");

                // children of item container
                var titre_cell = document.createElement("td");
                titre_cell.innerHTML = this.liste_bd.get(idArticle).titre;

                var prix_cell = document.createElement("td");
                prix_cell.setAttribute("id", "prix_" + infos_art[0]);
                prix_cell.innerHTML = this.liste_bd.get(idArticle).prix;

                var qty_cell = document.createElement("td");
                // children of qty_cell
                var qty = document.createElement("input");
                qty.setAttribute("id", "id_" + idArticle);
                qty.type = "number";
                qty.min = 1;
                qty.max = 9999;
                qty.value = quantite;
                qty.setAttribute("class", "cart_qty");
                qty.style.border = "1px solid gold";
                qty.style.borderRadius = "5px";
                qty.style.textAlign = "center";
                qty.style.fontSize = "15px";

                qty_cell.appendChild(qty);

                // suppr icon
                var trash_icon = document.createElement('img');
                trash_icon.src = "../icons/delete.png";
                trash_icon.width = "15";
                trash_icon.height = "15";
                trash_icon.alt = "Supprimer article";
                var trash_a = document.createElement("a");
                trash_a.href = "?suppr=" + idArticle;

                trash_a.appendChild(trash_icon);
                trash_a.setAttribute("class", "suppr_btns");
                trash_a.setAttribute("id", "suppr_id" + idArticle);

                // suppr cell
                var suppr_cell = document.createElement("td");
                suppr_cell.appendChild(trash_a);


                // sous total
                var stotal_cell = document.createElement("td");
                stotal_cell.setAttribute("class", "sous_totaux");
                stotal_cell.setAttribute("id", "stotal_" + infos_art[0]);
                let sous_total =
                    Math.round(parseFloat(this.liste_bd.get(idArticle).prix) *
                    parseInt(quantite)*100)/100;
                prix_total += sous_total;
                prix_total = Math.round(prix_total*100)/100;
                stotal_cell.innerHTML = sous_total;

                //append children
                item_row.appendChild(titre_cell);
                item_row.appendChild(prix_cell);
                item_row.appendChild(qty_cell);
                item_row.appendChild(suppr_cell);
                item_row.appendChild(stotal_cell);

                tab_panier.appendChild(item_row);

            }

            // prix total
            var total_container = document.getElementById("span_total");
            total_container.innerHTML = prix_total;

        }

    }
    // =========================================================================


//end of class Panier
}