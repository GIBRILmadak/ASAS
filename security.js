// Meilleures pratiques de sécurité pour Supabase

// Validation des entrées utilisateur
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    // Validation basique pour numéros congolais
    const phoneRegex = /^(\+243|0)[0-9]{9}$/;
    return phoneRegex.test(phone);
}

function sanitizeInput(input) {
    // Échapper les caractères HTML dangereux
    return input.replace(/[&<>"']/g, function(match) {
        const escapeChars = {
            '&': '&',
            '<': '<',
            '>': '>',
            '"': '"',
            "'": '''
        };
        return escapeChars[match];
    });
}

function validateMessage(message) {
    if (!message || message.trim().length < 10) {
        throw new Error('Le message doit contenir au moins 10 caractères.');
    }
    if (message.length > 1000) {
        throw new Error('Le message ne peut pas dépasser 1000 caractères.');
    }
    return sanitizeInput(message.trim());
}

// Gestion sécurisée des erreurs (ne pas exposer les détails internes)
function handleSupabaseError(error) {
    console.error('Erreur Supabase détaillée :', error);

    // Messages d'erreur génériques pour l'utilisateur
    const userFriendlyMessages = {
        'PGRST116': 'Données non trouvées.',
        '23505': 'Cette entrée existe déjà.',
        '42501': 'Accès non autorisé.',
        'auth/invalid-email': 'Adresse email invalide.',
        'auth/weak-password': 'Mot de passe trop faible.',
        'auth/user-not-found': 'Utilisateur non trouvé.',
        'auth/wrong-password': 'Mot de passe incorrect.',
        'auth/email-already-in-use': 'Cette adresse email est déjà utilisée.',
        'auth/too-many-requests': 'Trop de tentatives. Réessayez plus tard.'
    };

    return userFriendlyMessages[error.code] || userFriendlyMessages[error.message] || 'Une erreur inattendue s\'est produite. Veuillez réessayer.';
}

// Rate limiting basique (côté client, pour UX)
class RateLimiter {
    constructor(maxRequests = 5, windowMs = 60000) {
        this.requests = [];
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
    }

    canMakeRequest() {
        const now = Date.now();
        this.requests = this.requests.filter(time => now - time < this.windowMs);

        if (this.requests.length >= this.maxRequests) {
            return false;
        }

        this.requests.push(now);
        return true;
    }
}

const contactRateLimiter = new RateLimiter(3, 300000); // 3 requêtes par 5 minutes

// Fonction sécurisée pour insérer un contact
async function secureInsertContact(name, email, message) {
    try {
        // Vérifier le rate limiting
        if (!contactRateLimiter.canMakeRequest()) {
            throw new Error('Trop de demandes. Veuillez attendre avant de réessayer.');
        }

        // Valider les entrées
        const validatedMessage = validateMessage(message);
        const validatedName = name ? sanitizeInput(name.trim()) : 'Anonymous';

        let validatedEmail = null;
        if (email) {
            if (!validateEmail(email)) {
                throw new Error('Adresse email invalide.');
            }
            validatedEmail = email.toLowerCase().trim();
        }

        // Utiliser la fonction d'insertion existante
        await insertContact(validatedName, validatedEmail, validatedMessage);

    } catch (error) {
        const userMessage = handleSupabaseError(error);
        alert(userMessage);
        throw error; // Re-throw pour gestion supplémentaire si nécessaire
    }
}

// Gestion des sessions utilisateur
function checkAuthState() {
    const user = supabase.auth.user();
    if (!user) {
        // Rediriger vers page de connexion ou afficher message
        console.log('Utilisateur non authentifié');
        return false;
    }
    return true;
}

// Nettoyer les données sensibles du localStorage/sessionStorage
function clearSensitiveData() {
    // Supabase gère automatiquement la plupart des tokens
    // Mais on peut ajouter un nettoyage personnalisé si nécessaire
    localStorage.removeItem('custom-sensitive-data');
    sessionStorage.clear();
}

// Exemple d'utilisation :
// Remplacer insertContact par secureInsertContact dans les formulaires
// document.getElementById('contact-form').addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const name = document.getElementById('name').value;
//     const email = document.getElementById('email').value;
//     const message = document.getElementById('message').value;
//     await secureInsertContact(name, email, message);
//     e.target.reset();
// });