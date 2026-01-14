import mongoose from 'mongoose';

const avisSchema = new mongoose.Schema(
    {
        auteur: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Client',
            required: true,
        },

        prestataire: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Prestataire',
            required: true,
        },

        note: {
            type: Number,
            min: 1,
            max: 5,
            required: false,
        },

        commentaire: {
            type: String,
            trim: true,
            maxlength: 1000,
        },

        visible: {
            type: Boolean,
            default: true,
        },

        createdAt: {
            type: Date,
            default: Date.now,
        },

        updatedAt: Date,
    },
    { timestamps: true }
);

export default mongoose.model('Avis', avisSchema);
