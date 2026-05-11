import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface ICategory extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  type: "income" | "expense" | "both";
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema<ICategory> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 100,
    },
    type: {
      type: String,
      required: true,
      enum: {
        values: ["income", "expense", "both"],
        message: "type must be 'income', 'expense', or 'both'",
      },
      default: "both",
    },
    color: {
      type: String,
      required: [true, "Color is required"],
      trim: true,
      match: [/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Invalid hex color"],
      default: "#6b7280",
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: false,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
  },
);

CategorySchema.index({ userId: 1, name: 1 }, { unique: true });

const Category: Model<ICategory> =
  mongoose.models.Category ||
  mongoose.model<ICategory>("Category", CategorySchema);

export default Category;
