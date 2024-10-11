import User from '../models/User.js';

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    /**TODO:
     * Vincular con reserva.
     * Encriptar password.
     * Enviar token */
    const user = new User({ name, email, password, role });
    const savedUser = await user.save();

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateUser = (req, res) => {
  res.send('Update user');
};
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: 'User not found' });
    return res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
