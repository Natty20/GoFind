const express = require('express');
const connectDB = require('./config/db');
const adminRoutes = require('./routes/adminRoutes');
const prestationRoutes = require('./routes/categorieRoutes');
const sousPrestationRoutes = require('./routes/sousPrestationRoutes');
const authRoutes = require('./routes/authRoutes');
const prestataireRoutes = require('./routes/prestataireRoutes');
const reservationRoutes = require("./routes/reservationRoutes");
const cors = require('cors');
const app = express();
const path = require("path");

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Sert le dossier 'build' du frontend comme un static
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Envoie le fichier index.html pour toute autre requête
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});


app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

app.use('/api/auth', authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/prestataires", prestataireRoutes);
app.use('/api/prestations', prestationRoutes);
app.use('/api/sousprestations', sousPrestationRoutes);
app.use("/api/reservations", reservationRoutes);


app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const { montant, client, prestataire, prestations, selectedDate, selectedHour } = req.body;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'eur',
                    product_data: { name: 'Paiement Service' },
                    unit_amount: montant * 100,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: 'http://localhost:3000/cancel',
            metadata: {
                clientId: client?._id,
                prestataireId: prestataire?._id,
                prestations: JSON.stringify(prestations),
                date: selectedDate,
                heure: selectedHour,
            },
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error('Erreur Stripe:', error);
        res.status(500).send('Erreur lors de la création de la session Stripe');
    }
});

app.get('/api/confirm-payment', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

        if (session.payment_status === 'paid') {
            const reservationData = {
                clientId: session.metadata.clientId,
                prestataireId: session.metadata.prestataireId,
                prestations: JSON.parse(session.metadata.prestations),
                date: session.metadata.date,
                heure: session.metadata.heure,
                modePaiement: 'Carte via Stripe',
                description: '',
            };

            await axios.post('http://localhost:2000/api/reservations/new', reservationData);

            return res.redirect('http://localhost:3000/demande_envoye');
        } else {
            return res.redirect('http://localhost:3000/cancel');
        }
    } catch (error) {
        console.error('Erreur de confirmation:', error);
        res.redirect('http://localhost:3000/cancel');
    }
});

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
