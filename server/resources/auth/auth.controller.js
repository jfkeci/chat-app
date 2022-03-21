import { connect } from 'getstream';
import bcrypt from 'bcrypt'
import { StreamChat } from 'stream-chat';
import crypto from 'crypto';

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID;

export const signup = async (req, res) => {
  try {
    const { fullName, username, password, phoneNumber } = req.body;

    const userId = crypto.randomBytes(16).toString('hex');

    const serverClient = connect(api_key, api_secret, app_id);

    const hash = await bcrypt.hash(password, 10);

    const token = serverClient.createUserToken(userId);

    return res.status(200).json({
      token,
      fullName,
      username,
      userId,
      hash,
      phoneNumber
    });

  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const serverClient = connect(api_key, api_secret, app_id);

    const client = StreamChat.getInstance(api_key, api_secret);

    const { users } = await client.queryUsers({ name: username });

    if (!users.length) return res.status(409).json({ message: 'Invalid credentials' });

    const success = await bcrypt.compare(password, users[0].hashedPassword);

    const token = serverClient.createUserToken(users[0].id);

    if (success) return res.status(200).json({
      token,
      fullName: users[0].fullName,
      username,
      userId: users[0].id
    });

    return res.status(409).json({ message: 'Invalid credentials' });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error });
  }
};