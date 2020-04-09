
//? import data in html first
//? objet catalogue : liste BD émulation bdd
function Catalogue(auteurs, series, albums) {

    //* attributes
    this.auteurs = auteurs;
    this.series = series;
    this.albums = albums;
    this.tAlbums = []
    this.albums_id = Array.from(this.albums.keys());

    //* methods

    //*récupère noms images albums
    this.getAlbumsImages = function() {

        var index_id = 0;
        var idImage = [];
        this.albums.forEach(element => {
            let serie = this.series.get(element.idSerie);
            //tALbums contient :
            // tAlbums[i][0]=id, tAlbums[i][1]= lien image, tAlbums[i][2]= titre,
            // tAlbums[i][3]= prix, tAlbums[i][4]= serie, tAlbums[i][5]= auteur,
            // tAlbums[i][6]= numero
            let idBd = this.albums_id[index_id];
            let fichier = (serie.nom + "-" + element.numero +
                "-" + element.titre).replace(/'|!|\?|\.|"|:|\$/g, "")
            idImage = [idBd,
                       fichier + ".jpg",
                       element.titre,
                       element.prix,
                       element.idSerie,
                       element.idAuteur,
                       element.numero];
            this.tAlbums.push(idImage);
            index_id++;
        });

    }

    //* tri de tAlbums selon critere (défaut par id)
    this.sortby = function(choix) {

        //tri du tableau selon le n° de dimension donné par critere
        function tri(critere, tab) {

            //parse nb to string or string to nb
            function tab_conv_int_str(tab, conv_nb=true) {
                for (let i = 0; i< tab.length; i++) {
                    //prix float
                    if (conv_nb) {
                        tab[i][3] = parseFloat(tab[i][3]);
                    }
                    else {
                        tab[i][3] = tab[i][3].toString();
                    }
                    //parse int à partir de j4 car j1, j2 == string, j3 float
                    for (let j = 4; j < tab[i].length; j++) {
                        if (conv_nb) {
                            // pb "bdd" numerotation non unifiée
                            // => Nan sur A ou HS, backup valeur tmp
                            if (j==6) {
                                var tmp = tab[i][j];
                            }
                            tab[i][j] = parseInt(tab[i][j]);
                            // si nan remplace par backup valeur tmp
                            if (isNaN(tab[i][j])) {
                                tab[i][j] = tmp;
                            }
                        }
                        else {
                            //ajoute un zéro pour le n° bd si < 10
                            if (tab[i][j] < 10 && j == 6) {
                                tab[i][j] = "0" + tab[i][j].toString();
                            }
                            else {
                                tab[i][j] = tab[i][j].toString();
                            }
                        }
                    }
                }
                return tab;
            }


            //parse to nb
            tab = tab_conv_int_str(tab, true);
            //tri
            tab.sort(function(a, b) {
                    return a[critere] - b[critere];
              });
            //parse to str
            tab = tab_conv_int_str(tab, false);
            return tab;
         }


        switch(choix) {
            case "titre":
                this.tAlbums.sort((function(index){
                    return function(a, b){
                    return (a[index] === b[index] ? 0 : (a[index] < b[index] ? -1 : 1));
                    };
                    })(2));
                break;

            case "prix":
                this.tAlbums = tri(3, this.tAlbums);
                break;

            case "serie":
                this.tAlbums = tri(4, this.tAlbums);
                break;

            case "auteur":
                this.tAlbums = tri(5, this.tAlbums);
                break;

            case "numero":
                this.tAlbums = tri(6, this.tAlbums);
                break;
            //tri par id : case default inutile
        }

    }



    //* affichage dynamique des bd pour le catalogue et la recherche
    this.affiche_catalogue = function () {

        var ul_album = document.createElement("ul");
        ul_album.setAttribute("class", "pagination");
        var i_li = 0;
        for (let i in this.tAlbums) {
            //* UL > LI > A > {IMG, P}
            let li_album = document.createElement("li");

            let a_link = document.createElement("a");
            a_link.href = "../pages/detail.html" + "?id=" + this.tAlbums[i][0];

            // nom série
            let nom_serie = document.createElement("p");
            nom_serie.innerHTML = this.series.get(this.tAlbums[i][4]).nom;
            nom_serie.setAttribute("id", "catalog_serie");

            nom_serie.style.fontWeight = "bold";
            nom_serie.style.marginBottom = "3px";


            let img = document.createElement("img");
            img.alt = "Produit indisponible";
            img.src = "../albumsMini/" + this.tAlbums[i][1];
            img.width = 117;

            let bd_titre = document.createElement("p");
            bd_titre.innerHTML = this.tAlbums[i][2];

            //bd title style
            bd_titre.style.textAlign = "center";
            bd_titre.style.marginTop = "10px";
            bd_titre.style.fontSize = "14px";
            bd_titre.style.display = "flex";
            bd_titre.style.flexDirection = "column";
            bd_titre.style.flexWrap = "wrap";
            bd_titre.style.width = "100px";
            bd_titre.style.textAlign = "center";
            bd_titre.style.fontStyle = "italic";

            //prix
            let prix_itm = document.createElement("p");
            prix_itm.innerHTML = "Prix : " +
                                this.tAlbums[i][3].replace(".", ",") + "€";
            prix_itm.style.textAlign = "center";
            prix_itm.style.fontSize = "12px";
            prix_itm.style.marginTop = "10px";

            a_link.appendChild(nom_serie);
            a_link.appendChild(img);
            a_link.appendChild(bd_titre);
            a_link.appendChild(prix_itm);
            li_album.appendChild(a_link);

            //li style
            li_album.style.display = "flex";
            li_album.style.flexDirection = "column";
            li_album.style.boxSizing = "content-box";
            li_album.style.listStyleType = "none";
            li_album.style.margin = "15px";
            li_album.style.border = "solid 3px gold";
            li_album.style.borderRadius = "5px";
            li_album.style.padding = "10px";
            li_album.style.justifyContent = "center";
            li_album.style.width = "120px";
            li_album.setAttribute("class" ,"album");
            li_album.setAttribute("id", "li_" + i_li);
            i_li++;
            ul_album.appendChild(li_album);

        }

        // ul style
        ul_album.style.display = "inline-flex";
        ul_album.style.flexDirection = "row";
        ul_album.style.flexWrap = "wrap";

        //append elements to html
        document.getElementById("catalogue_div").appendChild(ul_album);

    }

    //end of class Catalogue
}