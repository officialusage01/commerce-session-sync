import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = process.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.VITE_CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.VITE_CLOUDINARY_API_SECRET;

// Endpoint to delete image from Cloudinary
app.delete('/api/cloudinary/delete', async (req, res) => {
  const { public_id } = req.body;

  if (!public_id) {
    return res.status(400).json({ error: 'public_id is required' });
  }

  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    // Generate signature
    const signature = crypto
      .createHash('sha1')
      .update(`public_id=${public_id}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`)
      .digest('hex');

    // Make request to Cloudinary API
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        public_id,
        timestamp,
        api_key: CLOUDINARY_API_KEY,
        signature,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Cloudinary deletion failed:', error);
      return res.status(response.status).json({ error });
    }

    const result = await response.json();
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return res.status(500).json({ error: 'Failed to delete image from Cloudinary' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 