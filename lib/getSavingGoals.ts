import { promises as fs } from "fs";
import path from "path";

export async function getSavingGoals() {
  const filePath = path.join(process.cwd(), "data", "savingGoals.json");
  const file = await fs.readFile(filePath, "utf-8");
  return JSON.parse(file);
}