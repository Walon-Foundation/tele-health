import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { validateFileUpload, generateSecureToken, secureJSONResponse, secureErrorResponse } from '@/utils/security';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_AUDIO_TYPES = ['audio/webm', 'audio/wav', 'audio/mp3', 'audio/ogg', 'audio/mpeg'];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('audio') as File;

    if (!file) {
      return secureErrorResponse('No audio file provided', 400);
    }

    // Validate file
    const validation = validateFileUpload(file, {
      maxSize: MAX_FILE_SIZE,
      allowedTypes: ALLOWED_AUDIO_TYPES,
    });

    if (!validation.valid) {
      return secureErrorResponse(validation.error || 'Invalid file', 400);
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'audio');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate secure filename with timestamp and random token
    const timestamp = Date.now();
    const secureToken = generateSecureToken(16);
    const extension = file.name.split('.').pop() || 'webm';
    const filename = `voice-${timestamp}-${secureToken}.${extension}`;
    const filepath = join(uploadsDir, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Additional security: Check file header (magic bytes) for audio files
    const isValidAudio = validateAudioFileHeader(buffer);
    if (!isValidAudio) {
      return secureErrorResponse('Invalid audio file format', 400);
    }
    
    await writeFile(filepath, buffer);

    // Return public URL
    const publicUrl = `/uploads/audio/${filename}`;

    return secureJSONResponse({
      url: publicUrl,
      filename,
      size: buffer.length,
      duration: null, // Could be calculated with ffprobe if needed
    });
  } catch (error) {
    console.error('Error uploading audio:', error);
    return secureErrorResponse('Failed to upload audio', 500);
  }
}

// Validate audio file by checking magic bytes
function validateAudioFileHeader(buffer: Buffer): boolean {
  // WebM: 0x1A 0x45 0xDF 0xA3
  if (buffer[0] === 0x1A && buffer[1] === 0x45 && buffer[2] === 0xDF && buffer[3] === 0xA3) {
    return true;
  }
  
  // WAV: RIFF....WAVE
  if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WAVE') {
    return true;
  }
  
  // MP3: ID3 or 0xFF 0xFB
  if (buffer.toString('ascii', 0, 3) === 'ID3' || (buffer[0] === 0xFF && buffer[1] === 0xFB)) {
    return true;
  }
  
  // OGG: OggS
  if (buffer.toString('ascii', 0, 4) === 'OggS') {
    return true;
  }
  
  return false;
}

// Optional: DELETE endpoint to remove old audio files
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get('filename');
    
    if (!filename) {
      return secureErrorResponse('Filename required', 400);
    }
    
    // Validate filename to prevent path traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return secureErrorResponse('Invalid filename', 400);
    }
    
    // TODO: Add authentication check here
    // Only allow deletion by the user who uploaded or counselor
    
    const filepath = join(process.cwd(), 'public', 'uploads', 'audio', filename);
    
    if (!existsSync(filepath)) {
      return secureErrorResponse('File not found', 404);
    }
    
    // Delete file
    const { unlink } = await import('fs/promises');
    await unlink(filepath);
    
    return secureJSONResponse({ success: true, message: 'File deleted' });
  } catch (error) {
    console.error('Error deleting audio:', error);
    return secureErrorResponse('Failed to delete audio', 500);
  }
}
