/// <reference types="cypress"/>


class Generate {

    /**
     * Generates a random alphanumeric string of a fixed length (currently 6 characters).
     * The string contains uppercase letters (A-Z), lowercase letters (a-z), and digits (0-9).
     * @returns A randomly generated string.
     */
    generateString(): string {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var string = '';

        for (var i = 0; i <= 5; ++i) {
            string += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return string;
    }
}

export const generate = new Generate(); 