document.getElementById("formulaireConnexion").addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const motdepasse = document.getElementById("mdp").value;
    const messageErreur = document.getElementById("messageErreur");

    // Réinitialiser le message d'erreur
    messageErreur.textContent = "";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Vérifier si l'email est valide
    if (!emailRegex.test(email)) {
        messageErreur.textContent = "Veuillez entrer une adresse email valide.";
        return;
    }

    // Préparer les données pour l'API
    const login = {
        email: email,
        password: motdepasse,
    }

    try {
        // Appel à l'API
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(login)
        })

        const logs = await response.json();

        if (response.ok) {
            window.sessionStorage.setItem("token", logs.token);
            window.location.href = "index.html";

        } else if (response.status === 401) {
            // Erreur d'authentification (mot de passe incorrect)
            messageErreur.textContent = "Mot de passe incorrect";
            throw new Error('Mot de passe incorrect');
            
        } else if (response.status === 404) {
            // Utilisateur non trouvé
            messageErreur.textContent = "Email non existant";
            throw new Error('Email non existant');
        }

    } catch (error) {
        // Gère les erreurs non traitées
        console.error("Erreur:", error);
    }
})