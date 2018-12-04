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
            nomRecherche:''
        },
        
        mounted() {
            console.log("AVANT AFFICHAGE");
            this.getRestaurantsFromServer();
        },
        methods: {
            getRestaurantsFromServer() {
                let url = "http://localhost:8080/api/restaurants?page=" +
                    this.page  +  "&pagesize=" + //this.pagesize;
                    this.nbRestaurantsParPage+  "&name=" + this.nomRecherche;

                    //gestion des disabled pour les boutons de pagination
if (this.page==0){
    document.getElementById("PremPage").disabled='true';
    document.getElementById("PagePrec").disabled='true';
}
    else {
        document.getElementById("PremPage").disabled='';
    document.getElementById("PagePrec").disabled='';
    }

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
            },

            searchRestaurantsFromServer: _.debounce(
                function () {
                    
                    this.getRestaurantsFromServer();
                }, 300),



    supprimerRestaurant(_id) {
                //this.restaurants.splice(index, 1);
            
 

    // Récupération du formulaire. Pas besoin de document.querySelector
    // ou document.getElementById puisque c'est le formulaire qui a généré
    // l'événement
    
 
   // let id = form._id.value // on peut aller chercher la valeur
                             // d'un champs d'un formulaire
                             // comme cela, si on connait le nom
                             // du champ (valeur de son attribut name)
                             let url = "http://localhost:8080/api/restaurants/" + _id;

                             fetch(url, {
                                 method: "DELETE",
                             })
                             .then(function(responseJSON) {
                                 responseJSON.json()
                                     .then(function(res) {
                                         // Maintenant res est un vrai objet JavaScript
                                         console.log("Restaurant supprimé");
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
      modifierRestaurant(_id) {



   // let id = form._id.value; // on peut aller chercher la valeur
                             // d'un champs d'un formulaire
                             // comme cela, si on connait le nom
                             // du champ (valeur de son attribut name)

    let url = "http://localhost:8080/api/restaurants/" + _id;

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
                this.page++;
                this.getRestaurantsFromServer();
            },
            pageSuivante() {

                
                this.page++;
                this.getRestaurantsFromServer();
            
            },
            changePageSize() {
                this.getRestaurantsFromServer();
            },
getColor(index) {
    return (index % 2) ? 'lightBlue' : 'pink';
}
        }
    })
}
