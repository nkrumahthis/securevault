import bcrypt from "bcrypt";
import mongoose from "mongoose"

const LinkSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  viewNumber: {
    type: Number,
    required: true,
    default: 1,
    validate: {
      validator: function (value: number) {
        return value >= 0;
      },
      message: (props: { value: any; }) => `${props.value} must be a positive number!`,
    },
  },
  lifetime: {
    type: Number,
    required: true,
    validate: {
      validator: function (value: number) {
        return value >= 0;
      },
      message: (props: { value: any; }) => `${props.value} must be a positive number!`,
    },
  },
  status: {
    type: String,
    enum: {
      values: ["Active", "Inactive"],
      message: "{VALUE} is not supported",
    },
    default: "Active",
  },
  passphrase: {
    type: String,
    required: false,
    default: null,
  },
  link: {
    type: String,
    unique: true,
  },
  expires_at: {
    type: Date,
  },
  created_at: {
    type: Date,
    default: new Date(),
  },
  my_id: {
    type: String
  }
});

LinkSchema.pre("save", async function (next) {
  this.expires_at = new Date(new Date(this.created_at).getTime() + this.lifetime);
  try {
    if (this.passphrase && this.isModified('passphrase')) {
      const salt = await bcrypt.genSalt(10);
      this.passphrase = await bcrypt.hash(this.passphrase, salt);
    }
    next();
  } catch (e) {
    next(e);
  }
});

LinkSchema.methods.comparePassphrase = async function (candidatePassphrase: string) {
  const isMatch = await bcrypt.compare(candidatePassphrase, this.passphrase);
  return isMatch;
};


export default mongoose.model("Link", LinkSchema);