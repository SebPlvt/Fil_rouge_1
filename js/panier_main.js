//MAIN PANIER ==================================================================
var panier = new Panier(albums);
panier.get_from_LS();
// maj dropdown
if (panier.items.length > 0) {
    panier.cartEmptyToggle();
}

if (location.href.includes("/pages/panier.html")) {
    panier.afficherPanier();

    //* event change quantité ajuste soustotal
    var qty_btn = document.getElementsByClassName("cart_qty");
    for (let bouton in qty_btn) {
        try {
            let btn_obj = document.getElementById(qty_btn[bouton].id);
            btn_obj.addEventListener("change", function () {
                let quantite1 = btn_obj.value;
                let id1 = btn_obj.id.split("id_")[1];

                panier.modifier(id1, quantite1);
                //modifier id sous total
                document.getElementById("stotal_" + id1).innerHTML =
                    (parseFloat(document.getElementById("prix_" + id1).innerHTML)
                    * quantite1).toString();

                //maj total #span_total
                var sous_totaux = document.getElementsByClassName("sous_totaux");
                var prix_total = 0;
                for (let i=0; i<sous_totaux.length; i++) {
                    let stotal_val = parseFloat(sous_totaux[i].innerHTML);
                    prix_total = prix_total + stotal_val;

                }
                let total = document.getElementById("span_total");
                total.innerHTML = prix_total;

            });
        }
        catch(e) {
            let error =  e.message;
        }
    }

        //* ajout event suppression
    var suppr_class = document.getElementsByClassName("suppr_btns");
    for (let suppr_btn in suppr_class) {
        try {
            let item_id = suppr_class[suppr_btn].id
            let btn_obj = document.getElementById(item_id);
            btn_obj.addEventListener("click", function () {
                panier.enleve(item_id.split("_id")[1]);
                document.getElementById("cart-tablebody").innerHTML = "";
            });
        }
        catch(e) {
            let error =  e.message;
        }
    }

    //* bouton reset
    document.getElementById("delete_cart").addEventListener("click", function () {
        panier.reset();
    });

    //* bouton valider cmde
    document.getElementById("confirm_command").addEventListener("click", function () {
        panier.valide();
    });

}

// =============================================================================
//                             ||  jQuery  ||
// =============================================================================

// comportement du panier au survol pour affichage de son contenu ==============
var timeout;

//grand écran ==================================================================
$('#cart').on({
    mouseenter: function() {
        $('#cart-dropdown').show();
    },
    mouseleave: function() {
        timeout = setTimeout(function() {
            $('#cart-dropdown').hide();
        }, 500);
    }
});

// laisse le contenu ouvert à son survol
// le cache quand la souris sort
$('#cart-dropdown').on({
    mouseenter: function() {
        clearTimeout(timeout);
    },
    mouseleave: function() {
        $('#cart-dropdown').hide();
    }
});
//fin grand écran ==============================================================


//mobile =======================================================================
$('#cart-mobile').on({
    mouseenter: function() {
        $('#cart-dropdown-mobile').show();
    },
    mouseleave: function() {
        timeout = setTimeout(function() {
            $('#cart-dropdown-mobile').hide();
        }, 500);
    }
});

// laisse le contenu ouvert à son survol
// le cache quand la souris sort
$('#cart-dropdown-mobile').on({
    mouseenter: function() {
        clearTimeout(timeout);
    },
    mouseleave: function() {
        $('#cart-dropdown-mobile').hide();
    }
});
//fin mobile ===================================================================


