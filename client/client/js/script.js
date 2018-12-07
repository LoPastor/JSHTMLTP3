window.onload=init;

function init() {
    new Vue({
        el: "#app",
        data: {
            restaurants: [
                {
                   /* nom: 'café de Paris',
                    cuisine: 'Française'
                },
                {
                    nom: 'café de Paris',
                    cuisine: 'Française'
                },
                {
                    nom: 'EL Cafeo',
                    cuisine: 'Italienne'
                },
                {
                    nom: 'Strabucks',
                    cuisine: 'Américaine'
                */ }
            ],
            name: '',
            cuisine: '',
            nbRestaurants:0,
            //pagesize:10,
            page:0,
            nbRestaurantsParPage: 5,
            nomRecherche:'',
            id:''
        },
        
        mounted() {
            console.log("AVANT AFFICHAGE");
            this.getRestaurantsFromServer();
        },
        methods: {
            getRestaurantsFromServer() {
                let url = "http://localhost:8080/api/restaurants?page=" +
                    this.page  +"&name=" + this.nomRecherche +   "&pagesize=" + //this.pagesize;
                    this.nbRestaurantsParPage;

                  

                console.log("Je vais chercher les restaurants sur : " + url)

                fetch(url)
                    .then((responseJS) => {
                        //console.log("reponse json");
                         responseJS.json()
                    
                    .then((responseJS) => {
                        // ici on a une réponse en JS
                        console.log("J'ai récupéré les restaurants");
                        this.restaurants = responseJS.data;
                        this.nbRestaurants = responseJS.count;
                       
                    });
                })
                    .catch((err) => {
                        console.log("Une erreur est intervenue " + err);
                    });

                      //gestion des disabled pour les boutons de pagination

                    if (this.page==0){
                        document.getElementById("PremPage").disabled='true';
                        document.getElementById("PagePrec").disabled='true';
                    }
                        else {
                            document.getElementById("PremPage").disabled='';
                        document.getElementById("PagePrec").disabled='';
                        }
                    
                        // lorsqu'on lance la page, ces boutons sont désactivés, et se réactive dès que l'on effectue une recherche 
                        //==> temps d'exécution trop long? je suppose que c'est parce que nbRestaurants =0 au début
                      if ((Math.trunc(this.nbRestaurants/this.nbRestaurantsParPage))<=this.page){
                            document.getElementById("PageSuiv").disabled='true';
                            document.getElementById("DernPage").disabled='true';
                        }
                            else {
                                document.getElementById("PageSuiv").disabled='';
                            document.getElementById("DernPage").disabled='';
                            }
            },

            searchRestaurantsFromServer: _.debounce(
                function () {
                    
                    this.getRestaurantsFromServer();
                }, 300),



    supprimerRestaurant(id, index) {
           
            
 

    // Récupération du formulaire. Pas besoin de document.querySelector
    // ou document.getElementById puisque c'est le formulaire qui a généré
    // l'événement
    
   // on peut aller chercher la valeur
                             // d'un champs d'un formulaire
                             // comme cela, si on connait le nom
                             // du champ (valeur de son attribut name)
                            this.restaurants.splice(index, 1);
                             let url = "http://localhost:8080/api/restaurants/" + id;

                             fetch(url, {
                                 method: "DELETE"
                             })
                             .then(function(responseJSON) {
                                 responseJSON.json()
                                     .then(function(res) {
                                         // Maintenant res est un vrai objet JavaScript
                                         console.log("Restaurant supprimé");
                                          this.getRestaurantsFromServer();
                                     });
                                 })
                                 .catch(function (err) {
                                     console.log(err);
                             });
                            
                         },


            ajouterRestaurant(event) {
                // eviter le comportement par defaut
             /*   event.preventDefault();

                this.restaurants.push(
                    {
                        name: this.name,
                        cuisine: this.cuisine
                    }
                );
                this.name = "";
                this.cuisine = "";
            },*/
                 event.preventDefault();
                // Récupération des valeurs des champs du formulaire
                // en prévision d'un envoi multipart en ajax/fetch
                let form = event.target;
                let donneesFormulaire = new FormData(form);

                let url = "http://localhost:8080/api/restaurants";

                fetch(url, {
                        method: "POST",
                        body: donneesFormulaire
                    })
                    .then((responseJSON) => {
                        responseJSON.json()
                            .then((res) => { // arrow function préserve le this
                                // Maintenant res est un vrai objet JavaScript
                                console.log("Restaurant ajouté");
                                this.getRestaurantsFromServer();

                                // remettre le formulaire à zéro
                                this.name = "";
                                this.cuisine = "";
                            });
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
        },
      modifierRestaurant(event) {

        event.preventDefault();
        document.getElementsByClassName("Mod").style.display = "none";
        // Récupération du formulaire. Pas besoin de document.querySelector
        // ou document.getElementById puisque c'est le formulaire qui a généré
        // l'événement
        let form = event.target;
        // Récupération des valeurs des champs du formulaire
        // en prévision d'un envoi multipart en ajax/fetch
        let donneesFormulaire = new FormData(event.target);
    
        let id = form._id.value; // on peut aller chercher la valeur
                                 // d'un champs d'un formulaire
                                 // comme cela, si on connait le nom
                                 // du champ (valeur de son attribut name)
    
        let url = "/api/restaurants/" + id;
    
        fetch(url, {
            method: "PUT",
            body: donneesFormulaire
        })
    .then(function(responseJSON) {
        responseJSON.json()
            .then(function(res) {
                // Maintenant res est un vrai objet JavaScript
                afficheReponsePUT(res);
            });
        })
        .catch(function (err) {
            console.log(err);
    });
},

            pagePrecedente() {
                if (this.page > 0) {
                    this.page--;
                    this.getRestaurantsFromServer();
                }
            },
            premierePage(){
                if (this.page > 0) {
                this.page=0;
                this.getRestaurantsFromServer();
                }
            },
           dernierePage(){
            if ((Math.trunc(this.nbRestaurants/this.nbRestaurantsParPage))>this.page)
            {
                this.page=Math.trunc(this.nbRestaurants/this.nbRestaurantsParPage);
                this.getRestaurantsFromServer();
            }
            },
            pageSuivante() {
                if ((Math.trunc(this.nbRestaurants/this.nbRestaurantsParPage))>this.page)
                {
                this.page++;
                this.getRestaurantsFromServer();
                }
            
            },
            changePageSize() {
                this.getRestaurantsFromServer();
            },

       /*     preModifier(nom,cuis){
            document.getElementsByClassName("Mod").style.display = "block";
            document.getElementsByName("NomMod").value=nom;
            document.getElementsByName("CuisMod").value=cuis;
            },*/
getColor(index) {
    return (index % 2) ? 'lightBlue' : 'pink';
}
        }
    })
}
