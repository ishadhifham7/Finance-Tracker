import mongoose, { Schema, Document, Types, Model } from "mongoose";

export type BudgetPeriod = "monthly";

export interface IBudget extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  categoryId: Types.ObjectId;
  amount: number;
  period: BudgetPeriod;
  createdAt: Date;
  updatedAt: Date;
}

const BudgetSchema: Schema<IBudget> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
      set: (v: number) => Math.round(v * 100) / 100,
    },
    period: {
      type: String,
      required: true,
      enum: {
        values: ["monthly"],
        message: "period must be 'monthly'",
      },
      default: "monthly",
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

BudgetSchema.index({ userId: 1, categoryId: 1 }, { unique: true });

const Budget: Model<IBudget> =
  mongoose.models.Budget || mongoose.model<IBudget>("Budget", BudgetSchema);

export default Budget;
