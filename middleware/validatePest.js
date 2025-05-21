
import { z } from "zod";
const urlRegex = /^(https?:\/\/)[^\s$.?#].[^\s]*$/;

const pestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be under 100 characters"),
  image: z.string().regex(urlRegex, "Image URL is invalid").optional().or(z.literal("")),
  scientific: z.string().max(150, "Scientific name must be under 150 characters").optional().or(z.literal("")),
  category: z.enum(["Pest", "Disease"], { message: "Please select a valid category" }),
  crops: z.string().min(2, "Please enter affected crops").max(200, "Max 200 characters"),
  description: z.string().min(10, "Please enter a description of at least 10 characters"),

  symptoms: z.array(z.string().min(1, "Symptom can't be empty")).min(1, "Enter at least one symptom"),
  economicImpact: z.array(z.string().min(1, "Can't be empty")).optional().default([]),
  natural: z.array(z.string().min(1, "Can't be empty")).optional().default([]),
  biological: z.array(z.string().min(1, "Can't be empty")).optional().default([]),
  chemical: z.array(z.string().min(1, "Can't be empty")).optional().default([]),
  gallery: z.array(z.string().regex(urlRegex, "Invalid URL")).optional().default([]),

  notes: z.string().max(1000, "Notes must be under 1000 characters").optional().or(z.literal("")),
});


const validatePest = (req, res, next) => {
  try {
    req.body = pestSchema.parse(req.body);
    next();
  }catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ msg: error.errors[0].message, status: 0, errors: 'Validation failed' });
    }
    next(error);
  }
};
module.exports = {
    validatePest
  }