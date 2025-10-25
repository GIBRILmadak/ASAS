// Fonctions d'authentification Supabase

// Inscription pour professionnels
async function signUpProfessional(email, password, professionalData) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    is_professional: true,
                    first_name: professionalData.firstName,
                    last_name: professionalData.lastName,
                    phone: professionalData.phone,
                    specialty: professionalData.specialty,
                    role: professionalData.role,
                    location: professionalData.location,
                    availability: professionalData.availability
                }
            }
        });
        if (error) throw error;
        console.log('Inscription professionnelle réussie :', data);
        alert('Inscription réussie ! Vérifiez votre email pour confirmer.');
        return data;
    } catch (error) {
        console.error('Erreur lors de l\'inscription professionnelle :', error.message);
        alert('Erreur lors de l\'inscription : ' + error.message);
    }
}

// Inscription standard
async function signUp(email, password) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });
        if (error) throw error;
        console.log('Inscription réussie :', data);
        alert('Inscription réussie ! Vérifiez votre email pour confirmer.');
        return data;
    } catch (error) {
        console.error('Erreur lors de l\'inscription :', error.message);
        alert('Erreur lors de l\'inscription : ' + error.message);
    }
}

// Connexion
async function signIn(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        if (error) throw error;
        console.log('Connexion réussie :', data);
        alert('Connexion réussie !');
        return data;
    } catch (error) {
        console.error('Erreur lors de la connexion :', error.message);
        alert('Erreur lors de la connexion : ' + error.message);
    }
}

// Déconnexion
async function signOut() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        console.log('Déconnexion réussie');
        alert('Déconnexion réussie !');
    } catch (error) {
        console.error('Erreur lors de la déconnexion :', error.message);
        alert('Erreur lors de la déconnexion : ' + error.message);
    }
}

// Écouter les changements d'état d'authentification
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
        console.log('Utilisateur connecté :', session.user);
        // Mettez à jour l'UI ici si nécessaire
        updateAuthUI(session.user);
    } else if (event === 'SIGNED_OUT') {
        console.log('Utilisateur déconnecté');
        updateAuthUI(null);
    }
});

// Fonction pour vérifier si l'utilisateur est un professionnel
async function isProfessional(userId) {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('is_professional')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data.is_professional || false;
    } catch (error) {
        console.error('Erreur lors de la vérification du statut professionnel :', error);
        return false;
    }
}

// Fonction pour mettre à jour l'interface utilisateur (à personnaliser selon vos besoins)
async function updateAuthUI(user) {
    const authStatus = document.getElementById('auth-status');
    const professionalBadge = document.getElementById('professional-badge');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const professionalFeatures = document.getElementById('professional-features');

    if (authStatus) {
        if (user) {
            const isProf = await isProfessional(user.id);
            authStatus.textContent = `Connecté en tant que ${user.email}`;
            if (isProf && professionalBadge) {
                professionalBadge.style.display = 'inline-block';
            }
            if (isProf && professionalFeatures) {
                professionalFeatures.style.display = 'block';
            }
            if (loginForm) loginForm.style.display = 'none';
            if (signupForm) signupForm.style.display = 'none';
        } else {
            authStatus.textContent = 'Non connecté';
            if (professionalBadge) professionalBadge.style.display = 'none';
            if (professionalFeatures) professionalFeatures.style.display = 'none';
            if (loginForm) loginForm.style.display = 'block';
            if (signupForm) signupForm.style.display = 'block';
        }
    }
}

// Fonctions pour les formulaires de connexion/inscription professionnels
async function handleProfessionalSignUp(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const professionalData = {
        firstName: formData.get('first-name'),
        lastName: formData.get('last-name'),
        phone: formData.get('phone'),
        specialty: formData.get('specialty'),
        role: formData.get('role'),
        location: formData.get('location'),
        availability: formData.get('availability')
    };

    const email = formData.get('email');
    const password = formData.get('password');

    await signUpProfessional(email, password, professionalData);
}

async function handleProfessionalSignIn(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');

    await signIn(email, password);
}

// Exemple d'utilisation :
// document.getElementById('signUpBtn').addEventListener('click', () => {
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;
//     signUp(email, password);
// });