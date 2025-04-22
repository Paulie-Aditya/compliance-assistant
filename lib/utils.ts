import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function cleanupText(text: string){
  // Normalize unicode (e.g., smart quotes, long dashes)
  text = text.normalize("NFKC");
  
  // Replace hyphen + line break (common in OCR) with just a word continuation
  text = text.replace(/-\s*\n/g, '');
  
  // Replace newlines, carriage returns, and tabs with space
  text = text.replace(/[\n\r\t]/g, ' ');

  // Replace multiple spaces with a single space
  text = text.replace(/\s+/g, ' ');

  // Fix spacing before punctuation
  text = text.replace(/\s+([.,;:!?])/g, '$1');

  return text.trim();
}

