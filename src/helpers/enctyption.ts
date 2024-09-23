import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const { jwtSecret } = require("./config")
export class EncryptionHelper {
    static async isPasswordValid(encryptedPassword: string, password: string): Promise<Boolean> {
        const isValid = await bcrypt.compare(password, encryptedPassword);
        return isValid;
    }

    static async savePassword(password: string): Promise<string> {
        try {
            const salt = await bcrypt.genSalt(10); // Generate salt
            const hashedPassword = await bcrypt.hash(password, salt); // Hash the password
            return hashedPassword; // Return the hashed password
        } catch (error) {
            throw new Error("Error hashing password");
        }
    }
    static generateJwToken(userDto) {
        return jwt.sign(userDto, jwtSecret, { expiresIn: "30d" })


    }
}