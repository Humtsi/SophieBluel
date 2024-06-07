/********  Récupération api ****/

function recuperationWorks() {

    let works = window.sessionStorage.getItem("works");

    if (works === null) {
        // Récupération des pièces depuis l'API et stockage dans le sessionStorage
        return fetch("http://localhost:5678/api/works")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erreur de récupération des travaux : " + response.status);
                }
                return response.json();
            })
            .then(works => {
                // Transformation des pièces en JSON
                const valeurWorks = JSON.stringify(works);
                // Stockage des informations dans le localStorage
                window.sessionStorage.setItem("works", valeurWorks);
                return works;
            }) .catch(error => {
                // Gestion des erreurs
                console.error("Erreur lors de la récupération des travaux:", error);
            });
    } else {
        return Promise.resolve(JSON.parse(works));
    }
}

function actualisationWorks() {
    return fetch("http://localhost:5678/api/works").then(response => {
            if (!response.ok) {
                throw new Error("Erreur de l'actualisation des pièces : " + response.status);
            }
            return response.json();
        })
        .then(works => {
            // Transformation des pièces en JSON
            const valeurWorks = JSON.stringify(works);
            // Stockage des informations dans le sessionStorage
            window.sessionStorage.setItem("works", valeurWorks);
            return works;
        })
        .catch(error => {
            // Gestion des erreurs
            console.error("Erreur lors de l'actualisation des pièces:", error);
        });
}

function recuperationCategories() {
    let categories = window.sessionStorage.getItem("categories");

    if (categories === null) {
        // Récupération des catégories depuis l'API
        return fetch("http://localhost:5678/api/categories")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erreur de récupération des catégories : " + response.status);
                }
                return response.json();
            })
            .then(categories => {
                // Transformation des catégories en JSON
                const valeurCategories = JSON.stringify(categories);
                // Stockage des informations dans le sessionStorage
                window.sessionStorage.setItem("categories", valeurCategories);
                return categories;
            })
            .catch(error => {
                // Gestion des erreurs
                console.error("Erreur de récupération des catégories : ", error);
            });
    } else {
        return Promise.resolve(JSON.parse(categories));
    }
}

/********* Affichage *******/ 

document.addEventListener("DOMContentLoaded", () => {
    genererFiltres ()
    recuperationWorks().then(works => {
        genererProjet (works)
        genererGalerieModale (works)
    })
    genererAffichageConnexion ()
    logout ()
    gestionModale ()
})

/********* Gestion modale **********/ 

function gestionModale () {
    // Récupérer les éléments
    const modale = document.getElementById("modalecover");
    const modifier = document.getElementById("modifier");
    const modeedition = document.getElementById("modeedition");
    const fermer = document.querySelector(".fa-xmark");

    const ajouterphoto = document.querySelector(".btn-modale");
    const ajoutphoto = document.querySelector(".ajoutphoto")
    const galleriephoto = document.querySelector(".galleriephoto")
    const fleche = document.querySelector(".fa-arrow-left")

    // Ouvrir la modale sur les deux boutons
    modifier.onclick = function() {
        modale.style.display = "block";
    }

    modeedition.onclick = function() {
        modale.style.display = "block";
    }

    // Fermer la modale en cliquant sur le X
    fermer.onclick = function() {
        modale.style.display = "none";
        resetForm ()
    }

    // Fermer la modale en cliquant en dehors
    window.onclick = function(event) {
        if (event.target == modale) {
            modale.style.display = "none";
            resetForm ()
        }
    }

    // Changement de modale
    ajouterphoto.onclick = function() {
        ajoutphoto.classList.remove("cache");
        fleche.classList.remove("cache");
        galleriephoto.classList.add("cache")
    }

    fleche.onclick = function() {
        ajoutphoto.classList.add("cache");
        fleche.classList.add("cache");
        galleriephoto.classList.remove("cache")
    }
};

/************* Affichage de la grille des projets *************/

function genererProjet (works) {

    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    works.forEach(projet => {
        // const gallery = document.querySelector(".gallery");
        const figure = document.createElement("figure");
        figure.dataset.id = projet.id;

        const imageFigure = document.createElement("img");
        imageFigure.src = projet.imageUrl;

        const nomFigure = document.createElement("figcaption");
        nomFigure.innerText = projet.title

        gallery.appendChild(figure);
        figure.appendChild(imageFigure);
        figure.appendChild(nomFigure);
    })
}

/************* Affichage des boutons de filtres *************/

function genererFiltres() {
    
    //gestion des bouttons 

    const filtres = document.querySelector(".filtres");
    const boutonTous = document.createElement("button");

    // Création bouton Tous permanent

    boutonTous.innerText = "Tous";
    boutonTous.id = "button-tous";
    boutonTous.classList.add("btn");
    boutonTous.addEventListener("click", function() {
        document.querySelector(".gallery").innerHTML = "";
        recuperationWorks().then(works => {
            genererProjet(works);
        });
    });
    filtres.appendChild(boutonTous);

    // Création boutons pour chaque categorie existante
    recuperationCategories()
    .then(categories => {
        categories.forEach(categorie => {

            const bouton = document.createElement("button");
            bouton.innerText = categorie.name;
            bouton.id = `button-${categorie.name}`;
            bouton.classList.add("btn");

            bouton.addEventListener("click", function() {
                recuperationWorks().then(works => {
                    const ProjetsFiltres = works.filter(work => 
                    work.category.id === categorie.id);
                    
                    document.querySelector(".gallery").innerHTML = "";
                    genererProjet(ProjetsFiltres);
                });
            });
            filtres.appendChild(bouton);
        });
    })
}

/********* Statut connecté **********/

function Connexion () {
    let token = window.sessionStorage.getItem("token");
    let connexion = false;

    if (token === null) {
        return connexion
    } else{
        connexion = true;
        return connexion
    } 
}

/********* Suppression token lorsque logout **********/

function logout () {
    document.getElementById("logout").addEventListener("click", function(event) {
        event.preventDefault();
        window.sessionStorage.removeItem("token");
        location.reload();
    })
}

/********* Affichage et masque des éléments en fonction du statut connecté **********/ 

function genererAffichageConnexion () {
    let connexion = Connexion()
    const logout = document.getElementById("logout");
    const login = document.getElementById("login");
    const modifier = document.getElementById("modifier");
    const modeedition = document.getElementById("modeedition");

    if(connexion === true) {
        modifier.classList.remove("cache");
        modeedition.classList.remove("cache");
        logout.classList.remove("cache");
        login.classList.add("cache");
    } else {
        modeedition.classList.add("cache");
        modifier.classList.add("cache");
        logout.classList.add("cache");
        login.classList.remove("cache");
    }
}

/********* Gestion de la galerie photo de la modale **********/ 

function genererGalerieModale (works) {
    const gallery = document.querySelector(".contenumodale");
    gallery.innerHTML = "";

    works.forEach(projet => {
        
        const divconteneur = document.createElement("div");

        const image = document.createElement("img");
        image.src = projet.imageUrl;

        const poubelle = document.createElement("span");
        poubelle.innerHTML="<i class='fa-solid fa-trash-can'></i>";
        poubelle.dataset.id = projet.id;

        poubelle.addEventListener("click", function () {
            supprimerProjet(poubelle.dataset.id);
        })

        gallery.appendChild(divconteneur);
        divconteneur.appendChild(image);
        divconteneur.appendChild(poubelle);
    })
}

/********* Suppression d'un projet **********/ 

function supprimerProjet (id) {
    let token = window.sessionStorage.getItem("token");
    fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "accept" : "*/*",
            "Authorization": `Bearer ${token}`,
        }
    })
    .then(response => {
        if (response.ok) {
            document.querySelector(".contenumodale").innerHTML = "";
            actualisationWorks().then((works) => {
                genererGalerieModale(works);
                genererProjet (works)
            })
            return

        } else if (response.status === 401) {
            throw new Error("Pas correctement identifié");
            
        } else if (response.status === 500) {
            throw new Error("Bug");
        }
    })
    .catch(error => {
        // Gère les erreurs non traitées
        console.error("Erreur:", error);
    })
}

/********* Ajout d'un projet **********/ 

function ajouterProjet () {
    
    const formData = new FormData();
    let token = window.sessionStorage.getItem("token");
    const messageErreur = document.getElementById("messageErreurAjoutProjet")

    // Recuperation des elements pour l'API
    const titre = document.getElementById("titre").value;
    const categorie = document.getElementById("categorie").value;
    const image = document.getElementById("photo").files[0];
    
    recuperationCategories().then((categories) => {
        let categorieId;
    
        for (let i = 0; i < categories.length; i++) {
            if (categorie === categories[i].name) {
                categorieId = categories[i].id;
                break;
            }
        }

        formData.append("image", image);
        formData.append("title", titre);
        formData.append("category", categorieId);
    
        // Envoi du formulaire
        fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {"Authorization": `Bearer ${token}`},
            body: formData,
        })
        .then(response => {
            
            if (response.ok) {
                actualisationWorks().then((works) => {
                    messageErreur.textContent = "Bien reçu !"
                    genererProjet (works);
                    genererGalerieModale(works);
                    resetForm ()
                });
                return response.json()
    
            } else if (response.status === 400) {
                messageErreur.textContent = "Cette catégorie n'existe pas";
                throw new Error("Catégorie inexistante");
                
            } else if (response.status === 401) {
                // Utilisateur non connecté
                messageErreur.textContent = "Non autorisé";
                throw new Error("Utilisateur non connecté");
            } else {
                // Bug
                messageErreur.textContent = "Bug";
                throw new Error("Bug");
            }
        })
        .catch(error => {
            // Gère les erreurs non traitées
            console.error("Erreur:", error);
        })
    }) 
}  

document.getElementById("formajoutphoto").addEventListener("submit", function(event) {
    event.preventDefault();
    ajouterProjet()
})

/********* Clic sur bouton pour ouvrir inputfile ********/

document.querySelector(".btn-inputfile").addEventListener("click", function(event) {
    event.preventDefault();
    document.getElementById("photo").click();
});

/********* Reset du formulaire ********/

function resetForm () {
    const formAjoutPhoto = document.getElementById("formajoutphoto");
    const inputfile = document.querySelector(".inputfile");
    const visualisationImage = document.getElementById("visualisationimage");
    
    formAjoutPhoto.reset();
    imagePreview.src = "#";
    visualisationImage.classList.add("cache");
    inputfile.classList.remove("cache");
}

/********* Prévisualisation de l'image dans le formulaire **********/ 

document.getElementById("photo").addEventListener("change", () => {
    const input = document.getElementById("photo");;
    const reader = new FileReader();

    reader.onload = function() {
        const visualisationimage = document.getElementById("visualisationimage");
        const inputfile = document.querySelector(".inputfile");
        const imagePreview = document.getElementById("imagePreview");

        // Afficher la prévisualisation de l'image
        imagePreview.src = reader.result;
        visualisationimage.classList.remove("cache");
        
        // Masquer le bouton d'ajout de photo
        inputfile.classList.add("cache");
    }

    reader.readAsDataURL(input.files[0]);
});