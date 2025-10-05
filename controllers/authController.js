import User from "../models/User.js";
import { generateUserToken } from "../utils/generateToken.js";


export const registerUser = async (req, res) => {
    try {
        const { name, sername, tel, password, login } = req.body;

        const userExists = await User.findOne({ login });
        if (userExists) return res.status(400).json({ message: "Користувач вже існує" });

        const user = await User.create({ name, sername, tel, login, password });
        console.log("JWT token:", generateUserToken(user._id));
        res.status(201).json({
            _id: user._id,
            name: user.name,
            sername: user.sername,
            login: user.login,
            tel: user.tel,
            token: generateUserToken(user._id)
        });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const loginUser = async (req, res) => {
    try {
        const { login, password } = req.body;

        const user = await User.findOne({ login });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                sername: user.sername,
                login: user.login,
                tel: user.tel,
                token: generateUserToken(user._id),
            });
        } else {
            res.status(401).json({ message: "Невірний логін або пароль" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) res.json(user);
    else res.status(404).json({ message: "Користувача не знайдено" });
};
export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "Користувача не знайдено" });

        const { name, sername, tel, login, password } = req.body;

        if (name) user.name = name;
        if (sername) user.sername = sername;
        if (tel) user.tel = tel;
        if (login) user.login = login;

        if (password) {
            user.password = password; // При збереженні має бути хешування в User моделі
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            sername: updatedUser.sername,
            login: updatedUser.login,
            tel: updatedUser.tel,
            token: generateUserToken(updatedUser._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
