import fs from 'fs/promises';
import path from 'path';

/**
 * Safely reads a JSON file, creating it and its parent directory with default empty array []
 * if it doesn't exist. Prevents crashes by using try/catch on parse.
 * @param {string} filePath - Absolute or relative path to the JSON file
 * @returns {Promise<Array>} - The parsed JSON array
 */
export async function readJsonFile(filePath) {
  try {
    // Resolve absolute path to be sure
    const resolvedPath = path.resolve(process.cwd(), filePath);
    
    try {
      await fs.access(resolvedPath);
    } catch {
      // File doesn't exist: create parent directories and initialize file with []
      const dir = path.dirname(resolvedPath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(resolvedPath, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }

    const fileContent = await fs.readFile(resolvedPath, 'utf-8');
    if (!fileContent.trim()) {
      return [];
    }

    try {
      return JSON.parse(fileContent);
    } catch (parseErr) {
      console.error(`[Storage] Failed to parse JSON from ${filePath}. Returning empty array.`, parseErr);
      return [];
    }
  } catch (err) {
    console.error(`[Storage] Unexpected error reading ${filePath}:`, err);
    return [];
  }
}

/**
 * Safely writes data as a JSON file, creating parent directories if needed.
 * @param {string} filePath - Absolute or relative path to the JSON file
 * @param {any} data - Data to stringify and write
 * @returns {Promise<boolean>} - True if successful, false otherwise
 */
export async function writeJsonFile(filePath, data) {
  try {
    const resolvedPath = path.resolve(process.cwd(), filePath);
    const dir = path.dirname(resolvedPath);
    
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(resolvedPath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`[Storage] Unexpected error writing to ${filePath}:`, err);
    return false;
  }
}
