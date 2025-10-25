// Configuration EmailJS pour l'envoi d'emails
const EMAILJS_CONFIG = {
    publicKey: 'https://dashboard.emailjs.com/admin', // Étape 1: Obtenez-la sur https://www.emailjs.com/ après inscription
    serviceId: 'service_8yphk9l', // Étape 2: Créez un service email (Gmail recommandé)
    templateId: 'template_w6d6dcd' // Étape 3: Créez un template d'email
};

// Fonction pour envoyer un email via EmailJS
async function sendEmail(templateParams) {
    try {
        // Assurez-vous qu'EmailJS est chargé
        if (typeof emailjs === 'undefined') {
            throw new Error('EmailJS n\'est pas chargé. Vérifiez votre connexion internet.');
        }

        // Initialiser EmailJS avec la clé publique
        emailjs.init(EMAILJS_CONFIG.publicKey);

        const result = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            templateParams
        );

        console.log('Email envoyé avec succès :', result);
        return result;
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email :', error);
        throw new Error('Échec de l\'envoi de l\'email. Vérifiez votre configuration EmailJS.');
    }
}

// Fonction spécifique pour envoyer un message de contact
async function sendContactEmail(name, email, subject, message) {
    const templateParams = {
        from_name: name || 'Anonyme',
        from_email: email || 'anonyme@example.com',
        subject: subject,
        message: message,
        time: new Date().toLocaleString('fr-FR'), // Ajout de l'heure actuelle
        to_email: 'stopausuicideenrdc@gmail.com' // Email de destination ASAS RDC
    };

    return await sendEmail(templateParams);
}