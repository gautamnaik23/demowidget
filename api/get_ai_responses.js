// /api/get_ai_responses.js
import { google } from 'googleapis';
import credentials from './get_ai_responses.json';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { thread_id } = req.query;
    if (!thread_id) return res.status(400).json({ error: 'Missing thread_id' });

    // -------------------------------
    // Authenticate with Google Sheets
    // -------------------------------
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = '1R0XrgG_TaFesa5feugAV9cAoUOHJye1G7uVJ7X_QgyM'; // your sheet ID
    const range = 'Sheet1!A:G'; // adjust to match your columns: Thread ID, Messenger, Message, Timestamp, etc.

    const result = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    const rows = result.data.values || [];

    // Filter messages for this thread where Messenger = AI
    const aiMessages = rows
  .filter(r => r[0] === thread_id && r[2] === 'AI') // 0 = Thread ID, 2 = Messenger
  .map(r => ({
    message: r[3],        // column 3 = message text
    timestamp: r[4],      // column 4 = timestamp
    displayed: false       // for widget to track if message was already shown
  }))
  .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)); // sort ascending by timestamp
    return res.status(200).json(aiMessages);

  } catch (error) {
    console.error('get_ai_responses error:', error);
    return res.status(500).json({ message: 'Server error fetching AI responses' });
  }
}
