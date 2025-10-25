// Abonnements en temps réel avec Supabase

// Exemple : S'abonner aux changements dans la table 'contacts'
function subscribeToContacts() {
    const channel = supabase
        .channel('contacts_changes')
        .on('postgres_changes', {
            event: '*', // Écouter tous les événements (INSERT, UPDATE, DELETE)
            schema: 'public',
            table: 'contacts'
        }, (payload) => {
            console.log('Changement détecté dans contacts :', payload);
            // Mettre à jour l'UI en temps réel
            handleContactChange(payload);
        })
        .subscribe((status) => {
            console.log('Statut de l\'abonnement contacts :', status);
        });

    // Retourner le channel pour pouvoir se désabonner plus tard
    return channel;
}

// Fonction pour gérer les changements (à personnaliser selon vos besoins)
function handleContactChange(payload) {
    const { eventType, new: newRecord, old: oldRecord } = payload;

    switch (eventType) {
        case 'INSERT':
            console.log('Nouveau contact ajouté :', newRecord);
            // Ajouter à la liste UI
            addContactToUI(newRecord);
            break;
        case 'UPDATE':
            console.log('Contact mis à jour :', newRecord);
            // Mettre à jour dans la liste UI
            updateContactInUI(newRecord);
            break;
        case 'DELETE':
            console.log('Contact supprimé :', oldRecord);
            // Supprimer de la liste UI
            removeContactFromUI(oldRecord.id);
            break;
    }
}

// Fonctions d'exemple pour mettre à jour l'UI (à implémenter selon votre HTML)
function addContactToUI(contact) {
    // Exemple : Ajouter une ligne dans un tableau
    const contactsList = document.getElementById('contacts-list');
    if (contactsList) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${contact.name}</td>
            <td>${contact.email}</td>
            <td>${contact.message}</td>
            <td>${new Date(contact.created_at).toLocaleString()}</td>
        `;
        contactsList.appendChild(row);
    }
}

function updateContactInUI(contact) {
    // Trouver et mettre à jour la ligne existante
    const row = document.querySelector(`[data-id="${contact.id}"]`);
    if (row) {
        row.innerHTML = `
            <td>${contact.name}</td>
            <td>${contact.email}</td>
            <td>${contact.message}</td>
            <td>${new Date(contact.created_at).toLocaleString()}</td>
        `;
    }
}

function removeContactFromUI(id) {
    // Supprimer la ligne
    const row = document.querySelector(`[data-id="${id}"]`);
    if (row) {
        row.remove();
    }
}

// Exemple : S'abonner à plusieurs tables
function subscribeToMultipleTables() {
    // Abonnement aux contacts
    const contactsChannel = subscribeToContacts();

    // Abonnement à une autre table, par exemple 'users'
    const usersChannel = supabase
        .channel('users_changes')
        .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'users'
        }, (payload) => {
            console.log('Nouvel utilisateur :', payload.new);
            // Gérer l'événement
        })
        .subscribe();

    // Retourner les channels pour gestion
    return { contactsChannel, usersChannel };
}

// Pour démarrer les abonnements :
// const subscriptions = subscribeToMultipleTables();

// Pour arrêter :
// subscriptions.contactsChannel.unsubscribe();
// subscriptions.usersChannel.unsubscribe();