// Fonctions pour interagir avec la base de données Supabase

// Exemple : Insérer un contact (assurez-vous que la table 'contacts' existe dans Supabase)
async function insertContact(name, email, message) {
    try {
        const { data, error } = await supabase
            .from('contacts')
            .insert([{ name: name, email: email, message: message, created_at: new Date() }]);
        if (error) throw error;
        console.log('Contact inséré avec succès :', data);
        alert('Message envoyé avec succès !');
        return data;
    } catch (error) {
        console.error('Erreur lors de l\'insertion du contact :', error.message);
        alert('Erreur lors de l\'envoi du message : ' + error.message);
    }
}

// Exemple : Récupérer tous les contacts (pour admin)
async function getContacts() {
    try {
        const { data, error } = await supabase
            .from('contacts')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        console.log('Contacts récupérés :', data);
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des contacts :', error.message);
        alert('Erreur lors de la récupération des données : ' + error.message);
    }
}

// Exemple : Supprimer un contact par ID
async function deleteContact(id) {
    try {
        const { data, error } = await supabase
            .from('contacts')
            .delete()
            .eq('id', id);
        if (error) throw error;
        console.log('Contact supprimé :', data);
        alert('Contact supprimé avec succès !');
        return data;
    } catch (error) {
        console.error('Erreur lors de la suppression :', error.message);
        alert('Erreur lors de la suppression : ' + error.message);
    }
}

// Exemple générique : Insérer dans une table quelconque
async function insertData(table, data) {
    try {
        const { data: result, error } = await supabase
            .from(table)
            .insert([data]);
        if (error) throw error;
        console.log('Données insérées dans', table, ':', result);
        return result;
    } catch (error) {
        console.error('Erreur lors de l\'insertion dans', table, ':', error.message);
        alert('Erreur lors de l\'insertion : ' + error.message);
    }
}

// Exemple générique : Récupérer des données
async function getData(table, select = '*', filters = {}) {
    try {
        let query = supabase.from(table).select(select);
        // Appliquer des filtres si fournis
        Object.keys(filters).forEach(key => {
            query = query.eq(key, filters[key]);
        });
        const { data, error } = await query;
        if (error) throw error;
        console.log('Données récupérées de', table, ':', data);
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération de', table, ':', error.message);
        alert('Erreur lors de la récupération : ' + error.message);
    }
}

// Exemple d'utilisation dans un formulaire de contact :
// document.getElementById('contactForm').addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const name = document.getElementById('name').value;
//     const email = document.getElementById('email').value;
//     const message = document.getElementById('message').value;
//     await insertContact(name, email, message);
//     // Réinitialiser le formulaire
//     e.target.reset();
// });