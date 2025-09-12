declare module 'bcryptjs' {
  /**
   * Generate a hash for the given string.
   * @param s String to hash
   * @param salt Salt length to generate or salt to use
   * @param callback Callback function
   */
  export function hash(s: string, salt: string | number, callback?: (err: Error, hash: string) => void): Promise<string>;

  /**
   * Compare the given data against the given hash.
   * @param s Data to compare
   * @param hash Hash to compare to
   * @param callback Callback function
   */
  export function compare(s: string, hash: string, callback?: (err: Error, success: boolean) => void): Promise<boolean>;

  /**
   * Generate a salt with the given number of rounds.
   * @param rounds Number of rounds to use
   * @param callback Callback function
   */
  export function genSalt(rounds?: number, callback?: (err: Error, salt: string) => void): Promise<string>;

  /**
   * Returns the number of rounds used to encrypt a given hash.
   * @param hash Hash to check
   */
  export function getRounds(hash: string): number;

  /**
   * Synchronously generate a hash for the given string.
   * @param s String to hash
   * @param salt Salt length to generate or salt to use
   */
  export function hashSync(s: string, salt: string | number): string;

  /**
   * Synchronously compare the given data against the given hash.
   * @param s Data to compare
   * @param hash Hash to compare to
   */
  export function compareSync(s: string, hash: string): boolean;

  /**
   * Synchronously generate a salt with the given number of rounds.
   * @param rounds Number of rounds to use
   */
  export function genSaltSync(rounds?: number): string;
}
