import mongoose, { Document, Schema } from 'mongoose';

// Interface para o documento Pokemon
export interface IPokemon extends Document {
  name: string;
  data: any; // Armazenará todo o JSON da resposta da API
  createdAt: Date;
  updatedAt: Date;
}

// Schema do Pokemon
const PokemonSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Criação do modelo
export default mongoose.model<IPokemon>('Pokemon', PokemonSchema);
